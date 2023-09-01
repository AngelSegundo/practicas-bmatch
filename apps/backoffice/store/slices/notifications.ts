import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

export const reducerPath = "notifications";

declare type Template = "info" | "success" | "warning" | "error";
export interface BaseAlert {
  template: Template;
  text: string;
}

type State = {
  alert: BaseAlert | null;
};

const initialState = {
  alert: null,
};

const slice = createSlice({
  name: reducerPath,
  initialState: initialState as State,
  reducers: {
    showAlert: (state, action: PayloadAction<BaseAlert>) => {
      state.alert = action.payload;
    },
    hideAlert: (state) => {
      state.alert = null;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload[reducerPath],
      };
    },
  },
});

export const { showAlert, hideAlert } = slice.actions;

export default slice.reducer;
