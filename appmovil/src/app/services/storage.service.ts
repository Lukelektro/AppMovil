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

  // Método asincrónico para iniciar el almacenamiento local o SQLite, dependiendo del dispositivo
  async inicializar() {
    if (Capacitor.getPlatform() !== 'web') {
      this.usandoSQL = true;
      await this.inicializarSQLite();
    } else {
      this.usandoSQL = false;
      await this.inicializarIonicStorage();
    }
  }

  // Inicializa Ionic Storage para el entorno web
  private async inicializarIonicStorage() {
    const almacenamiento = await this.storage.create();
    this._almacenamiento = almacenamiento;
  }

  // Inicializa SQLite para el entorno móvil
  private async inicializarSQLite() {
    try {
      // Creamos la conexión
      this.sqliteConnection = new SQLiteConnection(CapacitorSQLite);

      // Abrimos la base de datos
      this.dbSQLite = await this.sqliteConnection.createConnection('dbPetshopFancy', false, 'no-encryption', 1, false);
      await this.dbSQLite.open();

      // Crear tabla si no existe
      await this.crearTabla();
    } catch (error) {
      console.error('Error al inicializar SQLite: ', error);
    }
  }

  // Crear tabla en SQLite si no existe
  private async crearTabla() {
    try {
      if (this.dbSQLite) {
        const query = `CREATE TABLE IF NOT EXISTS datos (clave TEXT PRIMARY KEY, valor TEXT)`;
        await this.dbSQLite.execute(query); 
      }
    } catch (error) {
      console.error('Error al crear la tabla en SQLite: ', error);
    }
  }

  // Asegurarse de que el almacenamiento esté inicializado
  private async asegurarAlmacenamientoInicializado(): Promise<void> {
    if (this.usandoSQL && !this.dbSQLite) {
      await this.inicializarSQLite();
    } else if (!this.usandoSQL && !this._almacenamiento) {
      await this.inicializarIonicStorage();
    }
  }

  // Guardar un valor en el almacenamiento
  public async establecer(key: string, value: any): Promise<any> {
    await this.asegurarAlmacenamientoInicializado();

    try {
      if (this.usandoSQL && this.dbSQLite) {
        const query = `INSERT OR REPLACE INTO datos (clave, valor) VALUES (?, ?)`;
        await this.dbSQLite.run(query, [key, JSON.stringify(value)]);
      } else if (this._almacenamiento) {
        return await this._almacenamiento.set(key, value);
      }
    } catch (error) {
      console.error(`Error al guardar el valor para la clave: ${key}`, error);
    }
  }

  // Obtener un valor del almacenamiento
  public async obtener(key: string): Promise<any> {
    await this.asegurarAlmacenamientoInicializado();
  
    try {
      if (this.usandoSQL && this.dbSQLite) {
        const query = `SELECT valor FROM datos WHERE clave = ?`;
        const result = await this.dbSQLite.query(query, [key]);
  
        if (result && result.values && result.values.length > 0) {
          return JSON.parse(result.values[0].valor);
        } else {
          console.log(`No se encontraron datos para la clave: ${key}`);
          return null;
        }
      } else if (this._almacenamiento) {
        return await this._almacenamiento.get(key);
      }
    } catch (error) {
      console.error(`Error al obtener el valor para la clave: ${key}`, error);
      return null;
    }
  
    return null;
  }

  // Eliminar un valor del almacenamiento
  public async eliminar(key: string): Promise<any> {
    await this.asegurarAlmacenamientoInicializado();

    try {
      if (this.usandoSQL && this.dbSQLite) {
        const query = `DELETE FROM datos WHERE clave = ?`;
        await this.dbSQLite.run(query, [key]);
      } else if (this._almacenamiento) {
        return await this._almacenamiento.remove(key);
      }
    } catch (error) {
      console.error(`Error al eliminar el valor para la clave: ${key}`, error);
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
      console.error('Error al limpiar el almacenamiento: ', error);
    }
  }
}
