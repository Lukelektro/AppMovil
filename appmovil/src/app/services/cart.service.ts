import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})

export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  getCart() {
    return this.cartSubject.asObservable();
  }

  addToCart(product: { id: number, nombre: string, precio: number }) {
    const itemIndex = this.cartItems.findIndex(item => item.id === product.id);
    if (itemIndex > -1) {
      this.cartItems[itemIndex].cantidad += 1;
    } else {
      this.cartItems.push({ ...product, cantidad: 1 });
    }
    this.cartSubject.next([...this.cartItems]);
  }

  removeFromCart(productId: number) {
    const index = this.cartItems.findIndex(item => item.id === productId);
    if (index > -1) {
      if (this.cartItems[index].cantidad > 1) {
        this.cartItems[index].cantidad -= 1;
      } else {
        this.cartItems.splice(index, 1);
      }
      this.cartSubject.next([...this.cartItems]);
    }
  }

  getTotal() {
    return this.cartItems.reduce((total, item) => total + item.precio * item.cantidad, 0);
  }
}
