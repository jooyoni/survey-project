import {
    TypedUseSelectorHook,
    useDispatch as useAppDispatch,
    useSelector as useAppSelector,
} from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

const rootReducer = combineReducers({});

export const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useSelector: TypedUseSelectorHook<RootState> = useAppSelector;
export const useDispatch = () => useAppDispatch<AppDispatch>();

export default store;
