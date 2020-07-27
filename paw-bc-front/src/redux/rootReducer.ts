import { combineReducers } from '@reduxjs/toolkit';
import armiesState from './slicers/armiesState';
import battles from 'redux/slicers/battles';
import battlesLog from 'redux/slicers/battlesLog';

const rootReducer = combineReducers({
    armiesState,
    battles,
    battlesLog
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;