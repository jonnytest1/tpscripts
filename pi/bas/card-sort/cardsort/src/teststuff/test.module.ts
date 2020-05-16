
import { TestcomponentComponent } from './conditional/testcomponent/testcomponent.component';
import { NgModule } from '@angular/core';
import { ConditionalComponent } from './conditional/conditional/conditional.component';
import { CommonModule } from '@angular/common';
import { ParentComponent } from './conditional/parent/parent.component';
import { VidComponent } from './vid/vid.component';

@NgModule({
    declarations: [
        ConditionalComponent,
        TestcomponentComponent,
        ParentComponent,
        VidComponent
    ],
    imports: [
        CommonModule
    ],
    providers: [],
    bootstrap: [

    ]
})
export class TestModule { }
