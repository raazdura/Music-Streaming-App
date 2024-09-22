const express = require('express');
const { 
    createPlaylist,
    getPlaylists,
    getPlaylist,
    deletePlaylist,
    updatePlaylist,
    upload
} = require('../controllers/playlistController');


const router = express.Router();

//require auth for all song routes
// router.use(requireAuth)

//get all songs
router.get('/', getPlaylists);

//get a playlist
router.get('/:id', getPlaylist);

//POST a new song
router.post('/create', createPlaylist);

// DELETE a song
router.delete('/:id', deletePlaylist);

// UPDATE a playlist details
router.patch('/:id', updatePlaylist);

//update playlist items
router.patch('/:id/track', updatePlaylist);

module.exports = router;