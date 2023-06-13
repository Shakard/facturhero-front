import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ValidatedComponent } from './validated.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ValidatedComponent }
    ])],
    exports: [RouterModule]
})
export class ValidatedRoutingModule { }
