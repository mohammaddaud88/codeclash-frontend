import axios from 'axios';

const API_URL = "http://localhost:8080/api/auth/room";

export const getAllRooms = async () => {
    const res = await axios.get(`${API_URL}/getallroom`);
    return res.data;
};

export const getRoomByCode = async (roomCode) => {
    const res = await axios.get(`${API_URL}/getroom/${roomCode}`);
    return res.data;
};