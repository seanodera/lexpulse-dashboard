import {createSlice} from "@reduxjs/toolkit";


// export const signInUser = createAsyncThunk('authentication/signIn', async ({email, password}: {email: string,password: string}) => {
//
//     return {}
// })

const AuthenticationSlice = createSlice({
    name: "authentication",
    initialState: undefined,
    reducers: {

    },


})
export default AuthenticationSlice.reducer;