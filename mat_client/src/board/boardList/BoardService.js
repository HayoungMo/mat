import axios from 'axios';

const API_URL = '/api/freeboard';

const BoardService = {
    // [R] 목록 조회
    getMatList: async (keyword = "") => {
        const res = await axios.get(API_URL, { params: { keyword } });
        return res.data;
    },

    // [R] 상세 조회 (조회수 증가)
    getDetail: async (id) => {
        const res = await axios.get(`${API_URL}/${id}`);
        return res.data;
    },

    // [C] 등록
    addMat: async (formData) => {
        return await axios.post(API_URL, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    // [U] 수정
    updateMat: async (id, formData) => {
        return await axios.put(`${API_URL}/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    // [D] 삭제
    deleteMat: async (id) => {
        return await axios.delete(`${API_URL}/${id}`);
    },

    // [U] 북마크 토글
    updateBookmark: async (id) => {
        return await axios.patch(`${API_URL}/${id}/bookmark`);
    },

    // [U] 투표
    updateVote: async (id, index) => {
        return await axios.patch(`${API_URL}/${id}/vote`, { index });
    }
};

export default BoardService;