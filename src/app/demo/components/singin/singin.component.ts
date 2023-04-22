import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { TokenService } from '../../service/token.service';
import { AuthStateService } from '../../service/auth-state.service';

@Component({
    selector: 'app-signin',
    templateUrl: './singin.component.html',
    styleUrls: ['./singin.component.scss'],
})

export class SigninComponent implements OnInit {
    loginForm: FormGroup;
    errors: any = null;
    public currentUser: any;

    constructor(
        public router: Router,
        public fb: FormBuilder,
        public authService: AuthService,
        private token: TokenService,
        private authState: AuthStateService
    ) {
        this.loginForm = this.fb.group({
            email: [],
            password: [],
            rememberMe: false
        });
    }

    ngOnInit() {
        this.AutoLogin();
     }

    onSubmit() {
        console.log(this.loginForm.get('rememberMe').value);

        this.authService.signin(this.loginForm.value).subscribe(
            (result) => {
                console.log(result.access_token);
                this.responseHandler(result);
                localStorage.setItem('token', result.access_token);
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
                if(this.loginForm.get('rememberMe').value) {
                    localStorage.setItem('rememberMe', 'yes')
                }
            },
            (error) => {
                this.errors = error.error;
            },
            () => {
                this.authState.setAuthState(true);
                this.loginForm.reset();
                this.router.navigate(['invoice']);
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
