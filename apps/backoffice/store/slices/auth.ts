import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User as FirebaseUser } from "firebase/auth";
import { HYDRATE } from "next-redux-wrapper";

export const reducerPath = "auth";

type State = {
  user: FirebaseUser | null;
  isLoading: boolean;
};

const initialState: State = {
  user: null,
  isLoading: true,
};

const slice = createSlice({
  name: reducerPath,
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAuth: (state, action: PayloadAction<FirebaseUser | null>) => {
      state.user = action.payload;
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

export const { setAuth, setIsLoading } = slice.actions;

export default slice.reducer;
