const fs = require("fs");
const path = require("path");

/**
 * Helper function to load all JSON files from the 'data/songs' directory .
 */
const loadSongs = () => {
    const songsDir = path.join(__dirname, "../data/songs");
    const songs = [];

    try {
        const files = fs.readdirSync(songsDir);
        files.forEach((file) => {
            if (file.endsWith(".json")) {
                const filePath = path.join(songsDir, file);
                const fileContent = fs.readFileSync(filePath, "utf-8");
                const song = JSON.parse(fileContent);
                songs.push(song);
            }
        });
    } catch (error) {
        console.error("Error loading songs - ", error);
    }

    return songs;
};

module.exports.searchSongsHandler = (req, res) => {
    const searchQuery = req.query.search;

    if (!searchQuery) {
        return res.status(400).json({ error: "Search query is required ." });
    }

    const songs = loadSongs();

    const matchedSongs = songs.filter((song) => {
        const title = song.title || "";
        const artist = song.artist || "";
        return (
            title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            artist.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    if (matchedSongs.length === 0) {
        return res.status(404).json({message: "No songs found ."});
    }

    res.status(200).json(matchedSongs);
};
