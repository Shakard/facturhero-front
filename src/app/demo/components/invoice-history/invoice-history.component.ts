import { Component } from '@angular/core';
import { Invoice } from '../../api/invoice';
import { InvoiceService } from '../../service/invoice.service';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-invoice-history',
    templateUrl: './invoice-history.component.html',
    styleUrls: ['./invoice-history.component.scss']
})
export class InvoiceHistoryComponent {
    certificate: Invoice[];
    selectedCertificates: Invoice[];
    user: any;

    constructor(private invoiceService: InvoiceService, private authService: AuthService, public router: Router,) { }

    ngOnInit() {
        this.getLoggedUser();
    }

    getInvoices() {
        this.invoiceService.getCertificates(this.user.id).subscribe((data: Invoice[]) => {
            this.certificate = data;
            // console.log(this.certificate);
        });
    }

    getLoggedUser() {
        this.authService.getLoggedUser()
            .subscribe(response => {
                const res: any = response;
                // console.log(res.data);
                this.user = res.data;
                this.getInvoices();
            });
    }

    getGrandTotal(details: any) {
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

    openPreviewPDF(route: any) {
        window.open('http://www.facturhero.com/invoice-backend/public/' + route, '_blank');
    }

    editInvoice(certificate: any) {
        this.router.navigateByUrl('/invoice', { state: certificate });
    }

    getDetailedTax(details: any, i: any) {
        const price = details[i]['price'];
        const quantity = details[i]['quantity'];
        const discount = details[i]['discount'] / 100;
        const subtotal1 = price * quantity;
        const subtotal = subtotal1 - (discount * subtotal1);
        const tax = subtotal * (details[i]['tax'] / 100);
        return tax;
    }

    getTotal(details: any, i: any) {
        var total = 0;
        var tax = 0;
        const price = details[i]['price'];
        const quantity = details[i]['quantity'];
        const discount = details[i]['discount'] / 100;
        const subtotal = price * quantity;
        const itotal = subtotal - (discount * subtotal);
        total = total + itotal;
        const subtotalTax = subtotal - (discount * subtotal);
        const itax = subtotalTax * (details[i]['tax'] / 100);
        tax = tax + itax;
        const grandTotal = total + tax;
        return grandTotal;
    }
}
