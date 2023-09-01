import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import { userApi } from "./services/user";
import { sponsorApi } from "./services/sponsor";
import { countryApi } from "./services/country";
import { officerApi } from "./services/officer";
import { rewardApi } from "./services/reward";
import { tipApi } from "./services/tip";
import { goalApi } from "./services/goal";
import { insightApi } from "./services/insight";

import notificationsReducer, {
  reducerPath as notificationsReducerPath,
} from "./slices/notifications";

import authReducer, { reducerPath as authReducerPath } from "./slices/auth";
import { communityApi } from "./services/community";
import { serviceConnectionsApi } from "./services/service-connections";
import { servicesApi } from "./services/service";
import { serviceReadingsApi } from "./services/service-readings";

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  blacklist: [
    userApi.reducerPath,
    sponsorApi.reducerPath,
    communityApi.reducerPath,
    serviceConnectionsApi.reducerPath,
    serviceReadingsApi.reducerPath,
    servicesApi.reducerPath,
    countryApi.reducerPath,
    officerApi.reducerPath,
    rewardApi.reducerPath,
    tipApi.reducerPath,
    goalApi.reducerPath,
    insightApi.reducerPath,
    notificationsReducerPath,
    "auth",
  ],
};

const rootReducer = combineReducers({
  [authReducerPath]: authReducer,
  [userApi.reducerPath]: userApi.reducer,
  [sponsorApi.reducerPath]: sponsorApi.reducer,
  [communityApi.reducerPath]: communityApi.reducer,
  [serviceConnectionsApi.reducerPath]: serviceConnectionsApi.reducer,
  [serviceReadingsApi.reducerPath]: serviceReadingsApi.reducer,
  [servicesApi.reducerPath]: servicesApi.reducer,
  [countryApi.reducerPath]: countryApi.reducer,
  [officerApi.reducerPath]: officerApi.reducer,
  [rewardApi.reducerPath]: rewardApi.reducer,
  [tipApi.reducerPath]: tipApi.reducer,
  [goalApi.reducerPath]: goalApi.reducer,
  [insightApi.reducerPath]: insightApi.reducer,
  [notificationsReducerPath]: notificationsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const makeStore = () =>
  configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredPaths: ["auth"],
          ignoredActions: [
            "auth/setAuth",
            FLUSH,
            REHYDRATE,
            PAUSE,
            PERSIST,
            PURGE,
            REGISTER,
          ],
        },
      })
        .concat(userApi.middleware)
        .concat(sponsorApi.middleware)
        .concat(communityApi.middleware)
        .concat(servicesApi.middleware)
        .concat(serviceConnectionsApi.middleware)
        .concat(serviceReadingsApi.middleware)
        .concat(officerApi.middleware)
        .concat(countryApi.middleware)
        .concat(rewardApi.middleware)
        .concat(tipApi.middleware)
        .concat(goalApi.middleware)
        .concat(insightApi.middleware)
  });

export const store = makeStore();
export const persistor = persistStore(store);

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
