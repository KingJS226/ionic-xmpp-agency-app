import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectSearch } from './select-search';
import { SelectSearchPage } from './select-search-page';
// import { SelectSearchModule } from '../../components/select-search/select-search';
 
@NgModule({
    declarations: [
        SelectSearch,
        SelectSearchPage
    ],
    imports: [
        IonicPageModule.forChild(SelectSearch),
        IonicPageModule.forChild(SelectSearchPage)
    ],
    exports: [
        SelectSearch,
        SelectSearchPage
    ],
    entryComponents: [
        SelectSearch,
        SelectSearchPage
    ]
})
export class SelectSearchModule { }