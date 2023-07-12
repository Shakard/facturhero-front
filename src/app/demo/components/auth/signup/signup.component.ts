import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Province } from 'src/app/demo/api/province';
import { AuthService } from 'src/app/demo/service/auth.service';
import { ProvinceService } from 'src/app/demo/service/province.service';
import { SweetAlertMessageService } from 'src/app/demo/service/sweet-alert-message.service';

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
    provinces: Province[];
    cantons: any[];
    dropDownCities: any = [];
    province: Province;
    submitted: boolean = false;
    cities!: any[];

    constructor(
        public router: Router,
        public fb: FormBuilder,
        public authService: AuthService,
        public provinceService: ProvinceService,
        private messageService: SweetAlertMessageService
    ) {
        this.registerForm = this.fb.group({
            firstName: [null, Validators.required],
            lastName: [null, Validators.required],
            name: [null, Validators.required],
            email: [null, [Validators.email, Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
            userRuc: [null, [Validators.required, Validators.minLength(13), Validators.maxLength(13), Validators.pattern('^[0-9.]+$')]],
            userWeb: [null],
            phone: [null, Validators.required],
            address: [null, Validators.required],
            country: ['ECUADOR'],
            province: [null, Validators.required],
            canton: [null, Validators.required],
            addressDetail: [null],
            zipCode: [null],
            // logo: new FormControl(null),
            // signature: new FormControl(null),
            password: [null, [Validators.required, Validators.minLength(6)]],
            password_confirmation: [null],
        });
    }

    ngOnInit() {
        this.provinceService.getProvinces().then(data => {
            this.provinces = data.data,
                console.log(this.provinces);
        });
    }

    onSubmit() {
        this.submitted = true;
        if (this.registerForm.valid) {
            const formData = new FormData();
            formData.append("firstName", this.registerForm.controls['firstName'].value);
            formData.append("lastName", this.registerForm.controls['lastName'].value);
            formData.append("name", this.registerForm.controls['name'].value);
            formData.append("email", this.registerForm.controls['email'].value);
            formData.append("userRuc", this.registerForm.controls['userRuc'].value);
            formData.append("userWeb", this.registerForm.controls['userWeb'].value);
            formData.append("phone", this.registerForm.controls['phone'].value);
            formData.append("address", this.registerForm.controls['address'].value);
            formData.append("country", this.registerForm.controls['country'].value);
            formData.append("province", this.registerForm.controls['province'].value);
            formData.append("city", this.registerForm.controls['canton'].value);
            formData.append("address2", this.registerForm.controls['addressDetail'].value);
            formData.append("zip", this.registerForm.controls['zipCode'].value);
            // formData.append("logo", this.registerForm.controls['logo'].value);
            // formData.append("signature", this.registerForm.controls['signature'].value);
            formData.append("password", this.registerForm.controls['password'].value);
            formData.append("password_confirmation", this.registerForm.controls['password_confirmation'].value);

            this.authService.register(formData).subscribe(
                (result) => {
                    console.log(result);
                },
                (error) => {
                    this.errors = error.error;
                    console.log(this.errors.email);
                    if (this.errors.message) {
                        this.messageService.error(error.error.message);
                    }else if (this.errors.email) {
                        this.errors.email.forEach((emailError: any) => {
                            var error = emailError;
                            this.messageService.error(error);
                        });
                    }
                },
                () => {
                    this.registerForm.reset();
                    this.userRegisteredAlert();
                    this.router.navigate(['login']);
                }
            );
        } else {
            console.log('Formulario no validado');
            this.messageService.error('Please check all the fields');
        }
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

    userRegisteredAlert() {
        Swal.fire({
            title: "User Registered! Please check your email address for verification link",
            showCancelButton: false,
            confirmButtonText: "Ok",
            confirmButtonColor: "#0B253A",
        });
    }

    onChangeProvince(province: string) {
        // console.log(this.details.at(i).get("tax").value);
        // console.log(this.registerForm.value);
        this.getCantons(province);
    }

    getCantons(provincia: string) {
        this.provinceService.getProvinces().then((res: any) => {
            this.cantons = res.data!.filter((data: any) => data.provincia == provincia);
            if (this.cantons[0]) {
                this.cantons = this.cantons[0].cantones;
                console.log(this.cantons);
            }

        });
    }

    onChangeCanton(canton: string) {
        console.log(this.registerForm.value);
        // this.getCities(canton);
    }

    // getCities(canton: string) {
    //         this.cities = this.cantons!.filter((data:any) => data.canton == canton);
    //         const parroquias = this.cities[0].parroquias;

    //         for(var propName in parroquias) {
    //             if(parroquias.hasOwnProperty(propName)) {
    //                 var propValue = parroquias[propName];
    //                 this.dropDownCities.push(
    //                     { name: propValue });                }
    //         }
    //         console.log(this.dropDownCities);
    // }

    // onChangeCity(city:any) {
    //    console.log(city);
    // }
}
