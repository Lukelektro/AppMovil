 import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class ServicioAlmacenamiento {
  private _almacenamiento: Storage | null = null;

  constructor(private storage: Storage) {
    this.inicializar(); // se inicializa el almacenamiento
  }

  // metodo asincrono para iniciar el local storage
  async inicializar() {
    const almacenamiento = await this.storage.create();
    this._almacenamiento = almacenamiento;
  }

  // de igual forma, cree otro metodo para asegurarse de que el almacenamiento este inicializado (mejor tenerlo por si acaso)
  private async asegurarAlmacenamientoInicializado(): Promise<void> {
    if (!this._almacenamiento) {
      await this.inicializar();
    }
  }

  // Guardar un valor en el almacenamiento
  public async establecer(key: string, value: any): Promise<any> {
    await this.asegurarAlmacenamientoInicializado();
    return this._almacenamiento?.set(key, value);
  }

  // Obtener un valor del almacenamiento
  public async obtener(key: string): Promise<any> {
    await this.asegurarAlmacenamientoInicializado();
    return this._almacenamiento?.get(key);
  }

  // Eliminar un valor del almacenamiento
  public async eliminar(key: string): Promise<any> {
    await this.asegurarAlmacenamientoInicializado();
    return this._almacenamiento?.remove(key);
  }

  // Limpiar el almacenamiento
  public async limpiar(): Promise<void> {
    await this.asegurarAlmacenamientoInicializado();
    await this._almacenamiento?.clear();
  }
}
