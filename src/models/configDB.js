const mongoose = require('mongoose')
const { Department } = require('./department.schema')
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
            new Role({roleName: 'staff'})
            .save(err =>{
                if(err) {
                    console.log('error: ', err)
                }
                console.log('added Staff to role colection')
            })
            new Role({roleName: 'QA'})
            .save(err =>{
                if(err) {
                    console.log('error: ', err)
                }
                console.log('added QA to role colection')
            })
            new Role({roleName: 'QA of IT'})
            .save(err =>{
                if(err) {
                    console.log('error: ', err)
                }
                console.log('added QA of IT to role colection')
            })
            new Role({roleName: 'QA of business'})
            .save(err =>{
                if(err) {
                    console.log('error: ', err)
                }
                console.log('added QA of business to role colection')
            })
            new Role({roleName: 'QA of graphic design'})
            .save(err =>{
                if(err) {
                    console.log('error: ', err)
                }
                console.log('added QA of graphic design to role colection')
            })
            new Role({roleName: 'admin'})
            .save(err =>{
                if(err) {
                    console.log('error: ', err)
                }
                console.log('added admin to role colection')
            })
        }
    })
//Department addin 
    Department.estimatedDocumentCount((err, count)=>{
        if(!err && count ==0){
            //department adding
            new Department({departmentName: 'IT'})
            .save(err =>{
                if(err){
                    console.log('err: ', err)
                }
                console.log("added IT to department")
            })
            new Department({departmentName: 'business'})
            .save(err =>{
                if(err){
                    console.log('err: ', err)
                }
                console.log("added business to department")
            })
            new Department({departmentName: 'graphic design'})
            .save(err =>{
                if(err){
                    console.log('err: ', err)
                }
                console.log("added graphic design to department")
            })
        }
    })
}

