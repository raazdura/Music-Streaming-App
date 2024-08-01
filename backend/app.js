const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const fs = require('fs');

const multer = require('multer')

app.use(cors({
    origin: 'http://localhost:3000',
}));

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    },
    destination: function (req, file, cb) {
      cb(null, './songs')
    },
})

const upload = multer({ storage })

app.post('/api/upload_files', upload.any('file'), (req, res) => {
    res.send({ message: 'Successfully uploaded files' })
})

const songsFolder = path.join(__dirname, 'songs');

// Sample data stored in memory
const songs = [
    {
        title: "Let Her Go",     //song.images?.coverart song?.key song?.artists[0]?.adamid song.subtitle
        subtitle: "Passenger",
        artists: [
            {
                name: "Passenger",
                adamId: "123456789"
            },
        ],
        uniqueKey: "10 Passenger - Let Her Go (www.SongsLover.com)",
        coverArt: "http://localhost:4000/image/let-her-go.jpg",
        streamUrl: "http://localhost:4000/api/songs/10 Passenger - Let Her Go (www.SongsLover.com)/stream"
    },
    {
        title: "NARUTO-SHIPPUDEN-OP-16",
        subtitle: "Kana Boon",
        artists: [
            {
                name: "Kana Boon",
                adamId: "123123123"
            },
        ],
        uniqueKey: "NARUTO-SHIPPUDEN-OP-16",
        coverArt: "http://localhost:4000/image/naruto-shippuden.jpg",
        streamUrl: "http://localhost:4000/api/songs/NARUTO-SHIPPUDEN-OP-16/stream"
    },
    {
        title: "Yellow",
        subtitle: "Coldplay",
        artists: [
            {
                name: "Coldplay",
                adamId: "123123124"
            },
        ],
        uniqueKey: "Yellow",
        coverArt: "http://localhost:4000/image/yellow.jpg",
        streamUrl: "http://localhost:4000/api/songs/Yellow/stream"
    }
];

app.get('/api/songs', (req, res) => {
    res.json( songs );
});

// app.get('/api/songs/:uniqueKey/stream', (req, res) => {
//     const { uniqueKey } = req.params;
//     const song = songs.find(song => song.uniqueKey === uniqueKey);

//     if (!song) {
//         return res.status(404).json({ message: 'Song not found' });
//     }

//     const songPath = path.join(songsFolder, `${uniqueKey}.mp3`);
//     res.sendFile(songPath, err => {
//         if (err) {
//             res.status(500).json({ message: 'Error streaming the song' });
//         }
//     });
// });

app.get('/api/songs/:uniqueKey/stream', (req, res) => {
    const { uniqueKey } = req.params;
    const song = songs.find(song => song.uniqueKey === uniqueKey);

    if (!song) {
        return res.status(404).json({ message: 'Song not found' });
    }

    const songPath = path.join(songsFolder, `${uniqueKey}.mp3`);
    res.sendFile(songPath, err => {
        if (err) {
            if (!res.headersSent) {
                res.status(500).json({ message: 'Error streaming the song' });
            } else {
                console.error('Error streaming the song:', err);
            }
        }
    });
});


app.get('/image/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, 'images', imageName);
  
    fs.access(imagePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).send('Image not found');
      }
  
      res.sendFile(imagePath);
    });
});



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
