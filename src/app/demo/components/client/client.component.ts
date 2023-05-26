import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Client } from '../../api/client';
import { ClientService } from '../../service/client.service';
import Swal from 'sweetalert2';
import { Province } from '../../api/province';
import { ProvinceService } from '../../service/province.service';
import { Invoice } from '../../api/invoice';
import { InvoiceService } from '../../service/invoice.service';
import { Router } from '@angular/router';

interface TypeOfId {
    name: string;
    value: string;
}

@Component({
    selector: 'app-client',
    templateUrl: './client.component.html',
    styleUrls: ['./client.component.scss']
})
export class ClientComponent {
    clientDialog: boolean;
    clients: Client[];
    clientInvoices: Invoice[];
    client: Client;
    clientId: any;
    selectedClients: Client[];
    submitted: boolean;
    provinces: Province[];
    statuses: any[];
    cantons: any[];
    editingClient: boolean;
    typesOfIds: TypeOfId[];

    formClient: FormGroup;

    constructor(private clientService: ClientService, private provinceService: ProvinceService, private invoiceService: InvoiceService, public router: Router) { }

    ngOnInit() {
        this.getClients();
        this.getProvinces();
        this.buildFormClient();
        this.getTypesOfIds();
    }

    getTypesOfIds() {
        this.typesOfIds = [
            { name: 'RUC', value: '04' },
            { name: 'Cedula', value: '05' },
            { name: 'Pasaporte', value: '06' },
            { name: 'Consumidor final', value: '07' },
            { name: 'Identificacion exterior', value: '08' }
        ];
    }

    getClients() {
        this.clientService.getClients().subscribe((data: Client[]) => {
            this.clients = data;
            console.log(this.clients);
        });
    }

    getProvinces() {
        this.provinceService.getProvinces().then(data => {
            this.provinces = data.data,
                console.log(this.provinces);
        });
    }

