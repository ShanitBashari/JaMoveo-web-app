export const host = "http://localhost:5000";

export const registerAdmin = `${host}/api/user/registerAdmin`;
export const registerPlayer = `${host}/api/user/registerPlayer`;
export const login = `${host}/api/user/login`;
export const session = `${host}/api/user/session`;

// A function to generate the search URL dynamically .
export const searchSongs = (searchQuery) => `${host}/api/song/songs?search=${encodeURIComponent(searchQuery)}`;