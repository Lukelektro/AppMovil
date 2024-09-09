import { Component, Input,OnInit } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent  implements OnInit {

  searchActive = false;
  searchQuery = '';

  constructor() { }

  toggleSearch() {
    this.searchActive = !this.searchActive;
    if (!this.searchActive) {
      this.searchQuery = '';
    }
  }

  handleSearch(event: any) {
    // Implementa aquí la lógica de búsqueda
    console.log('Buscando:', this.searchQuery);
  }

  ngOnInit() {}

}
