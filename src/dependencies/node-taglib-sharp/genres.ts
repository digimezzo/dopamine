// ID3v1 audio genres (INDEXES MATTER)
const audioGenres = [
    "Blues",
    "Classic Rock",
    "Country",
    "Dance",
    "Disco",
    "Funk",
    "Grunge",
    "Hip-Hop",
    "Jazz",
    "Metal",
    "New Age",
    "Oldies",
    "Other",
    "Pop",
    "R&B",
    "Rap",
    "Reggae",
    "Rock",
    "Techno",
    "Industrial",
    "Alternative",
    "Ska",
    "Death Metal",
    "Pranks",
    "Soundtrack",
    "Euro-Techno",
    "Ambient",
    "Trip-Hop",
    "Vocal",
    "Jazz+Funk",
    "Fusion",
    "Trance",
    "Classical",
    "Instrumental",
    "Acid",
    "House",
    "Game",
    "Sound Clip",
    "Gospel",
    "Noise",
    "Alternative Rock",
    "Bass",
    "Soul",
    "Punk",
    "Space",
    "Meditative",
    "Instrumental Pop",
    "Instrumental Rock",
    "Ethnic",
    "Gothic",
    "Darkwave",
    "Techno-Industrial",
    "Electronic",
    "Pop-Folk",
    "Eurodance",
    "Dream",
    "Southern Rock",
    "Comedy",
    "Cult",
    "Gangsta",
    "Top 40",
    "Christian Rap",
    "Pop/Funk",
    "Jungle",
    "Native American",
    "Cabaret",
    "New Wave",
    "Psychedelic",
    "Rave",
    "Showtunes",
    "Trailer",
    "Lo-Fi",
    "Tribal",
    "Acid Punk",
    "Acid Jazz",
    "Polka",
    "Retro",
    "Musical",
    "Rock & Roll",
    "Hard Rock",
    "Folk",
    "Folk/Rock",
    "National Folk",
    "Swing",
    "Fusion",
    "Bebop",
    "Latin",
    "Revival",
    "Celtic",
    "Bluegrass",
    "Avantgarde",
    "Gothic Rock",
    "Progressive Rock",
    "Psychedelic Rock",
    "Symphonic Rock",
    "Slow Rock",
    "Big Band",
    "Chorus",
    "Easy Listening",
    "Acoustic",
    "Humour",
    "Speech",
    "Chanson",
    "Opera",
    "Chamber Music",
    "Sonata",
    "Symphony",
    "Booty Bass",
    "Primus", // Because they really deserve their own genre
    "Porn Groove",
    "Satire",
    "Slow Jam",
    "Club",
    "Tango",
    "Samba",
    "Folklore",
    "Ballad",
    "Power Ballad",
    "Rhythmic Soul",
    "Freestyle",
    "Duet",
    "Punk Rock",
    "Drum Solo",
    "A Cappella",
    "Euro-House",
    "Dance Hall",
    "Goa",
    "Drum & Bass",
    "Club-House",
    "Hardcore",
    "Terror",
    "Indie",
    "BritPop",
    "Negerpunk",
    "Polsk Punk",
    "Beat",
    "Christian Gangsta Rap",
    "Heavy Metal",
    "Black Metal",
    "Crossover",
    "Contemporary Christian",
    "Christian Rock",
    "Merengue",
    "Salsa",
    "Thrash Metal",
    "Anime",
    "Jpop",
    "Synthpop"
];

// DivX video genres (INDEXES MATTER)
const videoGenres = [
    "Action",
    "Action/Adventure",
    "Adult",
    "Adventure",
    "Catastrophe",
    "Child's",
    "Claymation",
    "Comedy",
    "Concert",
    "Documentary",
    "Drama",
    "Eastern",
    "Entertaining",
    "Erotic",
    "Extremal Sport",
    "Fantasy",
    "Fashion",
    "Historical",
    "Horror",
    "Horror/Mystic",
    "Humor",
    "Indian",
    "Infomercial",
    "Melodrama",
    "Military & War",
    "Music Video",
    "Musical",
    "Mystery",
    "Nature",
    "Political Satire",
    "Popular Science",
    "Psychological Thriller",
    "Religion",
    "Science Fiction",
    "Scifi Action",
    "Slapstick",
    "Splatter",
    "Sports",
    "Thriller",
    "Western"
];


const stringToByte = (text: string, allowParenthesis: boolean): number => {
    if (allowParenthesis) {
        const trimRegex = /^\(+|\)+$/g;
        text = text.replace(trimRegex, "");
    }
    const index = parseInt(text, 10);
    return Number.isNaN(index) ? 255 : index;
}

export default {
    /**
     * Gets the genre index for a specified audio genre.
     * @param name Name of the genre to lookup
     * @returns number Index of the genre in the audio array or 255 if it could not be found.
     */
    audioToIndex: (name: string): number => {
        const index = audioGenres.indexOf(name);
        return index < 0 ? 255 : index;
    },

    /**
     * Gets the audio genre name for a specified index.
     * @param index Index of the genre in the audio genre array. Can be a {@link Number},
     *     {@link string} or {@link string} wrapped in `( )`, if `allowParenthesis` is set
     *     to `true`
     * @param allowParenthesis Whether or not a number wrapped in parenthesis is allowed
     * @returns string Genre name if found, or `undefined` if `index` is outside the
     *     bounds of the audio genre array or if `index` is not valid.
     */
    indexToAudio: (index: number|string, allowParenthesis: boolean): string => {
        const safeIndex = typeof(index) === "string"
            ? stringToByte(index, allowParenthesis)
            : index;
        return Number.isSafeInteger(safeIndex) && safeIndex < audioGenres.length && safeIndex >= 0
            ? audioGenres[safeIndex]
            : undefined;
    },

    /**
     * Gets the video genre name for a specified index.
     * @param index Index of the genre in the video genre array. Can be a {@link Number},
     *     {@link string} or {@link string} wrapped in `( )` if `allowParenthesis` is set
     *     to `true`
     * @param allowParenthesis Whether or not a number wrapped in parenthesis is allowed
     * @returns string Genre name if found, or `undefined` if `index` is outside the
     *     bounds of the video genre array or if `index` is not valid.
     */
    indexToVideo: (index: number|string, allowParenthesis: boolean): string => {
        const safeIndex = typeof(index) === "string"
            ? stringToByte(index, allowParenthesis)
            : index;
        return Number.isSafeInteger(safeIndex) && safeIndex < videoGenres.length && safeIndex >= 0
            ? videoGenres[safeIndex]
            : undefined;
    },

    /**
     * Gets the genre index for a specified video genre.
     * @param name Name of the genre to lookup
     * @returns number Index of the genre in the video array or 255 if it could not be found.
     */
    videoToIndex: (name: string): number => {
        const index = videoGenres.indexOf(name);
        return index < 0 ? 255 : index;
    }
};
