import { Route } from '@angular/router';
import { ConditionalComponent } from './conditional/conditional/conditional.component';
import { ParentComponent } from './conditional/parent/parent.component';

export const TestRoutes: Array<Route> = [
    {
        path: 'conditional',
        component: ParentComponent
    }
];
