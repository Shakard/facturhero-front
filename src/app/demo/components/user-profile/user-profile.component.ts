import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {

    file: File | null = null;
    keyName: string = null;
    logoName: string = null;
    registerForm: FormGroup;
    user: any;
    errors: any = null;

    constructor(
        public router: Router,
        public fb: FormBuilder,
        public authService: AuthService,
    ) {
        this.registerForm = this.fb.group({
            id: [''],
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

    ngOnInit() {
        this.getLoggedUser();
    }

    onSubmit() {
        const formData = new FormData();
        formData.append("id", this.registerForm.controls['id'].value);
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


        this.authService.updateProfile(formData).subscribe(
            (result) => {
                console.log(result);
            },
            (error) => {
                this.errors = error.error;
            },
            () => {
                this.getLoggedUser();
                this.updateAlert();
            }
        );
    }

    toFormData<T>(formValue: T) {
        const formData = new FormData();

        for (const key of Object.keys(formValue)) {
            const value = (formValue as any)[key];
            formData.append(key, value);
        }

        return formData;
    }

    chooseKey(event: any, fileUpload2: any) {
        if (this.registerForm.get('signature')) {
            fileUpload2.clear();
        }
        const file = event.files[0];
        this.registerForm.patchValue({
            signature: file
        });
        this.keyName = file.name;
    }

    chooseLogo(event: any, fileUpload: any) {
        if (this.registerForm.get('logo')) {
            fileUpload.clear();
        }
        const file = event.files[0];
        this.registerForm.patchValue({
            logo: file
        });
        this.logoName = file.name;
    }

    getLoggedUser() {
        this.authService.getLoggedUser()
            .subscribe(response => {
                const res: any = response;
                console.log(res.data);
                this.user = res.data;
                console.log(this.user.name);
                this.registerForm.patchValue({ id: this.user.id });
                this.registerForm.patchValue({ firstName: this.user.first_name });
                this.registerForm.patchValue({ lastName: this.user.last_name });
                this.registerForm.patchValue({ name: this.user.name });
                this.registerForm.patchValue({ email: this.user.email });
                this.registerForm.patchValue({ userRuc: this.user.user_ruc });
                this.registerForm.patchValue({ userWeb: this.user.user_web });
                this.registerForm.patchValue({ phone: this.user.phone });
                this.registerForm.patchValue({ address: this.user.address });
                this.registerForm.patchValue({ logo: this.user.logo });
            },
                (error) => {
                    this.errors = error.error;
                }
            );
    }

    updateAlert(){
        Swal.fire({
             title: "Profile updated!",
             showCancelButton: false,
             confirmButtonText: "Ok",
             confirmButtonColor: "#0B253A",
           });
      }
}
