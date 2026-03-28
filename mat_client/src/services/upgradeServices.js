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
    axios.post('/api/upgrade',{
        userId: upgradeUser.userId,
        cityName: upgradeUser.cityName,
        reason:upgradeUser.reason,
        status: upgradeUser.status || 'pending',
        createdAt: upgradeUser.createdAt || new Date()
    }).then(res=>{
        console.log(res)
    }).catch(error=>{
        console.log(error)
    })
}

const updateUpgrade = async(upgradeUser)=>{
    axios.put('/api/upgrade',{
        userId: upgradeUser.userId,
        cityName: upgradeUser.cityName,
        reason:upgradeUser.reason
    }).then(res=>{
        console.log(res)
    }).catch(error=>{
        console.log(error)
    })
}

const deleteUpgrade = async(userId)=>{
    axios.delete('/api/upgrade',{
        data:{userId:userId}
    }).then(res=>{
        console.log(res)
    }).catch(error=>
        console.log(error)
    )
}

export default {
    getUpgrade:getUpgrade,
    getIdUpgrade:getIdUpgrade,
    addUpgrade:addUpgrade,
    updateUpgrade:updateUpgrade,
    deleteUpgrade:deleteUpgrade
}