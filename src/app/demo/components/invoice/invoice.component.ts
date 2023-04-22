import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { Client } from '../../api/client';
import { Invoice } from '../../api/invoice';
import { ClientService } from '../../service/client.service';
import { InvoiceService } from '../../service/invoice.service';
import { Table } from 'primeng/table'
import { ViewChild } from '@angular/core'
import { Product } from '../../api/product';
import { ProductService } from '../../service/product.service';
import { Tax } from '../../api/tax';
import { AuthService, User } from '../../service/auth.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-invoice',
    templateUrl: './invoice.component.html',
    styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
    @ViewChild('dt') dt: Table | undefined;
    user: any;
    currentDate: string;
    formInvoice: FormGroup;
    pdfName: string;
    errors: any = null;
    invoiceSerial: string;
    price: number;
    amount: number;
    quantity: number;
    subTotal: number = 0;
    tax: number = 0;
    total: number = 0;
    code: number = 0;
    submitted: boolean;
    clientDialog: boolean;
    productDialog: boolean;
    quantityDialog: boolean;
    clients: Client[];
    products: Product[];
    client: Client;
    clientId: any;
    selectedClient: Client;
    selectedProduct: Product;
    taxes: Tax[];
    selectedTax: Tax;


    constructor(public invoiceService: InvoiceService, private clientService: ClientService, private productService: ProductService, private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private authService: AuthService) {
        this.taxes = [
            { name: 'IVA 12%', value: 12 },
            { name: 'IVA 14%', value: 14 }
        ];
    }

    ngOnInit(): void {
        this.getLoggedUser();
        this.getDate();
        this.getInvoiceNumber();
        this.buildFormInvoice();
    }

    buildFormInvoice() {
        this.formInvoice = this.formBuilder.group({
            id: [null],
            userId: [null, Validators.required],
            userName: [null, Validators.required],
            userRuc: [null, Validators.required],
            userWeb: [null, Validators.required],
            userPhone: [null, Validators.required],
            userAddress: [null, Validators.required],
            userLogo: [null, Validators.required],
            clientId: [null, Validators.required],
            clientName: [null, Validators.required],
            clientMail: [null, Validators.required],
            clientAddress: [null, Validators.required],
            clientPhone: [null, Validators.required],
            fechaEmicion: [this.currentDate, Validators.required],
            details: this.formBuilder.array([]),
            subTotal: [null, Validators.required],
            tax: [null, Validators.required],
            // tax: new FormControl<Tax | null>(null),
            total: [null, Validators.required],
            note: [null, Validators.required],
            totalBase: [null, Validators.required],
            subTotal1: [null, Validators.required],
            grandTotal: [null, Validators.required],
            template: 'myPDF',

            //test controllers
            detail: [null, Validators.required],
            estado: [null, Validators.required],

        });
    }

    get details(): FormArray {
        return this.formInvoice.get("details") as FormArray
    }

    setPrice(event: any, index: number) {
        this.price = event.target.value;
        if (this.quantity) {
            this.amount = this.quantity * this.price;
            console.log(this.amount);
        }
        this.details.at(index).get('amount').setValue(this.amount);
        console.log(this.price);
        this.setSubTotal();
    }

    setQuantity(event: any, index: number) {
        this.quantity = event.target.value;
        if (this.price) {
            this.amount = this.quantity * this.details.at(index).get('price').value;
            console.log(this.amount);
        }
        this.details.at(index).get('amount').setValue(this.amount);
        console.log(this.price);
        this.setSubTotal();
    }

    setSubTotal() {
        console.log(this.details.length);
        var subTotal = 0;
        for (let i = 0; i < this.details.length; i++) {
            subTotal += this.details.at(i).get('amount').value;
        }
        console.log('el subtotal es: ' + subTotal);
        this.subTotal = subTotal;
        this.tax = this.subTotal * 0.12;
        this.total = this.subTotal + this.tax;
        console.log(this.details.value);

    }

    removeDetail(i: number) {
        this.details.removeAt(i);
        this.price = null;
        this.quantity = null;
        this.amount = null;
        this.setSubTotal();
    }

    getDate() {
        var date = new Date();
        var day: any;
        var month: any;
        var dayNumber = date.getDate();
        var monthNumber = date.getMonth() + 1;
        day = dayNumber < 10 ? '0' + dayNumber : dayNumber;
        month = monthNumber < 10 ? '0' + monthNumber : monthNumber;
        this.currentDate = day + '/' + month + '/' + date.getFullYear();
    }

    getInvoiceNumber() {
        this.invoiceService.getInvoiceSerial()
            .subscribe(response => {
                console.log(response.data);
                this.invoiceSerial = response.data;
            },
                (error) => {
                    this.errors = error.error;
                }
            );
    }

    signInvoice(invoice: Invoice) {
        this.questionSend({}).then((result) => {
            if (result.isConfirmed) {
                this.spinner.show();
                this.invoiceService.createInvoiceXML({ 'invoice': invoice })
                    .subscribe(response => {
                        console.log(response.RespuestaAutorizacionComprobante.autorizaciones.autorizacion.comprobante);
                        this.formInvoice.patchValue({ detail: response.RespuestaAutorizacionComprobante.autorizaciones.autorizacion.comprobante });
                        this.formInvoice.patchValue({ estado: response.RespuestaAutorizacionComprobante.autorizaciones.autorizacion.estado });
                        this.getInvoiceNumber();
                        this.spinner.hide();
                        this.invoiceSentAlert();
                    },
                        (error) => {
                            this.errors = error.error;
                            this.spinner.hide();
                        }
                    );
            }
        });

    }

    storeCertificate(invoice: Invoice) {
        this.spinner.show();
        this.invoiceService.storeCertificate({ 'invoice': invoice })
            .subscribe(response => {
                console.log(response);
                this.spinner.hide();
            },
                (error) => {
                    this.errors = error.error;
                    this.spinner.hide();
                }
            );
    }

    previewInvoice(invoice: Invoice) {
        this.spinner.show();
        this.invoiceService.previewInvoicePDF({ 'invoice': invoice })
            .subscribe(response => {
                console.log(response);
                this.spinner.hide();
                window.open('http://localhost/invoice-backend/public/authorizedPDF/' + response + '.pdf', '_blank');
            },
                (error) => {
                    this.errors = error.error;
                    this.spinner.hide();
                }
            );
    }

    onSubmitInvoice() {
        // this.formInvoice.patchValue({ fechaEmicion: this.currentDate });
        const templateName = localStorage.getItem('templateName');
        this.formInvoice.patchValue({ template: templateName });
        this.formInvoice.patchValue({ subTotal: this.subTotal });
        this.formInvoice.patchValue({ tax: this.tax });
        this.formInvoice.patchValue({ total: this.total });
        this.signInvoice(this.formInvoice.value);
    }

    onSubmitStore() {
        // this.formInvoice.patchValue({ fechaEmicion: this.currentDate });
        this.storeCertificate(this.formInvoice.value);
    }

    submitPreviewInvoice() {
        const templateName = localStorage.getItem('templateName');
        this.formInvoice.patchValue({ template: templateName });
        this.formInvoice.patchValue({ subTotal: this.subTotal });
        this.formInvoice.patchValue({ tax: this.tax });
        this.formInvoice.patchValue({ total: this.total });
        this.previewInvoice(this.formInvoice.value);
    }

    openNew() {
        // this.client = {};
        // this.formClient.reset();
        this.submitted = false;
        this.getClients();
        this.clientDialog = true;
    }

    getClients() {
        this.clientService.getClients().subscribe((data: Client[]) => {
            this.clients = data;
            console.log(this.clients);
        });
    }

    applyFilterGlobal($event: any, stringVal: any) {
        this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
    }

    onRowSelect(event: any) {
        console.log(event.data);
        this.formInvoice.patchValue({ clientId: event.data.id });
        this.formInvoice.patchValue({ clientName: event.data.razon_social });
        this.formInvoice.patchValue({ clientMail: event.data.correo });
        this.formInvoice.patchValue({ clientAddress: event.data.direccion });
        this.formInvoice.patchValue({ clientPhone: event.data.telefono });
        this.clientDialog = false;
    }

    removeClient() {
        this.formInvoice.reset();
    }

    getProducts() {
        this.productService.getProducts().subscribe((data: Product[]) => {
            this.products = data;
            console.log(this.products);
        });
    }

    openNewProduct() {
        this.submitted = false;
        this.getProducts();
        this.productDialog = true;
    }

    onRowSelectProduct(event: any) {
        console.log(event.data);
        this.addDetails(event.data);
        // this.formInvoice.patchValue({ clientName: event.data.razon_social });
        // this.formInvoice.patchValue({ clientMail: event.data.correo });
        // this.formInvoice.patchValue({ clientAddress: event.data.direccion });
        // this.formInvoice.patchValue({ clientPhone: event.data.telefono });
        this.quantityDialog = true;
    }

    addDetails(data: any) {
        this.price = data.precio_venta;
        this.quantity = 1;
        this.amount = this.quantity * this.price;
        this.details.push(this.newDetail(data.id, data.descripcion, data.precio_venta, this.amount));
        // this.setSubTotal();
        console.log('el tamano es ' + (this.details.length - 1));
    }

    newDetail(productId: any, item: any, price: any, amount: any): FormGroup {
        return this.formBuilder.group({
            item: item,
            price: price,
            quantity: 1,
            amount: amount,
            totalBase: '',
            discount: 0,
            detailedDiscount: '',
            totalWithDiscount: '',
            tax: 0,
            detailedTax: '',
            total: '',
            productId: productId,
        })
    }

    setQuantity2(event: any, index: number) {
        this.quantity = event.target.value;
        if (this.price) {
            this.amount = this.quantity * this.price;
            console.log(this.amount);
        }
        this.details.at(index).get('amount').setValue(this.amount);
        console.log(this.price);
        this.setSubTotal();
    }

    updateQuantity() {
        var index = this.details.length - 1;
        this.details.at(index).get('quantity').setValue(this.quantity);
        this.amount = this.quantity * this.price;
        this.details.at(index).get('amount').setValue(this.amount);
        this.setSubTotal();
        this.quantityDialog = false;
        this.productDialog = false;
    }

    onRowReorder(event: any) {
        console.log(event);
        const currentGroup = this.details.at(event.dropIndex);
        this.details.removeAt(event.dropIndex);
        this.details.insert(event.dropIndex, currentGroup)
        console.log(this.formInvoice.value);
    }

    getTotalBase(i: any) {
        const price = this.details.at(i).get("price").value;
        const quantity = this.details.at(i).get("quantity").value;
        const total = price * quantity;
        this.details.at(i).get('totalBase').setValue(total);
        return total;
    }

    getTotalWithoutDiscount(i: any) {
        const price = this.details.at(i).get("price").value;
        const quantity = this.details.at(i).get("quantity").value;
        const subtotal = price * quantity;
        const tax = subtotal * ((this.details.at(i).get("tax").value) / 100);
        const total = subtotal + tax;
        return total;
    }

    getTotalWithDiscount(i: any) {
        const price = this.details.at(i).get("price").value;
        const quantity = this.details.at(i).get("quantity").value;
        const discount = this.details.at(i).get("discount").value / 100;
        const subtotal1 = price * quantity;
        const subtotal = subtotal1 - (discount * subtotal1);
        const tax = subtotal * ((this.details.at(i).get("tax").value) / 100);
        const total = subtotal + tax;
        return total;
    }

    getDetailedTax(i: any) {
        const price = this.details.at(i).get("price").value;
        const quantity = this.details.at(i).get("quantity").value;
        const discount = this.details.at(i).get("discount").value / 100;
        const subtotal1 = price * quantity;
        const subtotal = subtotal1 - (discount * subtotal1);
        const tax = subtotal * ((this.details.at(i).get("tax").value) / 100);
        this.details.at(i).get('detailedTax').setValue(tax);
        return tax;
    }

    getDetailedDiscount(i: any) {
        const price = this.details.at(i).get("price").value;
        const quantity = this.details.at(i).get("quantity").value;
        const discount = this.details.at(i).get("discount").value / 100;
        const subtotal = price * quantity;
        const total = discount * subtotal;
        this.details.at(i).get('detailedDiscount').setValue(total);
        return total;
    }

    getTotalWithoutTax(i: any) {
        const price = this.details.at(i).get("price").value;
        const quantity = this.details.at(i).get("quantity").value;
        const discount = this.details.at(i).get("discount").value / 100;
        const subtotal = price * quantity;
        const total = subtotal - (discount * subtotal);
        this.details.at(i).get('totalWithDiscount').setValue(total);
        return total;
    }

    getTotal(i: any) {
        var total = 0;
        var tax = 0;
        const price = this.details.at(i).get("price").value;
        const quantity = this.details.at(i).get("quantity").value;
        const discount = this.details.at(i).get("discount").value / 100;
        const subtotal = price * quantity;
        const itotal = subtotal - (discount * subtotal);
        total = total + itotal;
        const subtotalTax = subtotal - (discount * subtotal);
        const itax = subtotalTax * ((this.details.at(i).get("tax").value) / 100);
        tax = tax + itax;

        const grandTotal = total + tax;
        this.details.at(i).get('total').setValue(grandTotal);
        return grandTotal;
    }

    getSubtotal() {
        var total = 0;
        for (let i = 0; i < this.details.length; i++) {
            const price = this.details.at(i).get("price").value;
            const quantity = this.details.at(i).get("quantity").value;
            const discount = this.details.at(i).get("discount").value / 100;
            const subtotal = price * quantity;
            const itotal = subtotal - (discount * subtotal);
            total = total + itotal;
        }
        this.formInvoice.patchValue({ subTotal1: total });
        return total;
    }

    getGrandTotal() {
        var total = 0;
        var tax = 0;
        for (let i = 0; i < this.details.length; i++) {
            const price = this.details.at(i).get("price").value;
            const quantity = this.details.at(i).get("quantity").value;
            const discount = this.details.at(i).get("discount").value / 100;
            const subtotal = price * quantity;
            const itotal = subtotal - (discount * subtotal);
            total = total + itotal;
        }
        for (let i = 0; i < this.details.length; i++) {
            const price = this.details.at(i).get("price").value;
            const quantity = this.details.at(i).get("quantity").value;
            const discount = this.details.at(i).get("discount").value / 100;
            const subtotal1 = price * quantity;
            const subtotal = subtotal1 - (discount * subtotal1);
            const itax = subtotal * ((this.details.at(i).get("tax").value) / 100);
            tax = tax + itax;
        }
        const grandTotal = total + tax;
        this.formInvoice.patchValue({ grandTotal: grandTotal });
        return grandTotal;
    }

    getGrandTotalBase() {
        var total = 0;
        var tax = 0;
        for (let i = 0; i < this.details.length; i++) {
            const price = this.details.at(i).get("price").value;
            const quantity = this.details.at(i).get("quantity").value;
            const subtotal = price * quantity;
            total = total + subtotal;
        }
        this.formInvoice.patchValue({ totalBase: total });
        return total;
    }

    setSubTotal323() {
        console.log(this.details.length);
        var subTotal = 0;
        for (let i = 0; i < this.details.length; i++) {
            subTotal += this.details.at(i).get('amount').value;
        }
        console.log('el subtotal es: ' + subTotal);
        this.subTotal = subTotal;
        this.tax = this.subTotal * 0.12;
        this.total = this.subTotal + this.tax;
        console.log(this.details.value);

    }

    getLoggedUser() {
        this.authService.getLoggedUser()
            .subscribe(response => {
                const res: any = response;
                console.log(res.data);
                this.user = res.data;
                this.formInvoice.patchValue({ userId: this.user.id });
                this.formInvoice.patchValue({ userName: this.user.name });
                this.formInvoice.patchValue({ userRuc: this.user.user_ruc });
                this.formInvoice.patchValue({ userWeb: this.user.user_web });
                this.formInvoice.patchValue({ userPhone: this.user.phone });
                this.formInvoice.patchValue({ userAddress: this.user.address });
                this.formInvoice.patchValue({ userLogo: this.user.logo });
            },
                (error) => {
                    this.errors = error.error;
                }
            );
    }

    resetForm() {
        this.formInvoice.reset();
        this.total = null;
    }

    questionSend({ text = 'Are you sure about sending this invoice?' }) {
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
            confirmButtonText: ' Send it'
        });
    }

    invoiceSentAlert(){
        Swal.fire({
             title: "Invoice sent!",
             showCancelButton: false,
             confirmButtonText: "Ok",
             confirmButtonColor: "#0B253A",
           });
      }
    // signInvoice() {
    //   console.log(this.formInvoice.value);

    //   this.invoiceService.createInvoiceXML(this.formInvoice).subscribe(
    //     (result) => {
    //       console.log(result);
    //     },
    //     (error) => {
    //       this.errors = error.error;
    //     }
    //   );
    // }
    onChangeTax(i:any) {
        // console.log(this.details.at(i).get("tax").value);
        console.log(this.formInvoice.value);

    }
}
