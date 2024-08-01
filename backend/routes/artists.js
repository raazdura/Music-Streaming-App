const express = require('express');
const { 
    createArtist,
    getArtists,
    getArtist,
    deleteArtist,
    updateArtist,
    upload
} = require('../controllers/artistController');


const router = express.Router();

//require auth for all song routes
// router.use(requireAuth)

//get all songs
router.get('/', getArtists);

//get a song
router.get('/:id', getArtist);

//POST a new song
router.post("/", upload.single('image'), createArtist);

// DELETE a song
router.delete('/:id', deleteArtist);

// UPDATE a song
router.patch('/:id', updateArtist);

module.exports = router;