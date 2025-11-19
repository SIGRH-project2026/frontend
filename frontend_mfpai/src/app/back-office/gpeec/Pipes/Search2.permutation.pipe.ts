import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'Search2PermutationPipe'
})
export class Search2PermutationPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    
    if(!value) return null;
    if(!args) return value;

    args = args.toLowerCase();
    return value.filter((item : any)=>{
        return JSON.stringify(item).toLocaleLowerCase().includes(args);
    })

    return value; 
  }
}