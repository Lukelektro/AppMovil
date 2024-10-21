import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { InternetstatusService } from './internetstatus.service';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root'
})
export class SincronizarStorageService {
  constructor(
    private firestoreService: FirestoreService,
    private connectivityService: InternetstatusService
  ) {}

  // Sincronización en lotes con Firebase
  public async sincronizarConFirebase(entidad: string, dbSQLite: SQLiteDBConnection | null, batchSize: number = 10): Promise<void> {
    if (this.connectivityService.estaConectado()) {
      try {
        if (dbSQLite) {
          let offset = 0;
          let continueSyncing = true;

          while (continueSyncing) {
            const query = `SELECT * FROM ${entidad} WHERE sincronizado = 0 LIMIT ${batchSize} OFFSET ${offset}`;
            const result = await dbSQLite.query(query);

            if (result.values.length === 0) {
              continueSyncing = false;
            } else {
              for (let row of result.values) {
                const data = JSON.parse(row.datos);
                await this.firestoreService.createDocumentID(entidad, data, row.id);

                // Marcar el registro como sincronizado
                const updateQuery = `UPDATE ${entidad} SET sincronizado = 1 WHERE id = ?`;
                await dbSQLite.run(updateQuery, [row.id]);
              }

              offset += batchSize;
            }
          }

          console.log(`Sincronización en lotes completada para la entidad ${entidad}.`);
        }
      } catch (error) {
        console.error(`Error al sincronizar los datos de ${entidad} en lotes con Firebase:`, error);
        throw new Error(`No se pudo sincronizar los datos locales de ${entidad} en lotes con Firebase.`);
      }
    } else {
      console.log('Sin conexión a Internet. Sincronización no disponible.');
    }
  }
}

