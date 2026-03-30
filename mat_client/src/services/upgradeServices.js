import axios from 'axios';

const getUpgrade = async()=>{
    const res = await axios.get('/api/upgrade')
    return res.data
}

const getIdUpgrade = async()=>{
    const res = await axios.get('/api/upgrade/id')
    return res.data
}

const addUpgrade = async(upgradeUser)=>{

    try{
        const res = await axios.post('/api/upgrade',{
            
            userId: upgradeUser.userId,
            cityName: upgradeUser.cityName,
            reason:upgradeUser.reason,
            status: upgradeUser.status || 'pending',
            createdAt: upgradeUser.createdAt || new Date()
        })

        return res.data

    }catch(error){
        console.log(error)
    }
}

const updateUpgrade = async(upgradeUser)=>{
    
    try{
    const res= await axios.put('/api/upgrade',{
        userId: upgradeUser.userId,
        cityName: upgradeUser.cityName,
        reason:upgradeUser.reason
    })

    return res.data

    }catch(error){
        console.log(error)
    }

}

const deleteUpgrade = async(userId)=>{
    
    try{
        const res= axios.delete('/api/upgrade',{
        data:{userId:userId}
    })

    return res.data

    }catch(error){
    console.log(error)
}
}

export default {
    getUpgrade:getUpgrade,
    getIdUpgrade:getIdUpgrade,
    addUpgrade:addUpgrade,
    updateUpgrade:updateUpgrade,
    deleteUpgrade:deleteUpgrade
}