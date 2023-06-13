import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { Router } from '@angular/router';
import { AuthService } from '../demo/service/auth.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];
    profileItems!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService, public router: Router, private authService: AuthService) { }

    ngOnInit() {
        this.profileMenuItems();
    }

    profileMenuItems() {
        this.profileItems = [
            {
                label: 'User profile',
                icon: 'pi pi-user-edit',
                routerLink: '/profile'
            },
            {
                label: 'Logout',
                icon: 'pi pi-sign-out',
                command: () => {
                    this.logout();
                }
            },
        ];
    }

    logout() {
        this.authService.logout().subscribe(response => {
            localStorage.removeItem('token');
            localStorage.removeItem('first_name');
            localStorage.removeItem('last_name');
            localStorage.removeItem('logo');
            localStorage.removeItem('company_name');
            localStorage.removeItem('email');
            localStorage.removeItem('phone');
            localStorage.removeItem('key');
            localStorage.removeItem('user_ruc');
            localStorage.removeItem('user_web');
            localStorage.removeItem('id');
            localStorage.removeItem('rememberMe');
            this.router.navigate(['/auth/login']);
        })
    }

}
