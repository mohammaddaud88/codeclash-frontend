import axios from 'axios';

const API_URL = "http://localhost:8080/api";

export const updateUserProfile = async (id, userProfile) => {
    const res = await axios.put(`${API_URL}/updateUserProfile/${id}`, userProfile);
    return res.data;
};