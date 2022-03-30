const db = require('../models/index')
const Category = db.category
const Department = db.department
const Ideas = db.ideas
const Joi = require("joi");

exports.createCategory = async (req, res) => {
    try {
        const department = await Department.findOne({ departmentName: req.query.departmentName })
        if(department === null) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        const category = new Category({
            categoryName: req.body.categoryName,
            departmentID:  department._id,
        })
        category.save(err => {
            if (err) {
                return res.status(500).send({
                    errorCode: 500,
                    message: 'save category fail!'
                })
            }
            return res.status(200).send({
                errorCode: 0,
                message: 'save category successfully!'
            })
        })
    }
    catch (err) {
        console.log(err)
    }
}

exports.deleteCategory = async (req, res) => {
    const categoryDelete = req.params.categoryID
    const used = await Ideas.findOne({ categoryID: categoryDelete })
    if(used === null){
        await Category.deleteOne({ _id: categoryDelete })
        .then(()=>{
            return res.status(200).send({
                errorCode: 0,
                message: 'This category is delete successfully!'
            })
        })
        .catch(err =>{
            return res.status(500).send({
                errorCode: 500,
                message: err
            })
        })
    } else {
        return res.status(400).send({
            errorCode: 400,
            message: 'This category is used'
        })
    }
}

exports.ListCategory = async (req, res) => {
    const department = await Department.findOne({ departmentName: req.query.departmentName })
    Category.find(({ departmentID: department._id }), (err, list) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        return res.status(200).send({
            errorCode: 0,
            data: list
        })
    })
}


