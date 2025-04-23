import {io} from 'socket.io-client';

const socket = io('https://ja-moveo-web-app.vercel.app');

export default socket;