import {Injectable} from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})

export class SweetAlertMessageService {

    success(response:any) {
        return Swal.fire({
            icon: 'success',
            title: response.msg.summary,
            text: response.msg.detail,
            padding: '1px',
            color: '#4f62fa',
        }).then(response);
    }

    successMessage(response:any) {
        return Swal.fire({
            title: response,
            padding: '1px',
            color: '#4f62fa',
        }).then(response);
    }

    error(error:any) {
        return Swal.fire({
            title: error,
            showCancelButton: false,
            confirmButtonText: "Ok",
            confirmButtonColor: "#0B253A",
        });
    }

    questionDelete({title = '¿Está seguro de eliminar?', text = 'No podrá recuperar esta información!'}) {
        return Swal.fire({
            title,
            text,
            icon: 'warning',
            width: '300px',
            color: 'red',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            padding: '2px',
            confirmButtonText: '<i class="pi pi-trash"> Eliminar!!!!!</i>'
        });
    }
}
