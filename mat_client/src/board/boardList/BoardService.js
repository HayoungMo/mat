
import axios from 'axios';

const API_URL = '/api/article'; // matRoutes.js에 정의된 경로

// 1. 목록 조회 (검색어 포함)
const getMatList = async (keyword = "") => {
    const res = await axios.get(`${API_URL}?keyword=${keyword}`);
    return res.data;
};

// 2. 게시글 등록 (이미지 업로드 포함)
const addMat = async (formData) => {
    // 텍스트와 파일을 한 번에 보내기 위해 FormData 사용
    const res = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
};

// 3. 게시글 수정
const updateMat = async (id, formData) => {
    const res = await axios.put(`${API_URL}/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
};

// 4. 게시글 삭제
const deleteMat = async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
};

export default { getMatList, addMat, updateMat, deleteMat };
