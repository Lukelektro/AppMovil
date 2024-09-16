export class Usuario {
    static nextId = 1;
    id: number;
    nombre: string;
    email: string;
    password: string;
    telefono: string;
    ciudad: string;

    constructor(nombre: string = '', email: string = '', password: string = '', telefono: string = '', ciudad: string = '') {
        this.id = Usuario.nextId++;
        this.nombre = nombre;
        this.email = email;
        this.password = password;
        this.telefono = telefono;
        this.ciudad = ciudad;
    }
}