interface InventoryStatus {
    label: string;
    value: string;
}
export interface Product {
    id?: string;
    codigo?: string;
    name?: string;
    descripcion?: string;
    precio_venta?: number;
    cantidad?: number;
    inventoryStatus?: InventoryStatus;
    category?: string;
    image?: string;
    rating?: number;
}
