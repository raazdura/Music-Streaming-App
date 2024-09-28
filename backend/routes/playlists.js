const express = require('express');
const { 
    createPlaylist,
    getPlaylists,
    getPlaylist,
    deletePlaylist,
    updatePlaylist,
    deleteAll,
    addSong,
    removeSong,
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

router.patch('/update/:playlistId', upload.single('coverImage'), updatePlaylist);

// DELETE a song
router.delete('/delete', deletePlaylist);

router.patch('/addSong', addSong);

router.patch('/removeSong', removeSong);

router.patch('/update', updatePlaylist);

//update playlist items
router.patch('/:id/track', updatePlaylist);

router.get('/deleteall', deleteAll);

module.exports = router;