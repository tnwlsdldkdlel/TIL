import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// persist 설정
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ["auth"]
};

// rootReducer를 persistReducer로 래핑
const persistedReducer = persistReducer(persistConfig, rootReducer);

// store 생성
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
    // devTools: process.env.NODE_ENV !== 'production',
});

// persistor 생성
export const persistor = persistStore(store);
export default store;
