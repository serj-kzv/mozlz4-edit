import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {

    transform(values: any[], predicate: (value: any) => boolean): any {
        return values.filter(item => predicate(item));
    }

}
