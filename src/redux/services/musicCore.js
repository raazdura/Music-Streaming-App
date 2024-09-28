import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const musicCoreApi = createApi({
  reducerPath: 'musicCoreApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:4000/api/',
    prepareHeaders: (headers) => {
      const userId = localStorage.getItem('userid');
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      if (userId) {
        headers.set('userid', userId);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTopCharts: builder.query({ query: () => 'songs' }),
    getTopArtists: builder.query({ query: () => 'artists' }),
    getSongsByGenre: builder.query({ query: (genre) => `v1/charts/genre-world?genre_code=${genre}` }),
    getSongsByCountry: builder.query({ query: (countryCode) => `v1/charts/country?country_code=${countryCode}` }),
    getSongsBySearch: builder.query({ query: (searchTerm) => `v1/search/multi?search_type=SONGS_ARTISTS&query=${searchTerm}` }),
    getArtistDetails: builder.query({ query: (artistId) => `artists/${artistId}` }),
    getPlaylistDetails: builder.query({ query: (playlistId) => `playlists/${playlistId}` }),
    getSongDetails: builder.query({ query: ({ songid }) => `v1/tracks/details?track_id=${songid}` }),
    getSongRelated: builder.query({ query: ({ songid }) => `songs}` }),
    createPlaylist: builder.mutation({
      query: ({ songid, userid }) => ({
        url: 'playlists/create',
        method: 'POST',
        body: { song_id: songid, user_id: userid }
      })
    }),
    updatePlaylist: builder.mutation({
      query: ({ playlistId, formData }) => ({
        url: `playlists/update/${playlistId}`,
        method: 'PATCH',
        body: formData,
      }),
    }),
    addSongToPlaylist: builder.mutation({
      query: ({ playlistid, songid }) => ({
        url: 'playlists/addSong',
        method: 'PATCH',
        body: { playlistid, songid }
      })
    }),
    removeSongFromPlaylist: builder.mutation({
      query: ({ playlistid, songid }) => ({
        url: 'playlists/removeSong',
        method: 'PATCH',
        body: { playlistid, songid }
      })
    }),
    deletePlaylist: builder.mutation({
      query: ({ playlistid }) => ({
        url: 'playlists/delete',
        method: 'DELETE',
        body: { playlistid }
      })
    }),
    followArtist: builder.mutation({
      query: ({ artistid, userid }) => ({
        url: 'auth/follow',
        method: 'PATCH',
        body: { artistid, userid }
      })
    }),
    unfollowArtist: builder.mutation({
      query: ({ artistid, userid }) => ({
        url: 'auth/unfollow',
        method: 'PATCH',
        body: { artistid, userid }
      })
    }),

    getUser: builder.query({ query: ({ userid }) => `auth/userdetails/${userid}`}),

  }),
});

export const {
  useGetTopChartsQuery,
  useGetTopArtistsQuery,
  useGetSongsByGenreQuery,
  useGetSongsByCountryQuery,
  useGetSongsBySearchQuery,
  useGetArtistDetailsQuery,
  useGetPlaylistDetailsQuery,
  useGetSongDetailsQuery,
  useGetSongRelatedQuery,
  useCreatePlaylistMutation,
  useUpdatePlaylistMutation,
  useAddSongToPlaylistMutation,
  useRemoveSongFromPlaylistMutation,
  useDeletePlaylistMutation,
  useGetUserQuery,
  useFollowArtistMutation,
  useUnfollowArtistMutation,
} = musicCoreApi;
