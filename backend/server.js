require('dotenv').config();

const express = require("express");
const path = require("path");
const cors = require('cors');
const fs = require("fs");
const mongoose = require("mongoose");
const songRoutes = require("./routes/songs");
const albumRoutes = require("./routes/albums");
const artistRoutes = require("./routes/artists");
const playlistRoutes = require("./routes/playlists");


const errorHandler = require('./middleware/error');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
}));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// workouts routes
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/artists", artistRoutes);
app.use("/api/playlists", playlistRoutes);

app.use("/api/auth", require("./routes/auth"));
app.use("/api/private", require("./routes/private"));

// Error Handler (Should be last piece of middleware)
app.use(errorHandler);

app.get('/api/public/images/songs/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, 'public/images/songs', imageName);

  console.log(imageName);
  console.log(imagePath);

  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('Image not found');
    }

    res.sendFile(imagePath, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
    });
  });
});

app.get('/api/public/images/artists/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, 'public/images/artists', imageName);

  console.log(imageName);
  console.log(imagePath);

  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('Image not found');
    }

    res.sendFile(imagePath, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
    });
  });
});

app.get('/api/public/images/albums/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, 'public/images/albums', imageName);

  console.log(imageName);
  console.log(imagePath);

  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('Image not found');
    }

    res.sendFile(imagePath, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
    });
  });
});

const PORT = process.env.PORT;

// connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    //listen to requests
    app.listen(PORT , () => {
      console.log("Connected to db and Listening on port 4000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
