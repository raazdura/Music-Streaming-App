import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    playlists: null, // Fix typo: 'playlsits' to 'playlists'
    token: null,
    isAuthenticated: false,
    error: null,
    isChanged: false, // You had this in your setUser reducer but not in the initial state
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.playlists = action.payload.user.playlists;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.isChanged = false;
        },
        logout: (state) => {
            state.user = null;
            state.playlists = null; // Fix typo: 'playlist' to 'playlists'
            state.token = null;
            state.isAuthenticated = false;
        },
        updateUserPlaylist: (state, action) => {
            if (state.playlists) {
                state.playlists.push(action.payload); // Add the new playlist
            }
        },
        deleteUserPlaylist: (state, action) => {
            if (state.playlists) {
                state.playlists = state.playlists.filter(playlist => playlist.id !== action.payload);
            }
        },
    }
});

export const { setUser, logout, updateUserPlaylist, deleteUserPlaylist } = userSlice.actions;

export default userSlice.reducer;
