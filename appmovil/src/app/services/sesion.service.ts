import { Injectable } from '@angular/core';
import { FirestoreService,  } from './firestore.service';  // Usa tu propio servicio

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  constructor(private firestoreService: FirestoreService) {}

  async crearSesion(usuarioId: string, rememberMe: boolean): Promise<void> {
    try {
      // Validación de entradas
      if (!usuarioId || typeof usuarioId !== 'string') {
        throw new Error('El ID del usuario es inválido.');
      }
  
      if (typeof rememberMe !== 'boolean') {
        throw new Error('El valor de rememberMe debe ser un booleano.');
      }
  
      // Generamos los valores de la sesión
      const nuevaSesion = {
        id: this.firestoreService.createIdDoc(),  // Genera un ID automático
        usuarioId: usuarioId,  // Relación con la tabla Usuarios
        tokenSesion: this.generarToken(),
        fechaInicio: new Date(),
        rememberMe: rememberMe  // Aquí pasamos el valor de rememberMe correctamente
      };
  
      // Verificamos que los datos de la sesión son correctos antes de guardar
      if (!nuevaSesion.id || !nuevaSesion.tokenSesion) {
        throw new Error('Error al generar la sesión: ID o Token no válido.');
      }
  
      console.log("Nueva sesión creada: ", nuevaSesion);
  
      // Guardamos la sesión en Firestore en la colección 'Sesiones'
      await this.firestoreService.createDocumentID(nuevaSesion, 'Sesiones', nuevaSesion.id);
  
      console.log('Sesión guardada exitosamente en Firestore.');
    } catch (error) {
      // Manejo de errores durante la creación de la sesión
      console.error('Error durante la creación de la sesión: ', error);
      throw new Error('No se pudo crear la sesión. ' + error);
    }
  }

  async getSesionActiva(usuarioId: string): Promise<any> {
    try {
      // Usamos getItemsByQuery para buscar todas las sesiones del usuario con el ID proporcionado
      const sesiones = await this.firestoreService.getItemsByQuery('Sesiones', 'usuarioId', '==', usuarioId);
  
      // Retorna la primera sesión encontrada (o la condición que necesites)
      if (sesiones && sesiones.length > 0) {
        console.log(`Sesión activa encontrada para el usuario ${usuarioId}: `, sesiones[0]);
        return sesiones[0]; // Aquí tomamos la primera sesión encontrada
      } else {
        return null; // No hay sesión activa
      }
    } catch (error) {
      console.error('Error al buscar sesión activa: ', error);
      throw new Error('Error al verificar la sesión activa.');
    }
  }
  
  
  // Método para generar un token de sesión
  private generarToken(): string {
    return Math.random().toString(36).substring(2);
  }
}
