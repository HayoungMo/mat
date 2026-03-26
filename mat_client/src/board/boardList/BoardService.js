import axios from 'axios';

const API_URL = '/api/article'; 

const BoardService = {
    // 목록 조회 (검색어 포함)
    getMatList: async (keyword = "") => {
        const res = await axios.get(`${API_URL}?keyword=${keyword}`);
        return res.data;
    },
    // 등록
    addMat: async (formData) => {
        return await axios.post(API_URL, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    // 수정
    updateMat: async (id, formData) => {
        return await axios.put(`${API_URL}/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    // 삭제
    deleteMat: async (id) => {
        return await axios.delete(`${API_URL}/${id}`);
    }
};

export default BoardService;