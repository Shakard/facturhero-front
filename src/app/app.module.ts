import { NgModule } from '@angular/core';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { ProductService } from './demo/service/product.service';
import { CountryService } from './demo/service/country.service';
import { CustomerService } from './demo/service/customer.service';
import { EventService } from './demo/service/event.service';
import { IconService } from './demo/service/icon.service';
import { NodeService } from './demo/service/node.service';
import { PhotoService } from './demo/service/photo.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SigninComponent } from './demo/components/singin/singin.component';
import { InvoiceComponent } from './demo/components/invoice/invoice.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ProductComponent } from './demo/components/product/product.component';
import {ToolbarModule} from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import {DialogModule} from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { BrowserModule } from '@angular/platform-browser';
import { ClientComponent } from './demo/components/client/client.component';
import { ClientService } from './demo/service/client.service';
import {CardModule} from 'primeng/card';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {InputNumberModule} from 'primeng/inputnumber';
import { OfferComponent } from './demo/components/offer/offer.component';
import { OfferService } from './demo/service/offer.service';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { SignupComponent } from './demo/components/signup/signup.component';
import { InvoiceHistoryComponent } from './demo/components/invoice-history/invoice-history.component';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import {FileUploadModule} from 'primeng/fileupload';
import {TooltipModule} from 'primeng/tooltip';
import { UserProfileComponent } from './demo/components/user-profile/user-profile.component';
import { InvoiceTemplateComponent } from './demo/components/invoice-template/invoice-template.component';
import { CarouselModule } from 'primeng/carousel';
import { InvoiceTemplateService } from './demo/service/invoice-template.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';





@NgModule({
    declarations: [
        AppComponent,
        SigninComponent,
        InvoiceComponent,
        ProductComponent,
        ClientComponent,
        OfferComponent,
        SignupComponent,
        InvoiceHistoryComponent,
        UserProfileComponent,
        InvoiceTemplateComponent
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        CommonModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        NgxSpinnerModule,
        ToolbarModule,
        TableModule,
        DialogModule,
        ButtonModule,
        InputTextModule,
        CardModule,
        AutoCompleteModule,
        InputNumberModule,
        DropdownModule,
        InputTextareaModule,
        PasswordModule,
        CheckboxModule,
        FileUploadModule,
        TooltipModule,
        CarouselModule,
        SweetAlert2Module
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService, ClientService, OfferService, InvoiceTemplateService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
