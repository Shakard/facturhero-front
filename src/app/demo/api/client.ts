import { Address } from "./address";

export interface Client {
    id?: string;
    tipo_identificacion?: string;
    identificacion?: string;
    razon_social?: string;
    telefono?: string;
    address?: Address;
    correo?: string;
}
