const mongoose = require('mongoose')
const { Role } = require('./role.schema')

exports.connectDB = async () =>{
    try {
        await mongoose.connect('mongodb+srv://nguyentiendat12a8:sofm27112000@cluster0.qaz2s.mongodb.net/universityProject', {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true,
            autoIndex:true
        })
        console.log("Connect to database successfully!")
        initial()
    } catch (error) {
        console.log("Connect to database failed!")
    }
}

function initial(){
    Role.estimatedDocumentCount((err,count) =>{
        if(!err && count === 0){
            new Role({name: 'staff'})
            .save(err =>{
                if(err) {
                    console.log('error: ', err)
                }
                console.log('added Staff to role colection')
            })
            new Role({name: 'QA'})
            .save(err =>{
                if(err) {
                    console.log('error: ', err)
                }
                console.log('added QA to role colection')
            })
            new Role({name: 'QA of IT'})
            .save(err =>{
                if(err) {
                    console.log('error: ', err)
                }
                console.log('added QA of IT to role colection')
            })
            new Role({name: 'QA of business'})
            .save(err =>{
                if(err) {
                    console.log('error: ', err)
                }
                console.log('added QA of business to role colection')
            })
            new Role({name: 'QA of graphic design'})
            .save(err =>{
                if(err) {
                    console.log('error: ', err)
                }
                console.log('added QA of graphic design to role colection')
            })
            new Role({name: 'admin'})
            .save(err =>{
                if(err) {
                    console.log('error: ', err)
                }
                console.log('added admin to role colection')
            })
        }
    })
}

