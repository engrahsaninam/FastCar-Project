import { configureStore } from "@reduxjs/toolkit";
import languageReducer from "./Slice";
// import notificationReducer from "../Slices/notifications";
// import authReducer from "../Slices/auth";
// import locationReducer from "../Slices/location";

export const store = configureStore({
    reducer: {
        language: languageReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;