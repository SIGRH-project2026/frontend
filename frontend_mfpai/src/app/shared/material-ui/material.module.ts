import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Angular Material Components
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MatStepperModule,
        MatButtonModule,
        MatPaginatorModule,
        MatExpansionModule,
        MatIconModule,
        MatTabsModule
    ],
    exports: [
        CommonModule,
        MatStepperModule,
        MatButtonModule,
        MatPaginatorModule,
        MatExpansionModule,
        MatIconModule,
        MatTabsModule
    ]
})
export class MaterialUiModule { }
