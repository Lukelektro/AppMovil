import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  pageTitle: string = 'Home';

  constructor(private router: Router) {}


  

  goToInventory(categoria: string = '') {
    this.router.navigate(['/tab/inventory'], { queryParams: { filter: categoria } });
  }
  
  goToCitas() {
    this.router.navigate(['/tab/citas']);
  }

}
