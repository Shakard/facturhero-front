import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
})

export class SignupComponent implements OnInit {
    file: File | null = null;
    keyName: string = null;
    logoName: string = null;
    registerForm: FormGroup;
    errors: any = null;

    constructor(
        public router: Router,
        public fb: FormBuilder,
        public authService: AuthService,
    ) {
        this.registerForm = this.fb.group({
            firstName: [''],
            lastName: [''],
            name: [''],
            email: [''],
            userRuc: [''],
            userWeb: [''],
            phone: [''],
            address: [''],
            logo: new FormControl(null, [Validators.required,]),
            signature: new FormControl(null, [Validators.required,]),
            password: [''],
            password_confirmation: [''],
        });
    }

    ngOnInit() { }

    onSubmit() {
        const formData = new FormData();
        formData.append("firstName", this.registerForm.controls['firstName'].value);
        formData.append("lastName", this.registerForm.controls['lastName'].value);
        formData.append("name", this.registerForm.controls['name'].value);
        formData.append("email", this.registerForm.controls['email'].value);
        formData.append("userRuc", this.registerForm.controls['userRuc'].value);
        formData.append("userWeb", this.registerForm.controls['userWeb'].value);
        formData.append("phone", this.registerForm.controls['phone'].value);
        formData.append("address", this.registerForm.controls['address'].value);
        formData.append("logo", this.registerForm.controls['logo'].value);
        formData.append("signature", this.registerForm.controls['signature'].value);
        formData.append("password", this.registerForm.controls['password'].value);

        console.log(this.registerForm.value);


        this.authService.register(formData).subscribe(
            (result) => {
                console.log(result);
            },
            (error) => {
                this.errors = error.error;
            },
            () => {
                this.registerForm.reset();
                this.userRegisteredAlert();
                this.router.navigate(['login']);
            }
        );
    }
    changeSignatureKey(event: any) {
        const file = (event.target as HTMLInputElement)?.files?.[0];
        this.registerForm.patchValue({
        signature: file
     });

    }

    changeLogo(event: any) {
        const file = (event.target as HTMLInputElement)?.files?.[0];
        console.log(file);

        this.registerForm.patchValue({
        logo: file
     });
    }

    toFormData<T>( formValue: T ) {
        const formData = new FormData();

        for ( const key of Object.keys(formValue) ) {
          const value = (formValue as any)[key];
          formData.append(key, value);
        }

        return formData;
    }

    chooseKey(event: any, fileUpload2:any)  {
        if (this.registerForm.get('signature')) {
            fileUpload2.clear();
        }
        const file = event.files[0];
        this.registerForm.patchValue({
            signature: file
         });
        this.keyName= file.name;
    }

    chooseLogo(event: any, fileUpload:any)  {
        if (this.registerForm.get('logo')) {
            fileUpload.clear();
        }
        const file = event.files[0];
        this.registerForm.patchValue({
            logo: file
         });
        this.logoName= file.name;
    }

    userRegisteredAlert(){
        Swal.fire({
             title: "User Registered",
             showCancelButton: false,
             confirmButtonText: "Ok",
             confirmButtonColor: "#0B253A",
           });
      }
}
