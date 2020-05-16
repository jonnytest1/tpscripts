import { Route } from '@angular/router';
import { ConditionalComponent } from './conditional/conditional/conditional.component';
import { ParentComponent } from './conditional/parent/parent.component';
import { VidComponent } from './vid/vid.component';

export const TestRoutes: Array<Route> = [
    {
        path: 'conditional',
        component: ParentComponent
    }, {
        path: 'vid',
        component: VidComponent
    }
];
