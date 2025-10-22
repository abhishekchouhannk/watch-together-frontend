import {io} from "socket.io-client";

const SERVER_PORT = process.env.NEXT_PUBLIC_SOCKET_PORT || "4000";

const URL = process.env.NEXT_PUBLIC_SOCKET_URL || `http://localhost:${SERVER_PORT}`;

export const socket = io(URL, { autoConnect: false });