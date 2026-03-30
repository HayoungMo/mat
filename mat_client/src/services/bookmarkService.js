import axios from 'axios';



export const toggleBookmark = async (userId, place, articleNo) => {

     
     if(articleNo){
        const res = await axios.post('/api/bookmarks/toggleArticle', {
            userId,
            articleNo,
            title: place.title,
            matName: place.matName,
            matTel:  place.matTel,
            matAddr: place.matAddr,
            lat: place.lat,
            lng: place.lng
            
             
        });
        return res.data;
    }
    
    const res = await axios.post('/api/bookmarks/toggle', {
        userId,
        kakaoId: place.id,
        matName: place.place_name,
        matTel:  place.phone,
        matAddr: place.address_name,
        lat:     place.y,
        lng:     place.x
    });

   
    console.log(res);
    return res.data;
};

export const getBookmarks = async (userId) => {
    
    const res = await axios.get(`/api/bookmarks?userId=${userId}`);
    return res.data;
};

export const deleteBookmark = async(id) =>{
    const res = await axios.delete(`/api/bookmarks/${id}`);
    return res.data
}

export const checkBookmark = async (userId, kakaoId) => {
    const res = await axios.get(`/api/bookmarks/check?userId=${userId}&kakaoId=${kakaoId}`);
    return res.data;
};