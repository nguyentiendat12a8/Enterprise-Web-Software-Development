
const db = require('../models/index')
const Account = db.account
const Role = db.role
const ResetPassword = db.resetPassword
var jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const sendEmail = require("../utils/mailer");
const crypto = require("crypto");
const Joi = require("joi");

exports.signup = async (req, res) => {
  try {
 
    //////////////////////////////////////
    const roleName = req.body.roleName
    if (!roleName) {
      return res.status(400).send({
        errorCode: 400,
        message: 'Choose the right role!'
      })
    }
    const role = await Role.findOne({ roleName: roleName })
    const user = new Account({
      accountEmail: req.body.accountEmail,
      accountPassword: bcrypt.hashSync(req.body.accountPassword, 8),
      phone: req.body.phone,
      address: req.body.address,
      gender: req.body.gender,
      DOB: req.body.DOB,
      roleID: role._id
    })
    user.save((err) =>{
      if (err) return res.status(500).send({
        errorCode: 500,
        message: err
      })
      return res.status(200).send({
        errorCode: 0,
        message: 'add account successfully!'
      })
    })
  } catch (error) {
    console.log(error)
  }
}

exports.listRole = async (req, res) => {
  Role.find({}, (err, list) => {
    if (err) return res.status(500).send({
      errorCode: 500,
      message: err
    })
    var show = []
    list.forEach(e => {
      var role = {
        roleName: e.roleName
      }
      show.push(role)
    })
    return res.status(200).send({
      errorCode: 0,
      data: show
    })
  })
}

