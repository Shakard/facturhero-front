export interface Province {
    provincia: string,
    cantones: {
        canton: string;
        parroquias: [];
    }
}
