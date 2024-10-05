import { Component } from '@angular/core';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.page.html',
  styleUrls: ['./tab.page.scss'],
})
export class TabPage {
  isExpanded = false;

  togglePandaOptions(): void {
    this.isExpanded = !this.isExpanded;
  }
}