exports.signin = async (req, res, next) => {
  try {
    const schema = Joi.object({ 
      accountEmail : Joi.string().trim().min(5).email(),
      accountPassword : Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'))
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send({
      errorCode: 400,
      message: error.details[0].message
    });
    ////////////////
    const { accountEmail, accountPassword } = req.body;
    if (!(accountEmail && accountPassword)) {
      res.status(500).json({
        errorCode: 500,
        message: "All input is required",
      });
    }
    const user = await Account.findOne({ accountEmail: accountEmail });
    if (!user) {
      return res.status(404).json({
        errorCode: "404",
        message: "User not found ~~~",
      });
    }

    if (bcrypt.compareSync(accountPassword, user.accountPassword)) {
      const token = jwt.sign({ id: user._id, email: user.accountEmail }, process.env.TOKEN_KEY, {
        expiresIn: process.env.tokenLife,
      });
      
      const role = await Role.findById(user.roleID).then((response) => {
        console.log("response", response);
        return response.roleName;
      });
      return res.status(200).json({
        errorCode: 0,
        token: token,
        role: role,
        email: user.accountEmail
      });
    } else {
      return res.status(400).json({
        errorCode: 400,
        message: "Invalid password",
      })
    }
  } catch (err) {
    return console.log(err);
  }
}

exports.updatePassword = async (req, res, next) => {
  try {
    const schema = Joi.object({ 
      accountPassword : Joi.string().trim().required(),
      newAccountPassword : Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')),
      newAccountPasswordAgain : Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send({
      errorCode: 400,
      message: error.details[0].message
    });
    /////////////////
    //const { id } = req.params
    const id = req.accountID
    const user = await Account.findOne({ _id: id })
    const password = req.body.accountPassword
    const newAccountPassword = req.body.newAccountPassword
    const newAccountPasswordAgain = req.body.newAccountPasswordAgain
    if (newAccountPassword !== newAccountPasswordAgain) {
      return res.status(400).send({
        errorCode: 400,
        message: 'New password invalid'
      })
    }
    if (bcrypt.compareSync(password, user.accountPassword)) {
      await Account.findByIdAndUpdate({ _id: id }, { accountPassword: bcrypt.hashSync(newAccountPassword) }, { new: true })
      return res.status(200).send({ message: 'Change password successfully!' })
    }
    else {
      return res.status(400).send({
        errorCode: 400,
        message: 'Wrong password!'
      })
    }
  } catch (error) {
    console.log(error)
  }
}

exports.editAccount = async (req, res, next) => {
  const id = req.accountID
  if (!id) return res.status(400).send({
    errorCode: '401',
    message: 'Unauthentication'
  })
  Account.findById({ _id: id }).then(accInfo => {
    const acc = {
      phone: accInfo.phone,
      address: accInfo.address,
      gender: accInfo.gender,
      DOB: accInfo.DOB
    }
    return res.status(200).send({
      errorCode: 0,
      acc
    })
  })
    .catch(err => {
      return res.status(500).send({
        errorCode: '500',
        message: err
      })
    })

}

exports.updateAccount = async (req, res, next) => {
  try {
    const schema = Joi.object({ 
      phone : Joi.string().pattern(new RegExp('(09|03|07|08|05)+([0-9]{8})')),
      address : Joi.string().min(10).trim(),
      gender  : Joi.array().items(Joi.string().valid('male', 'female')),
      DOB : Joi.string().pattern(new RegExp('^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$'))
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send({
      errorCode: 400,
      message: error.details[0].message
    });
  //////////////
    //const { id } = req.params
    const id = req.accountID
    const phone = req.body.phone
    const address = req.body.address
    const gender = req.body.gender
    const DOB = req.body.DOB
    await Account.findByIdAndUpdate({ _id: id }, {
      phone, address, gender, DOB
    }, { new: true })
    return res.status(200).send({ message: 'Change info successfully!' })
  } catch (error) {
    console.log(error)
  }
}

// exports.deleteAccount = async (req, res, next) => {
//   try {
//     const id = req.params.id
//     Account.deleteOne({_id: id})
//     .then(()=>{
//       return res.status(200).send({
//         errorCode: 0,
//         message: 'Delete account successfully!'
//       })
//     })
//   }
//   catch(err){

//   }
// }

exports.listAccount = (req, res) => {
  try {
    Account.find({},async (err, list) => {
      if (err) return res.status(500).send({
        errorCode: 500,
        message: err
      })
      var listShow = []
      for(i = 0; i<list.length; i++){
        var role = await Role.findById(list[i].roleID)
        if(role === null) res.status(500).send({
              errorCode: 500,
              message: 'sai o day'
            })
        var show = {
          _id: list[i]._id,
          accountEmail: list[i].accountEmail,
          phone: list[i].phone,
          address: list[i].address,
          DOB: list[i].DOB,
          gender: list[i].gender,
          roleName: role.roleName
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
  // Account.find({ deleted: false }, (err, list) => {
  //   if (err) return res.status(500).send({
  //     errorCode: 500,
  //     message: err
  //   })
  //   var listShow = []
  //   list.forEach(async e=>{
  //     const role = await Role.findById(e.roleID)
  //     if(!role) return res.status(500).send({
  //         errorCode: 500,
  //         message: 'Bill tour is error'
  //     })

  //     var listInfo = {
  //       _id: e._id,
  //       accountEmail: e.accountEmail,
  //       phone: e.phone,
  //       address: e.address,
  //       DOB: e.DOB,
  //       gender: e.gender,
  //       roleName: role.roleName
  //     }
  //     listShow.push(listInfo)
  //   })
  //   return res.status(200).send({
  //     errorCode: 0,
  //     data: list,
  //   })
  // })
}

exports.deleteUserAccount = async (req, res) => {
  const account = await Account.findByIdAndUpdate(req.params.accountID, { deleted: true }, { new: true })
  if (!account) {
    return res.status(500).send({
      errorCode: '500',
      message: 'user not found'
    })
  }
  return res.status(200).send({
    errorCode: 0,
    message: 'Delete account successfully!'
  })
}

exports.trashUserAccount = (req, res) => {
  Account.find({ deleted: true }, async (err, listDelete) => {
    if (err) return res.status(500).send({
      errorCode: 0,
      message: err
    })
    var listDeleteShow = []
    for (i = 0; i < listDelete.length; i++) {
      var role = await Role.findById({ _id: listDelete[i].roleID })
      if (!role)
        return res.status(500).send({
          errorCode: 500,
          message: 'invalid role'
        })
      var listInfo = {
        _id: listDelete[i]._id,
        accountEmail: listDelete[i].accountEmail,
        phone: listDelete[i].phone,
        address: listDelete[i].address,
        DOB: listDelete[i].DOB,
        gender: listDelete[i].gender,
        roleName: role.roleName
      }
      listDeleteShow.push(listInfo)
    }
    if (err) return res.status(500).send({
      errorCode: 500,
      message: err
    })
    return res.status(200).send({
      errorCode: 0,
      data: listDeleteShow,
    })
  })


}

exports.restoreUserAccount = (req, res) => {
  Account.findByIdAndUpdate(req.params.accountID, { deleted: false }, { new: true }, (err) => {
    if (err) return res.status(500).send({
      errorCode: 500,
      message: err
    })
    return res.status(200).send({
      errorCode: 0,
      message: 'Restore account successfully!'
    })
  })
}

exports.forceDeleteUserAccount = async (req, res) => {
  const accountDelete = await Account.findOne({ _id: req.params.accountID, deleted: true })
  if (!accountDelete) return res.status(500).send({
    errorCode: 500,
    message: 'delete function invalid or account server is error'
  })
  await accountDelete.deleteOne()
  return res.status(200).send({
    errorCode: 0,
    message: 'Force delete account successfully!'
  })
}


exports.sendEmailResetPass = async (req, res) => {
  try {

    //code validate
    const schema = Joi.object({ accountEmail: Joi.string().email().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send({
      errorCode: 400,
      message: error.details[0].message
    });

    const user = await Account.findOne({ accountEmail: req.body.accountEmail });
    if (!user)
      return res.status(400).send("user with given email doesn't exist");

    let token = await ResetPassword.findOne({ accountID: user._id });
    if (!token) {
      token = await new ResetPassword({
        accountID: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const link = `localhost:${process.env.BASE_URL}/user/confirmLink/${user._id}/${token.token}`;
    await sendEmail(user.accountEmail, "Password reset", link);

    res.send("password reset link sent to your email account");
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
}


exports.confirmLink = async (req, res) => {
  try {
    const schema = Joi.object({ accountPassword: Joi.string().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send({
      errorCode: 400,
      message: error.details[0].message
    })

    const user = await Account.findById(req.params.accountID);
    if (!user) return res.status(400).send("invalid link or expired 1 ");

    const token = await ResetPassword.findOne({
      accountID: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send("Invalid link or expired 2 ");

    user.accountPassword = bcrypt.hashSync(req.body.accountPassword, 8)
    await user.save();
    await token.delete();
    res.send("password reset sucessfully.");
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
}
