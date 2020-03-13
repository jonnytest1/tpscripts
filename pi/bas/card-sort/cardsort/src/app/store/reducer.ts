import { createReducer, on } from '@ngrx/store';
import { addLeaf } from './actions';
import { Leaf } from '../model/leaf';


export interface State {
    leafs: Array<Leaf>;
}
export const initialState: State = {
    leafs: []
};

export const _counterReducer = createReducer(initialState,
    on(addLeaf, (store, action) => ({ ...store, leafs: [...store.leafs, action.leaf] }))
);


export function reducer(state, action) {
    return _counterReducer(state, action);
}

