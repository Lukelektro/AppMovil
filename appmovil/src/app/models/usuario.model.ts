export class Usuario {
    static nextId = 1;
    id: number;
    email: string;
    password: string;

    constructor(email: string = '', password: string = '') {
        this.id = Usuario.nextId++;
        this.email = email;
        this.password = password;
    }
}