const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null,'uploads/')
    },
    filename: (req, file, cb) =>{
        let ext = path.extname(file.originalname)
        cb(null, Date.now()+ext)
    }
})

exports.upload = multer({
    storage: storage,
    fileFilter: function(req, res, file, callback) {
        if(
            file.mimetype =="application/pdf" ||
            file.mimetype == 'application/msword'
        ){
            callback(null, true)
        }else {
            return res.status(400).send({
                errorCode: 400,
                message: 'only doc/pdf file supported!'
            })
            
            callback(null,false)
        }
    },
})

