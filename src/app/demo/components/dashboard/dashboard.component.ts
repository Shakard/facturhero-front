import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/product.service';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from '../../service/auth.service';
import { InvoiceService } from '../../service/invoice.service';
import { Invoice } from '../../api/invoice';
import * as moment from 'moment';
import { CurrencyPipe } from '@angular/common';
import { Client } from '../../api/client';
import { ClientService } from '../../service/client.service';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {

    items!: MenuItem[];
    products!: Product[];
    chartData: any;
    chartLabels: string[] =[];
    dataChart: number[] =[];
    chartOptions: any;
    subscription!: Subscription;
    user: any;
    certificates: any[];
    chartInvoices: any[];
    clients: Client[];

    constructor(private productService: ProductService, public layoutService: LayoutService, private authService: AuthService, private invoiceService: InvoiceService, private clientService: ClientService) {
        this.subscription = this.layoutService.configUpdate$.subscribe(() => {
            this.initChart();
        });
    }

    ngOnInit() {
        this.getLoggedUser();
        this.getClients();
        this.productService.getProductsSmall().then(data => this.products = data);

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ];
    }

    initChart(labels?: any[], data?: any[]) {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: labels,
            datasets: [
                {
                    label: 'First Dataset',
                    data: data,
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor: documentStyle.getPropertyValue('--bluegray-700'),
                    tension: .4
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    addData(chart:any, label:any, data:any, name:any) {
        console.log(console.log(chart.data.datasets[0].data));
        chart.data.labels.push(label);
        chart.data.datasets[0].label.push(name);
        chart.data.datasets[0].data.push(data);
        chart.update();
    }

    getChartInvoices() {
        this.invoiceService.getChartInvoices().subscribe((data: Invoice[]) => {
            this.chartInvoices = data;
            this.createChartData();
            // console.log(this.chartInvoices);
        });
    }

    createChartData() {
        this.chartInvoices.forEach(element => {
            this.chartLabels.push(element.date);
            this.dataChart.push(element.invoices);
        });
        console.log(this.chartLabels);
        console.log(this.dataChart);
        this.initChart(this.chartLabels, this.dataChart);
    }

    getLoggedUser() {
        this.authService.getLoggedUser()
            .subscribe(response => {
                const res: any = response;
                this.user = res.data;
                this.getChartInvoices();
                this.getInvoices();
            });
    }

    getInvoices() {
        this.invoiceService.getCertificates(this.user.id).subscribe((data: Invoice[]) => {
            this.certificates = data;
            // console.log(this.certificate);
        });
    }

    getClients() {
        this.clientService.getClients().subscribe((data: Client[]) => {
            this.clients = data;
            console.log(this.clients);
        });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
