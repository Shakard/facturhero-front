import { Component } from '@angular/core';
import { PhotoService } from '../../service/photo.service';
import { InvoiceTemplateService } from '../../service/invoice-template.service';
import { InvoiceTemplate } from '../../api/invoice-templates';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-invoice-template',
  templateUrl: './invoice-template.component.html',
  styleUrls: ['./invoice-template.component.scss']
})
export class InvoiceTemplateComponent {
    invoiceTemplates!: InvoiceTemplate[];

    images!: any[];

    galleriaResponsiveOptions: any[] = [
        {
            breakpoint: '1024px',
            numVisible: 5
        },
        {
            breakpoint: '960px',
            numVisible: 4
        },
        {
            breakpoint: '768px',
            numVisible: 3
        },
        {
            breakpoint: '560px',
            numVisible: 1
        }
    ];

    carouselResponsiveOptions: any[] = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3
        },
        {
            breakpoint: '768px',
            numVisible: 2,
            numScroll: 2
        },
        {
            breakpoint: '560px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    constructor(private invoiceTemplateService: InvoiceTemplateService, private photoService: PhotoService) { }

    ngOnInit() {
        this.invoiceTemplateService.getTemplatesSmall().then(invoiceTemplates => {
            this.invoiceTemplates = invoiceTemplates;
            console.log(this.invoiceTemplates);

        });

        this.photoService.getImages().then((images: any[]) => {
            this.images = images;
        });
    }

    setFavorite(templateName: string) {
        // console.log(templateName);
        // localStorage.setItem('templateName',templateName);
        // this.successAlert();
    }

    successAlert() {
        Swal.fire({
            title: "Template set",
            showCancelButton: false,
            confirmButtonText: "Ok",
            confirmButtonColor: "#0B253A",
        });
    }

}
