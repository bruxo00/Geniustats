const route = require('express').Router();
const { StatusCodes } = require('http-status-codes');
const genius = require('../services/genius');
const logger = require('../services/logger');
const search = require('youtube-search');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json'));

route.post('/get-song', function (req, res) {
    try {
        const artist = req.sanitize(req.body.artist);
        const songName = req.sanitize(req.body.songName);

        genius.getSong(artist, songName)
            .then(async (song) => {
                const processedLyrics = genius.processLyrics(songName, song.lyrics);

                const youtubeData = await search(`${artist} - ${songName}`, {
                    maxResults: 1,
                    key: config.youtubeApiKey
                });

                return res.status(StatusCodes.OK).json({
                    words: processedLyrics.words,
                    statistics: processedLyrics.statistics,
                    art: song.albumArt,
                    lyrics: song.lyrics,
                    youtubeUrl: youtubeData.results[0]?.link
                });
            })
            .catch((error) => {
                logger.error(error);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong while fetching data from Genius. Maybe the song doesn\'t exist?' });
            })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
})

module.exports = route;