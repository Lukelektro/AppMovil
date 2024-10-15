import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Producto } from 'src/app/models/producto';
import { FirestoreService } from 'src/app/services/firestore.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  pageTitle: string = 'Home';

  productos: Producto[] = [];

  constructor(private router: Router, private firestoreService: FirestoreService) {
    this.CargarProductos();
  }


  CargarProductos() {

    this.firestoreService.getItemsChanges<Producto>('Productos').subscribe( data => {

      if (data) {
        this.productos = data
      }
    });

  }

  goToInventory(categoria: string = '') {
    this.router.navigate(['/tab/inventory'], { queryParams: { filter: categoria } });
  }
  
  goToCitas() {
    this.router.navigate(['/tab/citas']);
  }

}
