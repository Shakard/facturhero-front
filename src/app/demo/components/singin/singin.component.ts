import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { TokenService } from '../../service/token.service';
import { AuthStateService } from '../../service/auth-state.service';
import { SweetAlertMessageService } from '../../service/sweet-alert-message.service';

@Component({
    selector: 'app-signin',
    templateUrl: './singin.component.html',
    styleUrls: ['./singin.component.scss'],
})

export class SigninComponent implements OnInit {
    loginForm: FormGroup;
    errors: any = null;
    emailError: string;
    passwordError: string;
    public currentUser: any;

    constructor(
        public router: Router,
        public fb: FormBuilder,
        public authService: AuthService,
        private token: TokenService,
        private authState: AuthStateService,
        private messageService: SweetAlertMessageService,
    ) {
        this.loginForm = this.fb.group({
            email: [],
            password: [],
            rememberMe: false
        });
    }

    ngOnInit() {
        // this.AutoLogin();
    }

    onSubmit() {
        console.log(this.loginForm.get('rememberMe').value);

        this.authService.signin(this.loginForm.value).subscribe(
            (result) => {
                if (!result.user.email_verified_at) {
                    this.messageService.error('User not verified, please check your email address for verification link');
                } else {
                    // console.log(result);
                    this.responseHandler(result);
                    localStorage.setItem('first_name', result.user.first_name);
                    localStorage.setItem('last_name', result.user.last_name);
                    localStorage.setItem('logo', result.user.logo);
                    localStorage.setItem('company_name', result.user.name);
                    localStorage.setItem('email', result.user.email);
                    localStorage.setItem('phone', result.user.phone);
                    localStorage.setItem('key', result.user.signature);
                    localStorage.setItem('user_ruc', result.user.user_ruc);
                    localStorage.setItem('user_web', result.user.user_web);
                    localStorage.setItem('id', result.user.id);
                    if (this.loginForm.get('rememberMe').value) {
                        localStorage.setItem('rememberMe', 'yes')
                    }
                }

            },
            (error) => {
                this.errors = error.error;
                console.log(this.errors);
                if (this.errors.email&&this.errors.password) {
                    this.errors.email.forEach((emailError: any) => {
                        this.emailError = emailError;
                    });
                    this.errors.password.forEach((passError: any) => {
                        this.passwordError = passError;
                    });
                    this.messageService.error(this.emailError + '\n' + this.passwordError);
                    console.log(this.emailError + '\n' + this.passwordError);
                }else if (this.errors.email) {
                    this.errors.email.forEach((error: any) => {
                        this.messageService.error(error);
                    });
                }else{
                    this.errors.password.forEach((error: any) => {
                        this.messageService.error(error);
                    });
                }
            },
            () => {
                if (localStorage.getItem('token')) {
                    this.authState.setAuthState(true);
                    this.loginForm.reset();
                    this.router.navigate(['invoice']);
                }
            }
        );
    }

    AutoLogin() {
        const accessTokenObj = localStorage.getItem("token");
        // Retrieve rememberMe value from local storage
        const rememberMe = localStorage.getItem('rememberMe');
        // console.log(accessTokenObj);
        if (accessTokenObj && rememberMe == 'yes') {
            this.authState.setAuthState(true);
            this.loginForm.reset();
            this.router.navigate(['invoice']);
        } else {
            console.log("You need to login")
        }
    }

    // Handle response
    responseHandler(data: any) {
        this.token.handleData(data.access_token);
    }
}
