const express = require('express');
const { 
    createSong,
    getSongs,
    getSong,
    deleteSong,
    updateSong,
    upload
} = require('../controllers/songController');


const router = express.Router();

// require auth for all song routes
// router.use(requireAuth)

// get all songs
router.get('/', getSongs);

// get a song
router.get('/public/songs/:id', getSong);

// POST a new song
router.post('/', upload.fields([
    { name: 'coverart', maxCount: 1 },
    { name: 'songpath', maxCount: 1 }
]), createSong);

// DELETE a song
router.delete('/:id', deleteSong);

// UPDATE a song
router.patch('/:id', updateSong);

module.exports = router;