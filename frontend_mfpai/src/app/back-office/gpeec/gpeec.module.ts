import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GpeecRoutingModule } from './gpeec-routing.module';
import { Search2PermutationPipe } from './Pipes/Search2.permutation.pipe';
import { SearchPermutationPipe } from './Pipes/Search.permutation.pipe';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    GpeecRoutingModule,
  ]
})
export class GpeecModule { }
