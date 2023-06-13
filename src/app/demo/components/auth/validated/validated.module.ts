import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ValidatedComponent } from './validated.component';
import { ButtonModule } from 'primeng/button';
import { AccessRoutingModule } from '../access/access-routing.module';
import { ValidatedRoutingModule } from './validated-routing.module';



@NgModule({
    declarations: [
        ValidatedComponent
      ],
      imports: [
        CommonModule,
        ValidatedRoutingModule,
        ButtonModule
      ]
})
export class ValidatedModule { }
