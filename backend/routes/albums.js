const express = require('express');
const { 
    createAlbum,
    getAlbums,
    getAlbum,
    deleteAlbum,
    updateAlbum,
    upload
} = require('../controllers/albumController');


const router = express.Router();

//require auth for all song routes
// router.use(requireAuth)

//get all songs
router.get('/', getAlbums);

//get a song
router.get('/:id', getAlbum);

//POST a new song
router.post('/',  upload.single('image'), createAlbum);

// DELETE a song
router.delete('/:id', deleteAlbum);

// UPDATE a song
router.patch('/:id', updateAlbum);

module.exports = router;