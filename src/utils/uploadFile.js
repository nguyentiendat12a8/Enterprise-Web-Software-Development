const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        let ext = path.extname(file.originalname)
        cb(null, Date.now() + ext)
    }
})

exports.upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        if (
            file.mimetype == "application/pdf" ||
            file.mimetype == "application/msword"
        ) {
            callback(null, true)
        } else {
            callback(null, false)
            console.log('only doc/pdf file supported!')
        }
    },
})

