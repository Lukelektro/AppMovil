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
  loadingImages: { [key: string]: boolean } = {}; // Para controlar el estado de carga de cada imagen
  imageErrors: { [key: string]: boolean } = {};


  async CargarProductos() {
    try {
      this.firestoreService.getItemsChanges<Producto>('Productos').subscribe(async data => {
        if (data) {
          this.productos = data;
          console.log(this.productos);
  
          // Cargar las imágenes después de que los productos hayan sido cargados
          for (const producto of this.productos) {

            this.loadingImages[producto.id] = true;

            try {
              const url = await this.firestoreService.getImageUrl(producto.imagenUrl);
              producto.imagenUrl = url;
              console.log(url);
            } catch (error) {
              console.error(`Error al cargar imagen para producto ${producto.id}:`, error);
              producto.imagenUrl = 'assets/placeholder-image.jpg';
            } finally {
              this.loadingImages[producto.id] = false;
            }
            
          }
        }
      });
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  }
  

  // Método auxiliar para verificar si una imagen está cargando
  isImageLoading(productoId: string): boolean {
    return this.loadingImages[productoId] || false;
  }

  // Método para manejar errores de carga de imagen
  handleImageError(event: any, producto: Producto) {
    event.target.src = 'assets/placeholder-imagen.jpg';
    if (producto.id) {
      this.loadingImages[producto.id] = false;
    }
  }

  categorias = ['Todos','Alimentos','Sanitarios','Juguetes','Salud e Higiene'];
  categoriaActual = 'Todos';
  
  cartItems$: Observable<CartItem[]>;
  cartTotal: number = 0;

  constructor(
    private cartService: CartService, 
    private menuCtrl: MenuController, 
    private route: ActivatedRoute, 
    private loadingController: LoadingController, 
    private firestoreService: FirestoreService) {
  }

  ngOnInit() {

    this.cartItems$ = this.cartService.getCart();
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
