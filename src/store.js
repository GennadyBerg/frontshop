import storage from "redux-persist/lib/storage";
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { frontEndSlice, goodsApi } from './reducers';
import { categoryApi } from './reducers/categoryReducer';
import { ordersApi } from './reducers/ordersReducer';
import { authApi, authSlice, cartSlice } from './reducers';
import {
  persistReducer, persistStore, FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import thunk from 'redux-thunk';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: [
    //authSlice.name,
    authApi.reducerPath,
    //cartSlice.name,
    categoryApi.reducerPath,
    goodsApi.reducerPath,
    ordersApi.reducerPath,
    frontEndSlice.name,
  ]
};
const combineReducer = combineReducers({
  [authSlice.name]: authSlice.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [goodsApi.reducerPath]: goodsApi.reducer,
  [ordersApi.reducerPath]: ordersApi.reducer,
  [frontEndSlice.name]: frontEndSlice.reducer,
  [cartSlice.name]: cartSlice.reducer,
});

const rootReducer = persistReducer(persistConfig, combineReducer);

export const store = configureStore({
  middleware: (getDefaultMiddleware) => [
    thunk,
    ...getDefaultMiddleware({ serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] } }),
    categoryApi.middleware,
    goodsApi.middleware,
    ordersApi.middleware,
    authApi.middleware,
  ],
  reducer: rootReducer
});
store.subscribe(() => console.log(store.getState()));
export const persistedStore = persistStore(store);
