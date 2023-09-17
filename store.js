import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import userSlice from "./src/Slices/userSlice";

const persistconfig = {
  key: "root",
  version: 1,
  storage: AsyncStorage,
};

const RootReducer = combineReducers({
  user: userSlice,
  //   [Api.reducerPath]: Api.reducer,
});

const persistedReducer = persistReducer(persistconfig, RootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat([]),
});

export { RootReducer };
