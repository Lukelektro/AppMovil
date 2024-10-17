import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from 'src/app/services/cart.service';
import { MenuController,LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Producto } from 'src/app/models/producto';



@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {

  filter: string = '';

  productos: Producto[] = [];

  CargarProductos() {

    this.firestoreService.getItemsChanges<Producto>('Productos').subscribe( data => {

      if (data) {
        this.productos = data
      }
      
    });

  }

  categorias = this.productos;
  categoriaActual = 'Todos';
  
  cartItems$: Observable<CartItem[]>;
  cartTotal: number = 0;

  constructor(private cartService: CartService, private menuCtrl: MenuController, private route: ActivatedRoute, private loadingController: LoadingController, private firestoreService: FirestoreService) {
    this.cartItems$ = this.cartService.getCart();
  }

  ngOnInit() {

    this.CargarProductos();


    // Leer parámetros de la URL
    this.route.queryParams.subscribe(params => {
      this.filter = params['filter'] || 'Todos';  
      this.categoriaActual = this.filter;
    });

    this.cartItems$.subscribe(() => {
      this.cartTotal = this.cartService.getTotal();
    });
  }

  setCategoriaActual(event: CustomEvent) {
    this.categoriaActual = event.detail.value;
  }

  get productosFiltrados(): Producto[] {
    if (this.categoriaActual === 'Todos') {
      return this.productos;
    }
    return this.productos.filter(p => p.categoria === this.categoriaActual);
  }

  async addToCart(product: Producto) {

    const loading = await this.loadingController.create({
      duration: 1000
    });
    await loading.present();
    await loading.onDidDismiss();
    this.cartService.addToCart(product);

  }

  removeFromCart(productId: string) {
    this.cartService.removeFromCart(productId);
  }

  openCartMenu() {
    this.menuCtrl.open('cart-menu');
  }
}
