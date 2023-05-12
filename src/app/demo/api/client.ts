import { Address } from "./address";

export interface Client {
    id?: string;
    ruc?: string;
    razon_social?: string;
    telefono?: string;
    address?: Address;
    correo?: string;
}
