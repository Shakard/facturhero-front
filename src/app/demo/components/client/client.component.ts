import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Client } from '../../api/client';
import { ClientService } from '../../service/client.service';
import Swal from 'sweetalert2';
import { Province } from '../../api/province';
import { ProvinceService } from '../../service/province.service';

@Component({
    selector: 'app-client',
    templateUrl: './client.component.html',
    styleUrls: ['./client.component.scss']
})
export class ClientComponent {
    clientDialog: boolean;
    clients: Client[];
    client: Client;
    clientId: any;
    selectedClients: Client[];
    submitted: boolean;
    provinces: Province[];
    statuses: any[];
    cantons: any[];
    editingClient: boolean;

    formClient: FormGroup;

    constructor(private clientService: ClientService, private provinceService: ProvinceService) { }

    ngOnInit() {
        this.getClients();
        this.getProvinces();
        this.buildFormClient();
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
            ruc: new FormControl('', Validators.required),
            name: new FormControl('', Validators.required),
            phone: new FormControl('', Validators.required),
            country: new FormControl(''),
            province: new FormControl('', Validators.required),
            canton: new FormControl('', Validators.required),
            address: new FormControl('', Validators.required),
            addressDetail: new FormControl('', Validators.required),
            zipCode: new FormControl('', Validators.required),
            email: new FormControl('', Validators.required),
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
        this.formClient.patchValue({ ruc: client.ruc });
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
}
