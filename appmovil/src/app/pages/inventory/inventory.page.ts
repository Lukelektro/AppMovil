import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from 'src/app/services/cart.service';
import { MenuController,LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
}

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {

  filter: string = '';

  productos: Producto[] = [
    { id: 1, nombre: 'Comida para perros', categoria: 'Alimentos', precio: 15000 },
    { id: 2, nombre: 'Champú para gatos', categoria: 'Salud e Higiene', precio: 17000 },
    { id: 3, nombre: 'Juguete para roedores', categoria: 'Juguetes', precio: 12000 },
    { id: 4, nombre: 'Antiparasitario', categoria: 'Salud e Higiene', precio: 20000 },
    { id: 5, nombre: 'Toallitas húmedas', categoria: 'Sanitarios', precio: 5000 },
  ];

  categorias = ['Todos', 'Alimentos', 'Sanitarios', 'Salud e Higiene', 'Juguetes'];
  categoriaActual = 'Todos';
  
  cartItems$: Observable<CartItem[]>;
  cartTotal: number = 0;

  constructor(private cartService: CartService, private menuCtrl: MenuController, private route: ActivatedRoute, private loadingController: LoadingController) {
    this.cartItems$ = this.cartService.getCart();
  }

  ngOnInit() {
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

  removeFromCart(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  openCartMenu() {
    this.menuCtrl.open('cart-menu');
  }
}
