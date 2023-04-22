import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Client } from '../../api/client';
import { Offer } from '../../api/offer';
import { ClientService } from '../../service/client.service';
import { ViewChild } from '@angular/core'
import { OfferService } from '../../service/offer.service';
import { ProductService } from '../../service/product.service';
import { Product } from '../../api/product';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss']
})
export class OfferComponent {
    @ViewChild('dt') dt: Table | undefined;
    offerDialog: boolean;
    offers: Offer[];
    offer: Offer;
    offerId: any;
    selectedOffers: Offer[];
    selectedOffer: Offer;
    clients: Client[];
    selectedClient: Client;
    products: Product[];
    selectedProduct: Product;
    submitted: boolean;
    productDialog: boolean;
    statuses: any[];
    total: number = 0;
    subTotal: number = 0;
    tax: number = 0;

    formOffer: FormGroup;

    constructor(private offerService: OfferService, private clientService: ClientService, private formBuilder: FormBuilder, private productService: ProductService,) { }

    ngOnInit() {
        this.getOffers();
        this.buildFormOffer();
    }

    getOffers() {
        this.offerService.getOffers().subscribe((data: Offer[]) => {
            this.offers = data;
            console.log(this.offers);
        });
    }

    buildFormOffer() {
        this.formOffer = new FormGroup({
            id: new FormControl(null),
            offer_number: new FormControl(null),
            client: new FormControl('2', Validators.required),
            tax: new FormControl(null),
            subtotal: new FormControl(null),
            total: new FormControl(null),
            details: this.formBuilder.array([]),
        });
    }

    get f(){
        return this.formOffer.controls;
      }

    get details(): FormArray {
        return this.formOffer.get("details") as FormArray
    }

    deleteSelectedOffers() {

    }

    addDetails(data: any) {
        // this.price = data.precio_venta;
        // this.quantity = 1;
        // this.amount = this.quantity * this.price;
        this.details.push(this.newDetail(data.id, data.precio_venta, data.descripcion));
        // this.setSubTotal();
        console.log('el tamano es ' + (this.details.length - 1));
        console.log(this.formOffer.value);
    }

    newDetail(productId:any, price:any, item:any): FormGroup {
        return this.formBuilder.group({
            productId: productId,
            quantity: 1,
            price: price,
            discount: '',
            item: item,
        })
    }

    openNewProduct() {
        this.submitted = false;
        this.getProducts();
        this.productDialog = true;
    }

    getProducts() {
        this.productService.getProducts().subscribe((data: Product[]) => {
            this.products = data;
            console.log(this.products);
        });
    }

    openEditOffer(Offer: Offer) {
        console.log(Offer);
        this.offerId = Offer.id;
        this.formOffer.patchValue({ code: Offer.codigo });
        this.formOffer.patchValue({ item: Offer.descripcion });
        this.formOffer.patchValue({ quantity: Offer.cantidad });
        this.formOffer.patchValue({ price: Offer.precio_venta });
        this.offerDialog = true;
    }

    deleteOffer(offer: Offer) {
        console.log(offer);
        this.offerService.deleteOffer(offer.id).subscribe(res => {
            console.log('Offer deleted successfully!');
            this.getOffers();
       })
    }

    hideDialog() {
        this.offerDialog = false;
        this.submitted = false;
    }

    newOffer() {
        console.log(this.formOffer.value);
        this.offerService.createOffer(this.formOffer.value).subscribe(res => {
            console.log('Offer created successfully!');
            this.getOffers();
            this.formOffer.reset();
            this.hideDialog();
        })
    }

    editOffer() {
        console.log(this.formOffer.value);
        this.offerService.updateOffer(this.offerId, this.formOffer.value).subscribe(res => {
            console.log('Offer updated successfully!');
            this.getOffers();
            this.formOffer.reset();
            this.offerId=0;
            this.hideDialog();
        })
    }

    openNewOffer() {
        this.submitted = false;
        this.getClients();
        this.offerDialog = true;
    }

    getClients() {
        this.clientService.getClients().subscribe((data: Client[]) => {
            this.clients = data;
            console.log(this.clients);
        });
    }

    onRowSelect(event: any) {
        this.selectedClient = event.data;
        console.log(this.selectedClient);
        this.formOffer.patchValue({ client: event.data.id });
        // this.formInvoice.patchValue({ clientMail: event.data.correo });
        // this.formInvoice.patchValue({ clientAddress: event.data.direccion });
        // this.formInvoice.patchValue({ clientPhone: event.data.telefono });
        this.offerDialog = false;
    }

    onRowSelectProduct(event: any) {
        console.log(event.data);
        this.addDetails(event.data);
        // this.formInvoice.patchValue({ clientName: event.data.razon_social });
        // this.formInvoice.patchValue({ clientMail: event.data.correo });
        // this.formInvoice.patchValue({ clientAddress: event.data.direccion });
        // this.formInvoice.patchValue({ clientPhone: event.data.telefono });
        // this.quantityDialog = true;
    }

    applyFilterGlobal($event: any, stringVal: any) {
        this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
    }

    onSubmitOffer() {
        // this.formInvoice.patchValue({ fechaEmicion: this.currentDate });
        // this.formOffer.patchValue({ subTotal: this.subTotal });
        // this.formOffer.patchValue({ tax: this.tax });
        // this.formOffer.patchValue({ total: this.total });
        // this.signInvoice(this.formInvoice.value);
    }

    removeDetail(i: number) {
        this.details.removeAt(i);
        // this.price = null;
        // this.quantity = null;
        // this.amount = null;
        // this.setSubTotal();
    }

    setQuantity(event: any, index: number) {
        // this.quantity = event.target.value;
        // if (this.price) {
        //     this.amount = this.quantity * this.price;
        //     console.log(this.amount);
        // }
        // this.details.at(index).get('amount').setValue(this.amount);
        // console.log(this.price);
        // this.setSubTotal();
    }

    submit() {
        // if (this.offerId) {
        //     this.editOffer();
        // }
        // else {
            this.newOffer();
        // }
    }
}
