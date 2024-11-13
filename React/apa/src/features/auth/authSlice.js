import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { login, logout } from "../../api/user"; // 로그인/로그아웃 함수 (예시)


export const loginUser = createAsyncThunk(
    'auth/login',
    async (input, { rejectWithValue }) => {
        try {
            const result = await login(input);
            return {
                id: result.email,
                name: result.displayName
            };
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await logout();
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);


const initialState = {
    user: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
            })
    }
});

export default authSlice.reducer;