import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import Swal from 'sweetalert2';
import { Province } from '../../api/province';
import { ProvinceService } from '../../service/province.service';

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
    provinces: Province[];
    cantons: any[];

    constructor(
        public router: Router,
        public fb: FormBuilder,
        public authService: AuthService,
        private provinceService: ProvinceService
    ) {
        this.registerForm = this.fb.group({
            id: [''],
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
            logo: new FormControl(null, [Validators.required,]),
            signature: new FormControl(null, [Validators.required,]),
            password: [''],
            addressId: [''],
            password_confirmation: [''],
        });
    }

    ngOnInit() {
        this.getLoggedUser();
        this.getProvinces();

    }

    getProvinces() {
        this.provinceService.getProvinces().then(data => {
            this.provinces = data.data,
                console.log(this.provinces);
        });
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
        formData.append("country", this.registerForm.controls['country'].value);
        formData.append("province", this.registerForm.controls['province'].value);
        formData.append("city", this.registerForm.controls['canton'].value);
        formData.append("address2", this.registerForm.controls['addressDetail'].value);
        formData.append("zip", this.registerForm.controls['zipCode'].value);
        formData.append("logo", this.registerForm.controls['logo'].value);
        formData.append("signature", this.registerForm.controls['signature'].value);
        formData.append("password", this.registerForm.controls['password'].value);
        formData.append("password_confirmation", this.registerForm.controls['password_confirmation'].value);
        formData.append("addressId", this.registerForm.controls['addressId'].value);

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
        const userId = localStorage.getItem('id');
        this.authService.getLoggedUserWIthAddress([userId])
            .subscribe(response => {
                const res: any = response;
                console.log(res.data[0]);
                this.user = res.data[0];
                this.registerForm.patchValue({ id: this.user.id });
                this.registerForm.patchValue({ firstName: this.user.first_name });
                this.registerForm.patchValue({ lastName: this.user.last_name });
                this.registerForm.patchValue({ name: this.user.name });
                this.registerForm.patchValue({ email: this.user.email });
                this.registerForm.patchValue({ userRuc: this.user.user_ruc });
                this.registerForm.patchValue({ userWeb: this.user.user_web });
                this.registerForm.patchValue({ phone: this.user.phone });
                this.registerForm.patchValue({ province: this.user.address.province });
                this.registerForm.patchValue({ canton: this.user.address.city });
                this.registerForm.patchValue({ address: this.user.address.line1 });
                this.registerForm.patchValue({ addressDetail: this.user.address.line2 });
                this.registerForm.patchValue({ zipCode: this.user.address.zip });
                this.registerForm.patchValue({ logo: this.user.logo });
                this.registerForm.patchValue({ addressId:this.user.address.id });
        this.getCantons(this.user.address.province);
            },
                (error) => {
                    this.errors = error.error;
                }
            );
    }

    updateAlert() {
        Swal.fire({
            title: "Profile updated!",
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

    onChangeCanton() {
        console.log(this.registerForm.value);
    }
}
