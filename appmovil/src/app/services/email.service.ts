import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Importa Router
import { Functions, getFunctions, httpsCallable } from '@angular/fire/functions';
import { FirestoreService } from 'src/app/services/firestore.service';

interface EmailRequest {
  email: string;
  recoveryCode: string;
}

interface EmailResponse {
  success: boolean;
  message: string;
  code?: string;
}

interface FirebaseFunctionResult {
  data: EmailResponse;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private functions: Functions;
  
  constructor(private http: HttpClient, private router: Router, private firestoreService: FirestoreService ){ // Inyecta Router
    this.functions = getFunctions();
  }

  async sendPasswordRecoveryEmail(email: string): Promise<EmailResponse> {
    try {
      const recoveryCode = this.generateRecoveryCode();

      // Asociar el recoveryCode al usuario en Firestore
      const usuario = await this.firestoreService.getDocumentByEmail('Usuarios', email);

      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      await this.firestoreService.updateDocument('Usuarios', usuario.id, { recoveryCode });
      
      const response = await fetch('https://us-central1-pet-fancy.cloudfunctions.net/sendRecoveryEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email, 
          recoveryCode 
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to send recovery email');
      }
  
      const result = await response.json();
  
      console.log('Respuesta del servidor:', result);
      
      if (result.success) {
        return {
          success: true,
          message: 'Correo enviado exitosamente',
          code: recoveryCode
        };
      }
  
      throw new Error(result.message || 'Error al enviar el correo');
    } catch (error: any) {
      console.error('Error enviando correo:', error);
      return {
        success: false,
        message: error.message || 'No se pudo enviar el correo de recuperación'
      };
    }
  }

  async verifyRecoveryCode(email: string, code: string): Promise<{ success: boolean; message: string }> {
    try {
      const usuario = await this.firestoreService.getDocumentByEmail('Usuarios', email);

      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      if (usuario.recoveryCode === code) {
        return {
          success: true,
          message: 'Código de recuperación verificado correctamente'
        };
      } else {
        return {
          success: false,
          message: 'Código de recuperación incorrecto'
        };
      }
    } catch (error: any) {
      console.error('Error al verificar el código de recuperación:', error);
      return {
        success: false,
        message: error.message || 'Error al verificar el código de recuperación'
      };
    }
  }

  private generateRecoveryCode(): string {
    const length = 6;
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return Array.from(
      { length }, 
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join('');
  }
}