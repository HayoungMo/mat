import axios from 'axios'

const getProfile = async(userId) => {
    const res = await axios.get(`/api/profile/${userId}`) 
    return res.data // 전체 조회
}

//입력
const addProfile = async(user) => {
    axios.post('/api/profile',{
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
const updateProfile = async (user) => {
    try {
        const res = await axios.put('/api/profile', {
           id: user._id,
            password: user.password,
            tel: user.tel,
            email: user.email
        });
        return res.data;
    } catch (err) {
        console.error('수정 오류:', err);
    }
};

//삭제
const deleteProfile = async(id) => {
    axios.delete('/api/profile',{
        data:{id:id} //{data:{key:value}}
    }).then(res => {
        console.log(res)
    }).catch(error => {
        console.log(error)
    })
}

export default { //외부에서 쓰려면 필요하죠.
    getProfile:getProfile,
    addProfile:addProfile,
    updateProfile:updateProfile,
    deleteProfile:deleteProfile
}

