import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {

  searchActive = false;
  searchQuery = '';
  themeToggle = false; // Agregado: Variable para el toggle del tema oscuro

  constructor() {
    this.initDarkMode();
  }

  ngOnInit() {}

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

  initDarkMode() {
    // Usa matchMedia para comprobar la preferencia del usuario
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Inicializa el tema oscuro basado en el valor inicial de la consulta media prefers-color-scheme
    this.initializeDarkTheme(prefersDark.matches);

    // Escucha los cambios en la consulta media prefers-color-scheme
    prefersDark.addEventListener('change', (mediaQuery) => this.initializeDarkTheme(mediaQuery.matches));
  }

  // Verifica/desmarca el toggle y actualiza el tema basado en isDark
  initializeDarkTheme(isDark: boolean) {
    this.themeToggle = isDark;
    this.toggleDarkTheme(isDark);
  }

  // Escucha el cambio del toggle para alternar el tema oscuro
  toggleChange(ev: any) {
    this.toggleDarkTheme(ev.detail.checked);
  }

  // Agrega o elimina la clase "dark" en el body del documento
  toggleDarkTheme(shouldAdd: boolean) {
    document.body.classList.toggle('dark', shouldAdd);
  }
}
