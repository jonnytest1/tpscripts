import { createAction, props } from '@ngrx/store';
import { Leaf } from '../model/leaf';

export const addLeaf = createAction('addLeaf', props<{ leaf: Leaf }>());
