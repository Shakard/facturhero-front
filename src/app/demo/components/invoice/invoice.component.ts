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
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { SweetAlertMessageService } from '../../service/sweet-alert-message.service';
import { PaymentMethod } from '../../api/payment-method';
import { Router } from '@angular/router';

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
    newInvoiceSerial: string;
    newInvoiceSerialDialog: boolean = false;
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
    keyPasswordDialog: boolean;
    clients: Client[];
    products: Product[];
    client: Client;
    clientId: any;
    selectedClient: Client;
    selectedProduct: Product;
    taxes: Tax[];
    payments: PaymentMethod[];
    selectedTax: Tax;
    editing: boolean = false;
    sent: boolean = false;
    componentDisabled: boolean = false;



    constructor(
        public invoiceService: InvoiceService,
        private clientService: ClientService,
        private productService: ProductService,
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService,
        private authService: AuthService,
        private location: Location,
        private messageService: SweetAlertMessageService,
        private router: Router
    ) {
        this.taxes = [
            { name: 'IVA 12%', value: 12 },
            { name: 'IVA 14%', value: 14 }
        ];
        this.payments = [
            { name: 'COMPENSACIÓN DE DEUDAS ', value: '15' },
            { name: 'TARJETA DE DÉBITO', value: '16' },
            { name: 'DINERO ELECTRÓNICO ', value: '17' },
            { name: 'TARJETA PREPAGO ', value: '18' },
            { name: 'TARJETA DE CRÉDITO ', value: '19' },
            { name: 'OTROS CON UTILIZACIÓN DEL SISTEMA FINANCIERO ', value: '20' },
            { name: 'ENDOSO DE TÍTULOS', value: '21' }
        ];
    }

    ngOnInit(): void {
        const editInvoiceData: any = this.location.getState();
        this.getLoggedUser();
        this.getDate();
        this.buildFormInvoice();
        if (editInvoiceData.client) {
            console.log(editInvoiceData.certificate_details[0].tax);

            this.editing = true;
            this.formInvoice.patchValue({ id: editInvoiceData.id });
            this.formInvoice.patchValue({ clientId: editInvoiceData.client.id });
            this.formInvoice.patchValue({ clientTypeOfId: editInvoiceData.client.tipo_identificacion });
            this.formInvoice.patchValue({ clientIdentification: editInvoiceData.client.identificacion });
            this.formInvoice.patchValue({ clientName: editInvoiceData.client.razon_social });
            this.formInvoice.patchValue({ clientMail: editInvoiceData.client.correo });
            this.formInvoice.patchValue({ clientCountry: editInvoiceData.client.address.country });
            this.formInvoice.patchValue({ clientProvince: editInvoiceData.client.address.province });
            this.formInvoice.patchValue({ clientCity: editInvoiceData.client.address.city });
            this.formInvoice.patchValue({ clientLine1: editInvoiceData.client.address.line1 });
            this.formInvoice.patchValue({ clientLine2: editInvoiceData.client.address.line2 });
            this.formInvoice.patchValue({ clientZipCode: editInvoiceData.client.address.zip });
            this.formInvoice.patchValue({ clientPhone: editInvoiceData.client.telefono });
            this.formInvoice.patchValue({ mainTax: parseInt(editInvoiceData.certificate_details[0].tax)});
            for (let i = 0; i < editInvoiceData.certificate_details.length; i++) {
                var product = editInvoiceData.certificate_details[i].product;
                var amount = editInvoiceData.certificate_details[i].price * editInvoiceData.certificate_details[i].quantity;
                this.details.push(this.newDetail(product.id, product.descripcion, product.precio_venta, amount, editInvoiceData.certificate_details[i].quantity, editInvoiceData.certificate_details[i].discount, editInvoiceData.certificate_details[i].tax)); //productId: any, item: any, price: any, amount: any, quantity?:any, discount?:any, tax?:any
            }
            this.setSubTotal();
        }
    }

    buildFormInvoice() {
        this.formInvoice = this.formBuilder.group({
            id: [null],
            userId: [null, Validators.required],
            userName: [null, Validators.required],
            userRuc: [null, Validators.required],
            userWeb: [null, Validators.required],
            userEmail: [null, Validators.required],
            userPhone: [null, Validators.required],
            userCountry: [null, Validators.required],
            userProvince: [null, Validators.required],
            userCity: [null, Validators.required],
            userLine1: [null, Validators.required],
            userLine2: [null],
            userZipCode: [null],
            userLogo: [null, Validators.required],
            clientId: [null, Validators.required],
            clientTypeOfId: [null, Validators.required],
            clientIdentification: [null, Validators.required],
            clientName: [null, Validators.required],
            clientMail: [null, Validators.required],
            clientCountry: [null, Validators.required],
            clientProvince: [null, Validators.required],
            clientCity: [null, Validators.required],
            clientLine1: [null, Validators.required],
            clientLine2: [null],
            clientZipCode: [null],
            invoiceSerial: [null],
            clientPhone: [null, Validators.required],
            fechaEmicion: [this.currentDate, Validators.required],
            details: this.formBuilder.array([]),
            subTotal: [null, Validators.required],
            tax: [null, Validators.required],
            mainTax: [null, Validators.required],
            percentageCode: [0, Validators.required],
            // tax: new FormControl<Tax | null>(null),
            // total: [null, Validators.required],
            note: [null, Validators.required],
            totalBase: [null, Validators.required],
            totalDiscount: [null, Validators.required],
            totalTaxes: [null, Validators.required],
            subTotal1: [null, Validators.required],
            grandTotal: [null, Validators.required],
            paymentMethod: ['01', Validators.required],
            template: 'myPDF',
            userKey: [null, Validators.required],
            userKeyPass: [null, Validators.required],

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
        this.quantity = event.value;
        this.price = this.details.at(index).get('price').value;
        console.log(this.price);
        if (this.price) {
            this.amount = this.quantity * this.details.at(index).get('price').value;
            console.log(this.amount);
        }
        this.details.at(index).get('amount').setValue(this.amount);
        console.log(this.price);
        this.setSubTotal();
        this.update();
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
        this.update();
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

    getInvoiceNumber(id: any) {
        this.invoiceService.getInvoiceSerial(id)
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
                        this.getLoggedUser();
                        this.spinner.hide();
                        this.invoiceSentAlert();
                        this.sent = true;
                        this.formInvoice.reset();
                        this.router.navigate(['invoice-history']);
                    },
                        (error) => {
                            console.log(error.error.message);
                            console.log(error.error.additionalInfo);
                            this.spinner.hide();
                            this.messageService.errorWithDetail(error.error.message, error.error.additionalInfo);
                            this.formInvoice.get('userKeyPass').reset();
                        }
                    );
            }
        });

    }

    storeCertificate(invoice: Invoice) {
        this.spinner.show();
        this.invoiceService.storeCertificate({ 'invoice': invoice })
            .subscribe(response => {
                console.log(response.data.id);
                this.formInvoice.patchValue({ id: response.data.id });
                this.spinner.hide();
                this.messageService.successMessage('Invoice created successfully');
            },
                (error) => {
                    this.errors = error.error;
                    this.spinner.hide();
                }
            );
    }

    updateCertificate(invoice: Invoice) {
        console.log(invoice);

        this.spinner.show();
        this.invoiceService.updateCertificate({ 'invoice': invoice })
            .subscribe(response => {
                console.log(response);
                this.spinner.hide();
                // this.messageService.successMessage('Certificate updated successfully');
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
                window.open('http://localhost/invoice-backend/public/previewPDF/' + response + '.pdf', '_blank');
            },
                (error) => {
                    this.errors = error.error;
                    this.spinner.hide();
                }
            );
    }

    onSubmitInvoice() {
        this.newInvoiceSerialDialog = false
        this.keyPasswordDialog = false;
        const templateName = localStorage.getItem('templateName');
        if (this.invoiceSerial == null) {
            // abrir modal para ingresar el numero de invoice
            this.newInvoiceSerialDialog = true;
        } else {
            this.formInvoice.patchValue({ invoiceSerial: this.invoiceSerial });
            this.formInvoice.patchValue({ template: templateName });
            this.formInvoice.patchValue({ subTotal: this.subTotal });
            this.addTotalDiscount();
            this.formInvoice.patchValue({ tax: this.tax });
            this.formInvoice.patchValue({ total: this.total });
            if (!this.formInvoice.get('userKeyPass').value) {
                console.log(this.formInvoice.get('userKeyPass').value);
                this.keyPasswordDialog = true;
            } else {
                this.signInvoice(this.formInvoice.value);
            }
        }
    }

    onSubmitStore() {
        // this.formInvoice.patchValue({ fechaEmicion: this.currentDate });
        this.storeCertificate(this.formInvoice.value);
    }

    onSubmitUpdate() {
        // this.formInvoice.patchValue({ fechaEmicion: this.currentDate });
        this.updateCertificate(this.formInvoice.value);
    }

    submitPreviewInvoice() {
        const templateName = localStorage.getItem('templateName');
        this.formInvoice.patchValue({ invoiceSerial: this.invoiceSerial });
        this.formInvoice.patchValue({ template: templateName });
        this.formInvoice.patchValue({ subTotal: this.subTotal });
        this.formInvoice.patchValue({ tax: this.tax });
        this.formInvoice.patchValue({ total: this.total });
        this.previewInvoice(this.formInvoice.value);
        console.log(this.formInvoice.value);
    }

    openNew() {
        // this.client = {};
        // this.formClient.reset();
        this.submitted = false;
        this.getClients();
        this.clientDialog = true;
    }

    getClients() {
        const userId = localStorage.getItem('id');
        this.clientService.getClients({ 'id': userId }).subscribe((data: Client[]) => {
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
        this.formInvoice.patchValue({ clientTypeOfId: event.data.tipo_identificacion });
        this.formInvoice.patchValue({ clientIdentification: event.data.identificacion });
        this.formInvoice.patchValue({ clientName: event.data.razon_social });
        this.formInvoice.patchValue({ clientMail: event.data.correo });
        this.formInvoice.patchValue({ clientPhone: event.data.telefono });
        this.formInvoice.patchValue({ clientCountry: event.data.address.country });
        this.formInvoice.patchValue({ clientProvince: event.data.address.province });
        this.formInvoice.patchValue({ clientCity: event.data.address.city });
        this.formInvoice.patchValue({ clientLine1: event.data.address.line1 });
        this.formInvoice.patchValue({ clientLine2: event.data.address.line2 });
        this.formInvoice.patchValue({ clientZipCode: event.data.address.zip });
        this.clientDialog = false;
    }

    removeClient() {
        this.formInvoice.reset();
        this.details.clear();
    }

    getProducts() {
        const userId = localStorage.getItem('id');
        this.productService.getProducts({ 'id': userId }).subscribe((data: Product[]) => {
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
        // this.quantityDialog = true;
        this.setSubTotal();
        this.productDialog = false
    }

    addDetails(data: any) {
        this.price = data.precio_venta;
        this.quantity = 1;
        this.amount = this.quantity * this.price;
        this.details.push(this.newDetail(data.id, data.descripcion, data.precio_venta, this.amount));
        // this.setSubTotal();
        // console.log('el tamano es ' + (this.details.length - 1));
        if (this.formInvoice.get('mainTax').value){
            this.onChangeMainTax(this.formInvoice.get('mainTax').value);
            console.log('baby khe mah '+this.formInvoice.get('mainTax').value);

        }else{
            this.update();
        }
    }

    newDetail(productId: any, item: any, price: any, amount: any, quantity?: any, discount?: any, tax?: any): FormGroup {
        return this.formBuilder.group({
            item: item,
            price: price,
            quantity: ((quantity) ? quantity : 1),
            amount: amount,
            totalBase: '',
            discountText: ((discount) ? discount + '%' : '0%'),
            discount: ((discount) ? discount : 0),
            detailedDiscount: '',
            totalWithDiscount: '',
            tax: ((tax) ? tax : 0),
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
        this.details.at(i).get('totalBase').setValue(total.toFixed(2));
        return total.toFixed(2);
    }

    getTotalWithoutDiscount(i: any) {
        const price = this.details.at(i).get("price").value;
        const quantity = this.details.at(i).get("quantity").value;
        const subtotal = price * quantity;
        const tax = subtotal * ((this.details.at(i).get("tax").value) / 100);
        const total = subtotal + tax;
        return total.toFixed(2);
    }

    getTotalWithDiscount(i: any) {
        const price = this.details.at(i).get("price").value;
        const quantity = this.details.at(i).get("quantity").value;
        const discount = this.details.at(i).get("discount").value / 100;
        const subtotal1 = price * quantity;
        const subtotal = subtotal1 - (discount * subtotal1);
        const tax = subtotal * ((this.details.at(i).get("tax").value) / 100);
        const total = subtotal + tax;
        return total.toFixed(2);
    }

    getDetailedTax(i: any) {
        const price = this.details.at(i).get("price").value;
        const quantity = this.details.at(i).get("quantity").value;
        const discount = this.details.at(i).get("discount").value / 100;
        const subtotal1 = price * quantity;
        const subtotal = subtotal1 - (discount * subtotal1);
        var tax = subtotal * ((this.details.at(i).get("tax").value) / 100);
        this.details.at(i).get('detailedTax').setValue(tax.toFixed(2));
        return tax.toFixed(2);
    }

    getDetailedDiscount(i: any) {
        var discountTextField = this.details.at(i).get("discountText").value;
        var discountTextField = discountTextField?.toString();
        if (discountTextField?.includes('%')) {
            const discountValue = discountTextField.replace(/\D/g, '');
            const price = this.details.at(i).get("price").value;
            const quantity = this.details.at(i).get("quantity").value;
            const discount = discountValue / 100;
            const subtotal = price * quantity;
            const total = discount * subtotal;
            this.details.at(i).get('detailedDiscount').setValue(total.toFixed(2));
            this.details.at(i).get("discount").setValue(discountValue);

            return total;
        } else {
            const discount = this.details.at(i).get("discountText").value;
            const totalBase = this.details.at(i).get('totalBase').value;
            const total = (discount / totalBase) * 100;
            this.details.at(i).get('detailedDiscount').setValue(discount);
            this.details.at(i).get("discount").setValue(total);
            return total
        }
        // const price = this.details.at(i).get("price").value;
        // const quantity = this.details.at(i).get("quantity").value;
        // const discount = this.details.at(i).get("discount").value / 100;
        // const subtotal = price * quantity;
        // const total = discount * subtotal;
        // this.details.at(i).get('detailedDiscount').setValue(total);
        // console.log(discount);
        // return total;

        // const discount = this.details.at(i).get("discountText").value;
        // const totalBase = this.details.at(i).get('totalBase').value;
        // const total = (discount / totalBase) * 100;
        // this.details.at(i).get('detailedDiscount').setValue(discount);
        // this.details.at(i).get("discount").setValue(total);
        // return total

    }

    getTotalWithoutTax(i: any) {
        const price = this.details.at(i).get("price").value;
        const quantity = this.details.at(i).get("quantity").value;
        const discount = this.details.at(i).get("discount").value / 100;
        const subtotal = price * quantity;
        const total = subtotal - (discount * subtotal);
        this.details.at(i).get('totalWithDiscount').setValue(total.toFixed(2));
        return total.toFixed(2);
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
        this.formInvoice.patchValue({ subTotal1: total.toFixed(2) });
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
        this.formInvoice.patchValue({ grandTotal: grandTotal.toFixed(2) });
        return grandTotal.toFixed(2);
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
        this.formInvoice.patchValue({ totalBase: total.toFixed(2) });
        return total.toFixed(2);
    }

    addTotalDiscount() {
        var totalDiscount = 0;
        for (let i = 0; i < this.details.length; i++) {
            const discount = this.details.at(i).get('detailedDiscount').value;
            totalDiscount = totalDiscount + parseInt(discount);
        }
        this.formInvoice.patchValue({ totalDiscount: totalDiscount });
        const subtotal = this.getSubtotal();
        if (this.formInvoice.get('mainTax').value==null) {
            const totalTax = subtotal * 0;
            this.formInvoice.patchValue({ totalTaxes: totalTax.toFixed(2) });
        }else {
            const totalTax = subtotal * (this.formInvoice.get('mainTax').value/100);
            this.formInvoice.patchValue({ totalTaxes: totalTax.toFixed(2) });
        }
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
        const userId = localStorage.getItem('id');
        this.authService.getLoggedUserWIthAddress([userId])
            .subscribe(response => {
                const res: any = response;
                console.log(res.data[0]);
                this.user = res.data[0];
                this.formInvoice.patchValue({ userId: this.user.id });
                this.formInvoice.patchValue({ userName: this.user.name });
                this.formInvoice.patchValue({ userEmail: this.user.email });
                this.formInvoice.patchValue({ userRuc: this.user.user_ruc });
                this.formInvoice.patchValue({ userWeb: this.user.user_web });
                this.formInvoice.patchValue({ userPhone: this.user.phone });
                this.formInvoice.patchValue({ userCountry: this.user.address.country });
                this.formInvoice.patchValue({ userProvince: this.user.address.province });
                this.formInvoice.patchValue({ userCity: this.user.address.city });
                this.formInvoice.patchValue({ userLine1: this.user.address.line1 });
                this.formInvoice.patchValue({ userLine2: this.user.address.line2 });
                this.formInvoice.patchValue({ userZipCode: this.user.address.zip });
                this.formInvoice.patchValue({ userLogo: this.user.logo });
                this.formInvoice.patchValue({ userKey: this.user.signature });
                this.getInvoiceNumber(this.user.id);
                if (!this.user.signature) {
                    this.componentDisabled = true;
                }
            },
                (error) => {
                    this.errors = error.error;
                }
            );
    }

    resetForm() {
        this.formInvoice.reset();
        this.details.clear();
        this.total = null;
        this.getLoggedUser();
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

    invoiceSentAlert() {
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
    onChangeTax() {
        this.update();
    }

    onChangeMainTax(mainTax: any) {

        switch (mainTax) {
            case 12:
                this.formInvoice.patchValue({ percentageCode : 2 });
                break;
            case 14:
                this.formInvoice.patchValue({ percentageCode: 3 });
                break;
        }

        for (let i = 0; i < this.details.length; i++) {
            this.details.at(i).get('tax').setValue(mainTax);
            this.getDetailedTax(i);
        }
        this.onChangeTax();
    }

    onChangePayment(event: any) {
        this.formInvoice.patchValue({ paymentMethod: event.value });
    }

    validate(evt: any) {
        var theEvent = evt || window.event;

        // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);

        var regex = /^[0-9]*\%?$/;
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }
    }

    update() {
        if (this.formInvoice.get('id').value) {
            this.onSubmitUpdate();
        }
    }

}
