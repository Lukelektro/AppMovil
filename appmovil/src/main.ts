import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { register } from 'swiper/element/bundle';
import { enableProdMode, NgZone } from '@angular/core';
import { environment } from './environments/environment';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
defineCustomElements(window);

register();

if (environment.production) {
  enableProdMode();
}

// Aquí especificas que no usarás Zone.js para la detección de cambios
platformBrowserDynamic()
  .bootstrapModule(AppModule, { ngZone: 'noop' })  // 'noop' para zoneless
  .catch(err => console.log(err));

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
