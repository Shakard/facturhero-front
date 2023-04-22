import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../api/product';
import { ProductService } from '../../service/product.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss']
})
export class ProductComponent {
    productDialog: boolean;
    products: Product[];
    product: Product;
    productId: any;
    selectedProducts: Product[];
    submitted: boolean;
    statuses: any[];

    formProduct: FormGroup;

    constructor(private productService: ProductService) { }

    ngOnInit() {
        this.getProducts();
        this.buildFormProduct();
    }

    getProducts() {
        this.productService.getProducts().subscribe((data: Product[]) => {
            this.products = data;
            console.log(this.products);
        });
    }

    buildFormProduct() {
        this.formProduct = new FormGroup({
            code: new FormControl('', Validators.required),
            item: new FormControl('', Validators.required),
            quantity: new FormControl('', Validators.required),
            price: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")])
        });
    }

    get f() {
        return this.formProduct.controls;
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    deleteSelectedProducts() {

    }

    openEditProduct(product: Product) {
        console.log(product);
        this.productId = product.id;
        this.formProduct.patchValue({ code: product.codigo });
        this.formProduct.patchValue({ item: product.descripcion });
        this.formProduct.patchValue({ quantity: product.cantidad });
        this.formProduct.patchValue({ price: product.precio_venta });
        this.productDialog = true;
    }

    deleteProduct(product: Product) {
        this.questionDelete({}).then((result) => {
            if (result.isConfirmed) {
                console.log(product);
                this.productService.deleteProduct(product.id).subscribe(res => {
                    console.log('Product deleted successfully!');
                    this.getProducts();
                    this.productDeletedAlert();
                })
            }
        });

    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    newProduct() {
        console.log(this.formProduct.value);
        this.productService.createProduct(this.formProduct.value).subscribe(res => {
            console.log('Product created successfully!');
            this.getProducts();
            this.formProduct.reset();
            this.hideDialog();
            this.successAlert();
        })
    }

    editProduct() {
        console.log(this.formProduct.value);
        this.productService.updateProduct(this.productId, this.formProduct.value).subscribe(res => {
            console.log('Product updated successfully!');
            this.getProducts();
            this.formProduct.reset();
            this.productId = 0;
            this.hideDialog();
            this.successAlert();
        })
    }

    submit() {
        if (this.productId) {
            this.editProduct();
        }
        else {
            this.newProduct();
        }
    }

    questionDelete({ text = 'Are you sure about deleting this product?' }) {
        return Swal.fire({
            text,
            // icon: 'warning',
            width: '300px',
            color: '#0B253A',
            showCancelButton: true,
            confirmButtonColor: '#F05123',
            cancelButtonColor: '#3085d6',
            reverseButtons: true,
            padding: '2px',
            confirmButtonText: 'Delete'
        });
    }

    productDeletedAlert() {
        Swal.fire({
            title: "Product deleted",
            showCancelButton: false,
            confirmButtonText: "Ok",
            confirmButtonColor: "#0B253A",
        });
    }

    successAlert() {
        Swal.fire({
            title: "Success!",
            showCancelButton: false,
            confirmButtonText: "Ok",
            confirmButtonColor: "#0B253A",
        });
    }
}
