const express = require('express')
const db = require('./models/configDB')
const route = require('./routers/index.routers')
const app = express()


require('dotenv').config()
const port = process.env.PORT

//handle formdata
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

db.connectDB()

app.get('/',(req,res)=>{
    res.send('done')
})

route(app)

app.listen(port, () => {
    console.log(`ON PORT: ${port}`)
})
