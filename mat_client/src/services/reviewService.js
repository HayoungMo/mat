import axios from 'axios'

//조회

const getReview = async(userId) => {
    const res = await axios.get(`/api/review/${userId}`) 
    return res.data // 전체 조회
}

//입력
const addReview = async(user) => {
    axios.post('/api/review',{
        userId:user.userId,
        content:user.content,
        rating:user.rating
    }).then(res => {
        console.log(res)
    }).catch(error => {
        console.log(error)
    })
}

//수정
const updateReview = async (user,userId) => {
    try {
        const res = await axios.put(`/api/review/${userId}`, {
            id: user.id,
            content: user.content,
            rating: user.rating
        });
        return res.data;
    } catch (err) {
        console.error('수정 오류:', err);
    }
};

//삭제
const deleteReview = async(id) => {
    await axios.delete('/api/review',{
        data:{id:id}
    }).then(res => {
        console.log(res)
    }).catch(error => {
        console.log(error)
    })
}

export default { //외부에서 쓰려면 필요하죠.
    getReview:getReview,
    addReview:addReview,
    updateReview:updateReview,
    deleteReview:deleteReview
}
