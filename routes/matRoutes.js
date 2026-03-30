const mongoose = require('mongoose')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

const Article = mongoose.model('articles')


// uploads 폴더 생성
try {
  fs.readdirSync('uploads')
} catch (e) {
  fs.mkdirSync('uploads')
}

// multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  limits: { files: 10 }
})

module.exports = (app) => {

  
  // 1. 전체 조회

  // 3월 25일 모하영 수정: 총합검색을 위해서 한번에 묶고 mongodb는 $or로 묶는다. or은 배웠던 그대로 이중 하나라도 참이면 참을 출력해준다
  app.get('/api/article', async(req,res) => {
    const {keyword} = req.query;
  
    if (keyword){
      const list = await Article.find({
        $or: [
          {title:{$regex: keyword, $options: 'i'}},
          {subject:{$regex: keyword, $options: 'i'}},
          {userId:{$regex: keyword, $options: 'i'}},
        ]
      }).sort({no: -1});
      res.send(list);
    }else{
      const list = await Article.find().sort({ no: -1});
      res.send(list);
    }
  });

  // 1-1 cityhome 아티클을 위한 기능
  app.get('/api/article/:id',async (req,res)=>{
    try{
      const {id} = req.params

      const article = await Article.findById(id)

      if (!article){
        return res.status(404).send({message: '데이터는 죽었다 다음은 너다...'})
      }

      res.send(article)
    }catch(err){
      console.error(err)
      res.status(500).send({message: '서버도 죽었다 다음은 너다...'})
    }
  })

  // 2. 글 작성 + 이미지 업로드
  app.post('/api/article', upload.array('images', 10), async (req, res) => {
    try {
      const files = req.files || []

      const imageList = files.map(file => ({
        saveFileName: file.filename,
        originalFileName: encoding(file.originalname)
      }))

      const last = await Article.findOne().sort({no:-1})
      const newNo = last ? last.no + 1 : 1

      const article = await Article.create({
        ...req.body,
        no:newNo,
        images: imageList
      })

      res.send({ success: true, article })

    } catch (err) {
      console.error(err)
    }
  })


  // 3. 글 수정 (이미지 추가)
  app.put('/api/article/:id', upload.array('images', 10), async (req, res) => {
    try {
      const { id } = req.params
      const files = req.files || []

      const article = await Article.findById(id)
    
      let images = article.images || []

      const deletedImages = req.body.deletedImages
      ? JSON.parse(req.body.deletedImages)
      : []

      images = images.filter(
        img => !deletedImages.includes(img.saveFileName)
      )

      if (req.files.length >0){
        const newImages = files.map(file => ({
        saveFileName: file.filename,
        originalFileName: encoding(file.originalname)
        }))

        images = [...images, ...newImages]
      }

      const updated = await Article.findByIdAndUpdate(
        id,
        {
          ...req.body,
          images: images
        },
        { new: true }
      )

      res.send({ success: true, updated })

    } catch (err) {
      console.error(err)
    }
  })

  // 4. 특정 이미지 삭제
  app.delete('/api/article/:id/image', async (req, res) => {
    try {
      const { id } = req.params
      const { fileName } = req.body

      const article = await Article.findById(id)

      article.images = article.images.filter(
        img => img.saveFileName !== fileName
      )

      await article.save()

      const filePath = `uploads/${fileName}`
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }

      res.send({ success: true })

    } catch (err) {
      console.error(err)
    }
  })

  //  5. 글 삭제 (이미지 포함)
  app.delete('/api/article/:id', async (req, res) => {
    try {
      const { id } = req.params

      const article = await Article.findById(id)

      // 파일 삭제
      article.images.forEach(img => {
        const filePath = `uploads/${img.saveFileName}`
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
      })

      await Article.findByIdAndDelete(id)

      res.send({ success: true })

    } catch (err) {
      console.error(err)
      
    }
  })
}

// 한글 깨짐 방지
function encoding(fileName) {
  return Buffer.from(fileName, 'latin1').toString('utf-8')
}