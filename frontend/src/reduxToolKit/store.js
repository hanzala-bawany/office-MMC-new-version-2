// store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './authSlice';
import doctorReducer from './doctorSlice';

// Only user should be persisted
const userPersistConfig = {
  key: 'user',
  storage,
};

const persistedUserReducer = persistReducer(
  userPersistConfig,
  userReducer
);

const rootReducer = combineReducers({
  authSlice: persistedUserReducer, // ✅ persisted
  doctorSlice: doctorReducer,      // ❌ NOT persisted
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export { store, persistor };




// agar auth ko persist na mar ta tp sirf itna kaam kar ta
 

// import { configureStore, combineReducers } from '@reduxjs/toolkit';
// import userReducer from './authSlice';
// import doctorReducer from './doctorSlice';


// const rootReducer = combineReducers({
//   authSlice: userReducer, // ✅ persisted
//   doctorSlice: doctorReducer,      // ❌ NOT persisted
// });

// const store = configureStore({
//   reducer: rootReducer,
// });


// export store;