    buildFormClient() {
        this.formClient = new FormGroup({
            typeOfId: new FormControl('', Validators.required),
            identification: new FormControl('', Validators.required),
            name: new FormControl('', Validators.required),
            phone: new FormControl('', Validators.required),
            country: new FormControl(''),
            province: new FormControl('', Validators.required),
            canton: new FormControl('', Validators.required),
            address: new FormControl('', Validators.required),
            addressDetail: new FormControl(''),
            zipCode: new FormControl(''),
            email: new FormControl('', [Validators.email, Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
            userId: new FormControl(''),
            addressId: new FormControl('')
        });
    }

    get f() {
        return this.formClient.controls;
    }

    openNew() {
        this.client = {};
        this.formClient.reset();
        this.submitted = false;
        this.editingClient = false;
        this.clientDialog = true;
    }

    deleteSelectedclients() {

    }

    openEditClient(client: Client) {
        console.log(client);
        this.clientId = client.id;
        this.formClient.patchValue({ typeOfId: client.tipo_identificacion });
        this.formClient.patchValue({ identification: client.identificacion });
        this.formClient.patchValue({ name: client.razon_social });
        this.formClient.patchValue({ phone: client.telefono });
        this.formClient.patchValue({ country: 'ECUADOR' });
        this.formClient.patchValue({ province: client.address.province });
        this.formClient.patchValue({ canton: client.address.city });
        this.formClient.patchValue({ address: client.address.line1 });
        this.formClient.patchValue({ addressDetail: client.address.line2 });
        this.formClient.patchValue({ zipCode: client.address.zip });
        this.formClient.patchValue({ email: client.correo });
        this.formClient.patchValue({ addressId: client.address.id });
        this.getCantons(client.address.province);
        this.clientDialog = true;
        this.editingClient = true;
    }

    deleteClient(client: Client) {
        this.questionDelete({}).then((result) => {
            if (result.isConfirmed) {
                console.log(client);
                this.clientService.deleteClient(client.id).subscribe(res => {
                    console.log('Client deleted successfully!');
                    this.getClients();
                    this.deletedAlert();
               })
            }
        });

    }

    hideDialog() {
        this.clientDialog = false;
        this.submitted = false;
    }

    newClient() {
        const userId = localStorage.getItem('id');
        this.formClient.patchValue({ country: 'ECUADOR' });
        this.formClient.patchValue({ userId: userId });
        console.log(this.formClient.value);
        this.clientService.createClient(this.formClient.value).subscribe(res => {
            console.log('client created successfully!');
            this.getClients();
            this.formClient.reset();
            this.hideDialog();
            this.successAlert();
        })
    }

    editClient() {
        console.log(this.formClient.value);
        this.clientService.updateClient(this.clientId, this.formClient.value).subscribe(res => {
            console.log('Client updated successfully!');
            this.getClients();
            this.formClient.reset();
            this.hideDialog();
            this.successAlert();
        })
    }

    submit() {
        if (this.clientId) {
            console.log('cliente actualizado');

            this.editClient();
        }
        else {
            console.log('cliente creado');

            this.newClient();
        }
    }

    questionDelete({ text = 'Are you sure about deleting this client?' }) {
        return Swal.fire({
            text,
            // icon: 'warning',
            width: '300px',
            color: '#0B253A',
            showCancelButton: true,
            confirmButtonColor: '#F05123',
            cancelButtonColor: '#3085d6',
            reverseButtons: true,
            padding: '2px',
            confirmButtonText: 'Delete'
        });
    }

    deletedAlert() {
        Swal.fire({
            title: "Client deleted",
            showCancelButton: false,
            confirmButtonText: "Ok",
            confirmButtonColor: "#0B253A",
        });
    }

    successAlert() {
        Swal.fire({
            title: "Success!",
            showCancelButton: false,
            confirmButtonText: "Ok",
            confirmButtonColor: "#0B253A",
        });
    }

    onChangeProvince(province: string) {
        // console.log(this.details.at(i).get("tax").value);
        // console.log(this.registerForm.value);
        this.getCantons(province);
    }

    getCantons(provincia: string) {
        this.provinceService.getProvinces().then((res: any) => {
            this.cantons = res.data!.filter((data:any) => data.provincia == provincia);
            if (this.cantons[0]) {
                this.cantons = this.cantons[0].cantones;
                console.log(this.cantons);
            }

      });
    }

    onChangeCanton() {
        console.log(this.formClient.value);
    }

    onRowSelect(event: any) {
        this.getClientInvoices(event.data.id);
        }

    getClientInvoices(id:any) {
        this.invoiceService.getInvoicesByClient(id).subscribe((data: Invoice[]) => {
            this.clientInvoices = data;
            // console.log(this.clients);
            console.log(this.clientInvoices);

        });
    }

    getGrandTotal(details:any) {
        var total = 0;
        var tax = 0;
        for (let i = 0; i < details.length; i++) {
            const price = details[i]['price'];
            const quantity = details[i]['quantity'];
            const discount = details[i]['discount'] / 100;
            const subtotal = price * quantity;
            const itotal = subtotal - (discount * subtotal);
            total = total + itotal;
        }
        for (let i = 0; i < details.length; i++) {
            const price = details[i]['price'];
            const quantity = details[i]['quantity'];
            const discount = details[i]['discount'] / 100;
            const subtotal1 = price * quantity;
            const subtotal = subtotal1 - (discount * subtotal1);
            const itax = subtotal * ((details[i]['tax']) / 100);
            tax = tax + itax;
        }
        const grandTotal = total + tax;
        return grandTotal;
    }

      openPreviewPDF(route:any) {
        window.open('http://localhost/invoice-backend/public/'+ route, '_blank');
      }

      editInvoice(certificate: any){
        this.router.navigateByUrl('/invoice', { state: certificate });
      }

      getDetailedTax(details: any, i:any) {
        const price = details[i]['price'];
        const quantity = details[i]['quantity'];
        const discount =  details[i]['discount'] / 100;
        const subtotal1 = price * quantity;
        const subtotal = subtotal1 - (discount * subtotal1);
        const tax = subtotal * ( details[i]['tax'] / 100);
        return tax;
      }

      getTotal(details: any, i: any) {
        var total = 0;
        var tax = 0;
        const price = details[i]['price'];
        const quantity = details[i]['quantity'];
        const discount =  details[i]['discount'] / 100;
        const subtotal = price * quantity;
        const itotal = subtotal - (discount * subtotal);
        total = total + itotal;
        const subtotalTax = subtotal - (discount * subtotal);
        const itax = subtotalTax * ( details[i]['tax'] / 100);
        tax = tax + itax;
        const grandTotal = total + tax;
        return grandTotal;
    }
}
