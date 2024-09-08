import { NavController } from '@ionic/angular';
import { Component } from '@angular/core';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
})
export class TabComponent {
  constructor(
    private navController: NavController,
    private animationCtrl: AnimationController
  ) {}

  // Método para crear una animación personalizada
  createAnimation() {
    const animation = this.animationCtrl.create()
      .duration(500)
      .easing('ease-in-out')
      .fromTo('opacity', '0', '1'); // Aquí puedes cambiar la animación que desees
    return animation;
  }

  // Método para navegar con animación
  async navigateWithAnimation(url: string) {
    const animation = this.createAnimation();
    await animation.play(); // Ejecuta la animación
    this.navController.navigateForward(url); // Navega después de la animación
  }
}
