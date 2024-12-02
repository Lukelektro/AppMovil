import { Injectable } from '@angular/core';
import { SQLiteDBConnection, SQLiteConnection } from '@capacitor-community/sqlite';
import { Storage } from '@ionic/storage-angular';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite } from '@capacitor-community/sqlite';
import { FirestoreService } from './firestore.service'; // Importar FirestoreService

@Injectable({
  providedIn: 'root'
})
export class ServicioAlmacenamiento {
  private _almacenamiento: Storage | null = null; // para web.
  private dbSQLite: SQLiteDBConnection | null = null; // para móvil.
  private sqliteConnection: SQLiteConnection | null = null; // Conexión SQLite
  private usandoSQL: boolean = false; // Indicador de uso de SQLite o Ionic Storage
  private readonly DB_NAME = 'dbPetshopFancy';

  constructor(private storage: Storage, private firestoreService: FirestoreService) {
    this.inicializar(); // Se inicializa el almacenamiento
  }

  async getEmail(): Promise<string | null> {
    try {
      return await this.storage.get('email') || null;
    } catch (error) {
      console.error('Error reading email from storage:', error);
      return null;
    }
  }

  async setEmail(email: string): Promise<void> {
    try {
      await this.storage.set('email', email);
    } catch (error) {
      console.error('Error saving email to storage:', error);
    }
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
      // 1. Get SQLite connection
      this.sqliteConnection = new SQLiteConnection(CapacitorSQLite);
    
      // 2. Check for existing connection and close if needed
      const isConnection = await this.sqliteConnection.isConnection(this.DB_NAME, false);
      if (isConnection.result) {
        await this.sqliteConnection.closeConnection(this.DB_NAME, false);
      }
 
      // 3. Create new connection
      this.dbSQLite = await this.sqliteConnection.createConnection(
        this.DB_NAME,
        false,
        'no-encryption',
        1,
        false
      );

      // 4. Open database
      await this.dbSQLite.open();
      
      // 5. Set flag
      this.usandoSQL = true;
 
    } catch (error) {
      console.error('Error al inicializar SQLite:', error);
      this.usandoSQL = false;
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

  // Método para iniciar el almacenamiento local o SQLite, dependiendo del dispositivo
  public async inicializar() {
    if (Capacitor.isNativePlatform()) {
      await this.inicializarSQLite();
    } else {
      await this.inicializarIonicStorage();
    }
  }

  // Add cleanup method
  public async cleanup() {
    if (this.usandoSQL && this.sqliteConnection) {
      try {
        await this.sqliteConnection.closeConnection(this.DB_NAME, false);
      } catch (error) {
        console.error('Error al cerrar conexión SQLite:', error);
      }
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

  // Guardar un valor en el almacenamiento (SQLite o Firebase)
  public async establecer(entidad: string, key: string, value: any): Promise<void> {
    await this.asegurarAlmacenamientoInicializado();

    try {
      if (!key) {
        throw new Error('La clave no puede ser vacía.');
      }
      if (value === undefined) {
        throw new Error('El valor no puede ser indefinido.');
      }

      if (this.usandoSQL && this.dbSQLite) {
        // SQLite: Marcar el registro como no sincronizado (sincronizado = 0)
        const query = `INSERT OR REPLACE INTO ${entidad} (id, datos, sincronizado) VALUES (?, ?, 0)`;
        await this.dbSQLite.run(query, [key, JSON.stringify(value)]);
      } else {
        // Firebase: Insertar o actualizar documento usando FirestoreService
        await this.firestoreService.createDocumentID(value, entidad, key);
      }
    } catch (error) {
      console.error(`Error al guardar el valor para la clave: ${key}`, error);
      throw new Error(`No se pudo guardar el valor para la clave: ${key}.`);
    }
  }

  // Obtener un valor del almacenamiento (SQLite o Firebase)
  public async obtener(entidad: string, key: string): Promise<any> {
    await this.asegurarAlmacenamientoInicializado();

    try {
      if (!key) {
        throw new Error('La clave no puede ser vacía.');
      }

      if (this.usandoSQL && this.dbSQLite) {
        // SQLite: Obtener valor
        const query = `SELECT datos FROM ${entidad} WHERE id = ?`;
        const result = await this.dbSQLite.query(query, [key]);

        if (result && result.values && result.values.length > 0) {
          return JSON.parse(result.values[0].datos);
        } else {
          console.log(`No se encontraron datos para la clave: ${key}`);
          return null;
        }
      } else {
         // Firebase: Si es la colección Usuarios, usar getDocumentByEmail
        if (entidad === 'Usuarios' && (key === 'email' || key === 'password' || key === 'rememberMe')) {
          // Obtener el email almacenado localmente para buscar el documento
          const emailAlmacenado = await this.storage.get('email');
          if (emailAlmacenado) {
            const document = await this.firestoreService.getDocumentByEmail(entidad, emailAlmacenado);
            return document ? document[key] : null;
          }
          return null;
        } else {
          // Para otras colecciones usar getDocumentById
          const document = await this.firestoreService.getDocumentById(entidad, key);
          return document;
        }
      }
    } catch (error) {
      console.error(`Error al obtener el valor para la clave: ${key}`, error);
      throw new Error(`No se pudo obtener el valor para la clave: ${key}.`);
    }
  }

  // Eliminar un valor del almacenamiento (SQLite o Firebase)
  public async eliminar(entidad: string, key: string): Promise<void> {
    await this.asegurarAlmacenamientoInicializado();

    try {
      if (!key) {
        throw new Error('La clave no puede ser vacía.');
      }

      if (this.usandoSQL && this.dbSQLite) {
        // SQLite: Eliminar registro
        const query = `DELETE FROM ${entidad} WHERE id = ?`;
        await this.dbSQLite.run(query, [key]);
      } else {
        // Firebase: Eliminar documento usando FirestoreService
        await this.firestoreService.deleteDocument(entidad, key);
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
