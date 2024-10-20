import { Injectable } from '@angular/core';
import { SQLiteDBConnection, SQLiteConnection } from '@capacitor-community/sqlite';
import { Storage } from '@ionic/storage-angular';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root'
})
export class ServicioAlmacenamiento {
  private _almacenamiento: Storage | null = null; // para web.
  private dbSQLite: SQLiteDBConnection | null = null; // para móvil.
  private sqliteConnection: SQLiteConnection | null = null; // Conexión SQLite
  private usandoSQL: boolean = false; // Indicador de uso de SQLite o Ionic Storage

  constructor(private storage: Storage) {
    this.inicializar(); // Se inicializa el almacenamiento
  }

  // Inicializa Ionic Storage para el entorno web
  private async inicializarIonicStorage() {
    try {
      if (!this._almacenamiento) {
        const almacenamiento = await this.storage.create();
        this._almacenamiento = almacenamiento;
      }
    } catch (error) {
      console.error('Error al inicializar almacenamiento Ionic:', error);
      throw new Error('No se pudo inicializar el almacenamiento local. (inicializarIonicStorage)');
    }
  }

  // Inicializa SQLite para el entorno móvil
  private async inicializarSQLite() {
    try {
      if (!this.dbSQLite) {
        this.sqliteConnection = new SQLiteConnection(CapacitorSQLite);
    
        this.dbSQLite = await this.sqliteConnection.createConnection('dbPetshopFancy', false, 'no-encryption', 1, false);
        await this.dbSQLite.open();
        await this.crearTabla('entidad_generica');
      } else {
        console.warn('La conexión SQLite ya está activa.');
      }
    } catch (error) {
      console.error('Error al inicializar SQLite: ', error);
      throw new Error('No se pudo inicializar la conexión a SQLite. (inicializarSQLite)');
    }
  }

  // Crear tabla en SQLite con estado de sincronización
  private async crearTabla(entidad: string) {
    try {
      if (!this.dbSQLite) {
        throw new Error('La conexión a la base de datos SQLite no está inicializada. (crearTabla)');
      }
  
      const query = ` 
        CREATE TABLE IF NOT EXISTS ${entidad} (
          id TEXT PRIMARY KEY,
          datos TEXT,
          sincronizado INTEGER DEFAULT 0  -- 0 = no sincronizado, 1 = sincronizado
        )
      `;
      console.log(`Ejecutando consulta para crear la tabla: ${entidad}`);
      
      await this.dbSQLite.execute(query);
      console.log(`Tabla "${entidad}" creada o ya existe.`);
      
    } catch (error) {
      console.error(`Error al crear la tabla ${entidad} en SQLite:`, error);
      throw new Error(`No se pudo crear la tabla ${entidad} en SQLite. (crearTabla)`);
    }
  }

  // Método asincrónico para iniciar el almacenamiento local o SQLite, dependiendo del dispositivo
  async inicializar() {
    try {
      const platform = Capacitor.getPlatform();

      if (platform === 'ios' || platform === 'android') {
        this.usandoSQL = true;
        await this.inicializarSQLite();
      } else if (platform === 'web') {
        await this.inicializarIonicStorage();
      } else {
        console.warn(`Plataforma desconocida: ${platform}. Usando almacenamiento por defecto.`);
        await this.inicializarSQLite();
      }
      
    } catch (error) {
      console.error('Error al inicializar almacenamiento:', error);
      throw new Error('Error inicializando el sistema de almacenamiento. (inicializar)');
    }
  }

  // Asegura que el almacenamiento esté inicializado
  private async asegurarAlmacenamientoInicializado(): Promise<void> {
    try {
      if (this.usandoSQL) {
        if (!this.dbSQLite) {
          console.log('Inicializando SQLite...');
          await this.inicializarSQLite();
          console.log('SQLite inicializado correctamente.');
        } else {
          console.log('SQLite ya está inicializado.');
        }
      } else {
        if (!this._almacenamiento) {
          console.log('Inicializando Ionic Storage...');
          await this.inicializarIonicStorage();
          console.log('Ionic Storage inicializado correctamente.');
        } else {
          console.log('Ionic Storage ya está inicializado.');
        }
      }
    } catch (error) {
      console.error('Error al asegurar que el almacenamiento esté inicializado:', error);
      throw new Error('No se pudo inicializar el almacenamiento. (asegurarAlmacenamientoInicializado)');
    }
  }

  // Guardar un valor en el almacenamiento
  public async establecer(entidad: string, key: string, value: any): Promise<void> {
    await this.asegurarAlmacenamientoInicializado();

    try {
      // Validaciones de las columnas
      if (!key) {
        throw new Error('La clave no puede ser vacía.');
      }
      if (value === undefined) {
        throw new Error('El valor no puede ser indefinido.');
      }

      if (this.usandoSQL && this.dbSQLite) {
        // Marcar el registro como no sincronizado (sincronizado = 0)
        const query = `INSERT OR REPLACE INTO ${entidad} (id, datos, sincronizado) VALUES (?, ?, 0)`;
        await this.dbSQLite.run(query, [key, JSON.stringify(value)]);
      } else if (this._almacenamiento) {
        await this._almacenamiento.set(key, value);
      }
    } catch (error) {
      console.error(`Error al guardar el valor para la clave: ${key}`, error);
      throw new Error(`No se pudo guardar el valor para la clave: ${key}.`);
    }
  }

  // Obtener un valor del almacenamiento
  public async obtener(entidad: string, key: string): Promise<any> {
    await this.asegurarAlmacenamientoInicializado();

    try {
      if (!key) {
        throw new Error('La clave no puede ser vacía.');
      }

      if (this.usandoSQL && this.dbSQLite) {
        const query = `SELECT datos FROM ${entidad} WHERE id = ?`;
        const result = await this.dbSQLite.query(query, [key]);

        if (result && result.values && result.values.length > 0) {
          return JSON.parse(result.values[0].datos);
        } else {
          console.log(`No se encontraron datos para la clave: ${key}`);
          return null;
        }
      } else if (this._almacenamiento) {
        return await this._almacenamiento.get(key);
      }
    } catch (error) {
      console.error(`Error al obtener el valor para la clave: ${key}`, error);
      throw new Error(`No se pudo obtener el valor para la clave: ${key}.`);
    }

    return null;
  }



  // Eliminar un valor del almacenamiento
  public async eliminar(key: string): Promise<void> {
    await this.asegurarAlmacenamientoInicializado();

    try {
      if (!key) {
        throw new Error('La clave no puede ser vacía.');
      }

      if (this.usandoSQL && this.dbSQLite) {
        const query = `DELETE FROM datos WHERE clave = ?`;
        await this.dbSQLite.run(query, [key]);
      } else if (this._almacenamiento) {
        await this._almacenamiento.remove(key);
      }
    } catch (error) {
      console.error(`Error al eliminar el valor para la clave: ${key}`, error);
      throw new Error(`No se pudo eliminar el valor para la clave: ${key}.`);
    }
  }

  // Limpiar el almacenamiento
  public async limpiar(): Promise<void> {
    await this.asegurarAlmacenamientoInicializado();

    try {
      if (this.usandoSQL && this.dbSQLite) {
        const query = `DELETE FROM datos`;
        await this.dbSQLite.run(query);
      } else if (this._almacenamiento) {
        await this._almacenamiento.clear();
      }
    } catch (error) {
      console.error('Error al limpiar el almacenamiento:', error);
      throw new Error('No se pudo limpiar el almacenamiento.');
    }
  }
}
