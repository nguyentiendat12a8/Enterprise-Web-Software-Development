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

app.listen(port, () => {
    console.log(`ON PORT: ${port}`)
})
