const express = require('express')
const db = require('../src/db/configDB')
const route = require('./routers/index.router')
const app = express()


require('dotenv').config()
const port = process.env.PORT

//handle formdata
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

const cors = require('cors')
app.use(cors())

db.connectDB()

app.get('/',(req,res)=>{
    res.send('done')
})

route(app)

var fs = require('fs')
const AdmZip = require('adm-zip')

app.get('/download-zip', (req,res)=>{
    var uploadDir = fs.readdirSync(__dirname+"/uploads")
    const zip = new AdmZip()
    for(var i = 0; i < uploadDir.length;i++){
        zip.addLocalFile(__dirname+"/uploads/"+uploadDir[i]);
    }
    //file name
    const downloadName = `Document.zip`

    const data = zip.toBuffer()
    res.setHeader('Content-Type','application/octet-stream');
    res.setHeader('Content-Disposition',`attachment; filename=${downloadName}`);
    //res.set('Content-Length',data.length);
    res.send(data);
})

app.listen(port, () => {
    console.log(`ON PORT: ${port}`)
})
