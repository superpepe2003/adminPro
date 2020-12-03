import { Usuario } from '../models/usuarios.model';

export interface CargarUsuarios {
    total: number;
    usuarios: Usuario[];
}
