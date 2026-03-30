import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL
    ? `${process.env.REACT_APP_API_URL}/api/freeboard`
    : 'http://localhost:4000/api/freeboard';

const axiosWithCreds = axios.create({
    withCredentials: true,
});

const BoardService = {
    getMatList: async (keyword = "") => {
        const res = await axiosWithCreds.get(API_URL, {
            params: keyword ? { keyword } : {},
        });
        return res.data;
    },

    getDetail: async (id) => {
        const res = await axiosWithCreds.get(`${API_URL}/${id}`);
        return res.data;
    },

    addMat: async (formData) => {
        return await axiosWithCreds.post(API_URL, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    updateMat: async (id, formData) => {
        return await axiosWithCreds.put(`${API_URL}/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    deleteMat: async (id) => {
        return await axiosWithCreds.delete(`${API_URL}/${id}`);
    },


    updateBookmark: async (id, userId) => {
       
        return await axiosWithCreds.patch(`${API_URL}/${id}/bookmark`, { userId });
    },

    updateVote: async (id, index) => {
        return await axiosWithCreds.patch(`${API_URL}/${id}/vote`, { index });
    },
};

export default BoardService;