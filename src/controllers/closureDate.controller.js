const db = require('../models/index')
const ClosureDate = db.closureDate
const Department = db.department
const Joi = require("joi");

exports.createClousureDate = async (req, res) => {
    try {
        const schema = Joi.object({ 
            departmentName: Joi.string(),
            firstClosureDate: Joi.string().pattern(new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})")).message("Incorrect date format, Ex : 30/03/2022"),
            finalClosureDate : Joi.string().pattern(new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})")).message("Incorrect date format, Ex : 30/03/2022"),
          })
            const { error } = schema.validate(req.body);
            if (error) return res.status(400).send({
              errorCode: 400,
              message: error.message
            });
            /////
        //10-2-2020
        if(new Date(req.body.firstClosureDate) > new Date(req.body.finalClosureDate)){
            return res.status(400).send({
                errorCode: 400,
                message: 'Final date must more than first date!'
            })
        }
        const department = await Department.findOne({ departmentName: req.body.departmentName })
        if(!department) {
            return res.status(500).send({
                errorCode: '500',
                message: 'department not found!'
            })
        }
        const id = department._id
        const closureDate = new ClosureDate({
            firstClosureDate: req.body.firstClosureDate,
            finalClosureDate: req.body.finalClosureDate,
            departmentID: id
        })
        closureDate.save(err => {
            if (err) return res.status(500).send({
                errorCode: '500',
                message: 'add closure date fail!'
            })
            return res.status(200).send({
                errorCode: 0,
                message: 'add closure date successfully!'
            })
        })
    }
    catch (err) {
        console.log(err)
    }
}

exports.listClosureDate = (req, res) => {
    try {
        ClosureDate.find({},async (err, listClosureDate) => {
            if (err) return res.status(500).send({
                errorCode: 500,
                message: err
            })
            var listShow = []
            for(i=0; i< listClosureDate.length; i++){
                var departmentID = listClosureDate[i].departmentID
                var department = await Department.findOne({ _id: departmentID })
                var show = {
                    _id: listClosureDate[i]._id,
                    firstClosureDate: listClosureDate[i].firstClosureDate,
                    finalClosureDate: listClosureDate[i].finalClosureDate,
                    departmentName: department.departmentName
                }
                listShow.push(show)
            }
                
            return res.status(200).send({
                errorCode: 0,
                data: listShow
            })
        })
    } catch (error) {
        console.log(error)
    }
}

exports.editClosureDate = (req,res) =>{
    ClosureDate.findById(req.params.closureDateID, (err, date) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        const show = {
            _id: req.params.closureDateID,
            firstClosureDate: date.firstClosureDate,
            finalClosureDate: date.finalClosureDate
        }
        return res.status(200).send({
            errorCode: 0,
            data: show
        })
    })
}

exports.updateClosureDate = (req,res) =>{
    try {
        const schema = Joi.object({ 
            firstClosureDate: Joi.string().pattern(new RegExp("([0-9]{4}[-||/](0[1-9]|1[0-2])[-||/]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-||/](0[1-9]|1[0-2])[-||/][0-9]{4})")).message("Incorrect date format, Ex : 30/03/2022"),
            finalClosureDate : Joi.string().pattern(new RegExp("([0-9]{4}[-||/](0[1-9]|1[0-2])[-||/]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-||/](0[1-9]|1[0-2])[-||/][0-9]{4})")).message("Incorrect date format, Ex : 30/03/2022"),
          });
            const { error } = schema.validate(req.body);
            if (error) return res.status(400).send({
              errorCode: 400,
              message: error.message
            });

        ClosureDate.findByIdAndUpdate(req.params.closureDateID, {
            firstClosureDate: req.body.firstClosureDate,
            finalClosureDate: req.body.finalClosureDate
        }, {new: true}, (err) => {
            if (err) return res.status(500).send({
                errorCode: 500,
                message: err
            })
            return res.status(200).send({
                errorCode: 0,
                message: 'Update closure date successfully!'
            })
        })
    } catch (error) {
        console.log(error)
    }
}
