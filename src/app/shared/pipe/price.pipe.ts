import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'price'
})
export class PricePipe implements PipeTransform {
  transform(value: number): string {
    return '₨ ' + value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }
}
