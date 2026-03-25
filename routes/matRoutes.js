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

  app.get('/api/article', async (req, res) => {
    const list = await Article.find().sort({ no: -1 })
    res.send(list)
  })

  // 2. 글 작성 + 이미지 업로드
  app.post('/api/article', upload.array('images', 10), async (req, res) => {
    try {
      const files = req.files || []

      const imageList = files.map(file => ({
        saveFileName: file.filename,
        originalFileName: encoding(file.originalname)
      }))

      const article = await Article.create({
        ...req.body,
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

      const newImages = files.map(file => ({
        saveFileName: file.filename,
        originalFileName: encoding(file.originalname)
      }))

      const article = await Article.findById(id)

      const updatedImages = [...article.images, ...newImages]

      const updated = await Article.findByIdAndUpdate(
        id,
        {
          ...req.body,
          images: updatedImages
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