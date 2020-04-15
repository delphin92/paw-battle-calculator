import { combineReducers } from '@reduxjs/toolkit';
import armiesState from './slicers/armiesState';
import battles from 'redux/slicers/battles';

const rootReducer = combineReducers({
    armiesState,
    battles
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;