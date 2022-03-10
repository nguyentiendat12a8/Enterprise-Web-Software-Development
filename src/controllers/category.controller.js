const db =require('../models/index')
const Category = db.category
const Department = db.department

exports.createCategory = async (req, res) =>{
    try {
        const department = await Department.findOne({departmentName: req.body.departmentName})
        const category = new Category({
            categoryName : req.body.categoryName,
            departmentID: department._id,
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

exports.deleteCategory = (req,res) =>{
    const categoryDelete = req.params.categoryID
    Category.deleteOne({_id: categoryDelete}, (err) =>{
        if(err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        return res.status(200).send({
            errorCode: 0,
            message: 'Delete category successfully!'
        })
    })
}

exports.ListCategory = async (req,res) =>{
    const department = await Department.findOne({departmentName: req.body.departmentName})
    Category.find(({departmentID: department._id}), (err,list) => {
        if(err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        return res.status(200).send({
            errorCode: 0,
            data: list
        })
    })
}


