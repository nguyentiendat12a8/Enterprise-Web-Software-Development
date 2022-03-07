const db =require('../models/index')
const Category = db.category

exports.createCategory = (req, res) =>{
    try {
        const departmentID = req.body.departmentID 
        const category = new Category({
            categoryName : req.body.categoryName,
            departmentID,
        })
        category.save(err =>{
            if(err){
                return res.status(500).send({
                    errorCode : 500,
                    message: 'save category fail!'
                })
            }
            return res.status(200).send({
                errorCode : 0,
                message: 'save category successfully!'
            })
        })
    }
    catch (err){
        console.log(err)
    }
}

exports.updateCategory = (req,res) =>{
     
}

exports.editCategory = (req,res) =>{
    
}

exports.deleteCategory = (req,res) =>{
    const categoryDelete = req.params.id 
    Category.deleteOne({_id: categoryDelete}, (err) =>{
        if(err) return res.status(500).send({
            errorCode: 500,
            message: 'Category server is error'
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'Delete category successfully!'
        })
    })
}

exports.ListCategory = (req,res) =>{
    const department = req.body.department
    Category.find(({}), (err,list) => {
        if(err) return res.status(500).send({
            errorCode: 500,
            message: 'Category server is error'
        })
        return res.status(200).send({
            errorCode: 0,
            data: list
        })
    })
}


