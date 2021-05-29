const genius = require('genius-lyrics-api');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json'));

module.exports = {
    getSong: (artist, title) => {
        return new Promise((resolve, reject) => {
            genius.getSong({ apiKey: config.geniusApiKey, optimizeQuery: true, title: title, artist: artist })
                .then((song) => {
                    resolve(song);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }, processLyrics: (title, lyrics) => {
        const statistics = {};
        let cleanWords = [];
        let i = 0;
        let lineCount = 0;
        let totalWords = 0;
        let foundTitleInLyrics = false;
        let repeatCount = 0;
        let longestWord = '';
        let shortestWord = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

        while (i < lyrics.length) {
            let j = lyrics.indexOf('\n', i);

            if (j == -1) {
                j = lyrics.length;
            }

            let currentLine = lyrics.substr(i, j - i);

            if (!currentLine.includes('[') && !currentLine.includes(']') && currentLine) {
                const words = currentLine.split(' ').map(word => word.toString().trim().replace(/['`~!@#$%^&*()_|+=?;:'",.<>\{\}\[\]\\\/]/gi, '').toLowerCase()).filter(word => word);

                words.forEach(word => {
                    if (cleanWords.findIndex(w => w.name === word) !== -1) {
                        const index = cleanWords.findIndex(w => w.name === word);
                        cleanWords[index].occurrences++;
                        repeatCount++;
                    } else {
                        cleanWords.push({
                            name: word,
                            occurrences: 1
                        });
                    }

                    if (word.toLowerCase() === title.toLowerCase()) {
                        foundTitleInLyrics = true;
                    }

                    if (longestWord.length < word.length) {
                        longestWord = word;
                    }

                    if (shortestWord.length > word.length) {
                        shortestWord = word;
                    }

                    totalWords++;
                });

                lineCount++;
            }

            i = j + 1;
        }

        if (!foundTitleInLyrics && lyrics.toLowerCase().includes(title.toLowerCase())) {
            foundTitleInLyrics = true;
        }

        statistics.longestWord = longestWord;
        statistics.shortestWord = shortestWord;
        statistics.wordCount = totalWords;
        statistics.repeatedWords = repeatCount;
        statistics.uniqueWords = statistics.wordCount - statistics.repeatedWords;
        statistics.repeatedWordsPercent = Math.floor((repeatCount * 100) / statistics.wordCount);
        statistics.uniqueWordsPercent = 100 - statistics.repeatedWordsPercent;
        statistics.lineCount = lineCount;
        statistics.avgWordsPerLine = parseFloat(statistics.wordCount / statistics.lineCount).toFixed(2);
        statistics.foundTitleInLyrics = foundTitleInLyrics;

        cleanWords = cleanWords.sort((a, b) => {
            if (a.occurrences > b.occurrences) {
                return -1;
            }
            if (a.occurrences < b.occurrences) {
                return 1;
            }

            return 0;
        });

        return {
            words: cleanWords,
            statistics: statistics
        };
    }
};