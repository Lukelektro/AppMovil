import { Network } from '@capacitor/network';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InternetstatusService {
  private isOnline: boolean = true;

  constructor() {
    this.checkInternetInicial();
    this.listenerCambiosInternet();
  }

  // Chequeo inicial para saber si tiene conexión a internet
  async checkInternetInicial(): Promise<void> {
    try {
      const status = await Network.getStatus();
      this.isOnline = status.connected;
      console.log(`Estado inicial de conexión: ${this.isOnline}`);
    } catch (error) {
      console.error('Error al verificar el estado inicial de la conexión a internet:', error);
    }
  }

  // Metodo para verificar cambios en la red
  listenerCambiosInternet() {
    Network.addListener('networkStatusChange', (status) => {
      this.isOnline = status.connected;
      console.log('Estado de la red cambiado: ', this.isOnline ? 'En línea' : 'Sin conexión');
    });
  }

  // Método para verificar el estado actual
  estaConectado(): boolean {
    console.log(`Estado de conexión verificado: ${this.isOnline}`);
    return this.isOnline;
  }
}
