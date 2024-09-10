import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.page.html',
  styleUrls: ['./citas.page.scss'],
})
export class CitasPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  agendarCita() {
    // Aquí puedes implementar la lógica para agendar la cita
    console.log('Cita agendada');
  }

}
