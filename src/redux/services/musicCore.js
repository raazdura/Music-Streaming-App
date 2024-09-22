import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const musicCoreApi = createApi({
  reducerPath: 'musicCoreApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:4000/api/'
  }),
  endpoints: (builder) => ({
    getTopCharts: builder.query({ query: () => 'songs' }),
    getTopArtists: builder.query({ query: () => 'artists' }),
    getSongsByGenre: builder.query({ query: (genre) => `v1/charts/genre-world?genre_code=${genre}` }),
    getSongsByCountry: builder.query({ query: (countryCode) => `v1/charts/country?country_code=${countryCode}` }),
    getSongsBySearch: builder.query({ query: (searchTerm) => `v1/search/multi?search_type=SONGS_ARTISTS&query=${searchTerm}` }),
    getArtistDetails: builder.query({ query: (artistId) => `artists/${artistId}` }),
    getPlaylistDetails: builder.query({ query: (playlistId) => `playlist/${playlistId}` }),
    getSongDetails: builder.query({ query: ({ songid }) => `v1/tracks/details?track_id=${songid}` }),
    getSongRelated: builder.query({ query: ({ songid }) => `songs}` }),
    createPlaylist: builder.mutation({
      query: ({ songid, userid }) => ({
        url: 'playlists/create',
        method: 'POST',
        body: { song_id: songid, user_id: userid }
      })
    }),

    getUser: builder.query({ query: ({ userid }) => `auth/userdetails/${userid}`}),

    followArtist: builder.query({ query: ({ userid, artistId }) => `artists/follow?userid=${userid}&query=${artistId}`}),
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
  useGetUserQuery,
  useFollowArtistQuery
} = musicCoreApi;