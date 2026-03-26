import axios from 'axios'

// 조회
const getArticle = async () => {
    const res = await axios.get('/api/article')
    return res.data
}

// 입력 (이미지 + 데이터 같이)
const addArticle = async (article, images) => {

    const formData = new FormData()

    // 스키마 필드들 //image배열은 axios를 쓸 수 없어서 이렇게 코딩함
    formData.append('no', article.no)
    formData.append('userId', article.userId)
    formData.append('cityName', article.cityName)
    formData.append('title', article.title)
    formData.append('subject', article.subject)
    formData.append('region', article.region)
    formData.append('matName', article.matName)
    formData.append('matTel', article.matTel)

    // 이미지 배열 (multer array('images') 대응)
    if (images) {
        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i])
        }
    }

    axios.post('/api/article', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(res => {
        console.log(res)
    }).catch(error => {
        console.log(error)
    })
}


// 수정 (이미지 추가 포함)
const updateArticle = async (id, article, images) => {

    const formData = new FormData()

    formData.append('userId', article.userId)
    formData.append('cityName', article.cityName)
    formData.append('title', article.title)
    formData.append('subject', article.subject)
    formData.append('region', article.region)
    formData.append('matName', article.matName)
    formData.append('matTel', article.matTel)

    if (images) {
        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i])
        }
    }

    axios.put(`/api/article/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(res => {
        console.log(res)
    }).catch(error => {
        console.log(error)
    })
}


// 삭제
const deleteArticle = async (id) => {
    axios.delete(`/api/article/${id}`)
    .then(res => {
        console.log(res)
    }).catch(error => {
        console.log(error)
    })
}


// 이미지 하나 삭제
const deleteImage = async (id, fileName) => {
    axios.delete(`/api/article/${id}/image`, {
        data: { fileName }
    })
    .then(res => {
        console.log(res)
    }).catch(error => {
        console.log(error)
    })
}


export default {
    getArticle:getArticle,
    addArticle:addArticle,
    updateArticle:updateArticle,
    deleteArticle:deleteArticle,
    deleteImage:deleteImage
}