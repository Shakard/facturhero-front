import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { SigninComponent } from './demo/components/singin/singin.component';
import { InvoiceComponent } from './demo/components/invoice/invoice.component';
import { ProductComponent } from './demo/components/product/product.component';
import { ClientComponent } from './demo/components/client/client.component';
import { OfferComponent } from './demo/components/offer/offer.component';
import { SignupComponent } from './demo/components/signup/signup.component';
import { InvoiceHistoryComponent } from './demo/components/invoice-history/invoice-history.component';
import { InvoiceTemplateComponent } from './demo/components/invoice-template/invoice-template.component';
import { UserProfileComponent } from './demo/components/user-profile/user-profile.component';
import { AuthGuard } from './guard/auth.guard';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: '', redirectTo: '/landing', pathMatch: 'full' },
            { path: 'login', component: SigninComponent },
            { path: 'register', component: SignupComponent },
            {
                path: '', component: AppLayoutComponent, canActivate: [AuthGuard],
                children: [
                    { path: 'dashboard', loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    { path: 'invoice', component: InvoiceComponent },
                    { path: 'invoice-history', component: InvoiceHistoryComponent },
                    { path: 'invoice-template', component: InvoiceTemplateComponent },
                    { path: 'profile', component: UserProfileComponent },
                    { path: 'offer', component: OfferComponent },
                    { path: 'product', component: ProductComponent },
                    { path: 'client', component: ClientComponent },
                ]
            },
            { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
            { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
