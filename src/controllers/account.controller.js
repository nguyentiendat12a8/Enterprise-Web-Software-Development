
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
    const schema = Joi.object({
      accountEmail: Joi.string().trim().min(5).email().message("Email must be in the format @gmail.com, Ex: thang1@gmail.com"),
      accountPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).message("Password must have at least 6 characters and maximum 30 characters"),
      phone: Joi.string().pattern(new RegExp('(09|03|07|08|05)+([0-9]{8})')).message("Incorrect phone format, Ex: 0906246555"),
      // address : Joi.string().min(10).trim().message("Incorrect address format"),
      address: Joi.string().min(10).message("Address must be more than 10 characters"),
      gender: Joi.string().valid('male', 'female'),
      DOB: Joi.string().pattern(new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})")).message("Incorrect date format, Ex : 10-10-2000"),
      roleName: Joi.string().required()

    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send({
      errorCode: 400,
      message: error.message
    })
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
    user.save((err) => {
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
      accountEmail: Joi.string().trim().min(5).email().message("Email must be in the format @gmail.com, Ex: thang1@gmail.com"),
      accountPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).message("Password must have at least 6 characters and maximum 30 characters")
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send({
      errorCode: 400,
      message: error.message
    })
    ////////////////
    const { accountEmail, accountPassword } = req.body;
    if (!(accountEmail && accountPassword)) {
      res.status(400).json({
        errorCode: 400,
        message: "All input is required",
      });
    }
    const user = await Account.findOne({ accountEmail: accountEmail, deleted: false });
    if (!user) {
      return res.status(404).json({
        errorCode: "404",
        message: "User not found!",
      });
    }

    if (bcrypt.compareSync(accountPassword, user.accountPassword)) {
      const token = jwt.sign({ id: user._id, email: user.accountEmail }, process.env.TOKEN_KEY, {
        expiresIn: process.env.tokenLife,
      });

      const role = await Role.findById(user.roleID).then((response) => {
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
      accountPassword: Joi.string().required(),
      newAccountPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).message("NewPassword must have at least 6 characters and maximum 30 characters"),
      newAccountPasswordAgain: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).message("NewPasswordAgain must have at least 6 characters and maximum 30 characters"),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send({
      errorCode: 400,
      message: error.message
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
      return res.status(200).send({ 
        errorCode: 0,
        message: 'Change password successfully!' })
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

exports.viewDetailAccount = async (req, res, next) => {
  Account.findById({ _id: req.params.accountID })
    .then(async accInfo => {
      const role = await Role.findById(accInfo.roleID)
      const acc = {
        accountEmail: accInfo.accountEmail,
        phone: accInfo.phone,
        address: accInfo.address,
        gender: accInfo.gender,
        DOB: accInfo.DOB,
        role: role.roleName,
      }
      return res.status(200).send({
        errorCode: 0,
        data: acc
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
      phone: Joi.string().pattern(new RegExp('(09|03|07|08|05)+([0-9]{8})')).message("Incorrect phone format, Ex: 0906246555"),
      address: Joi.string().min(10).message("Address must be more than 10 characters"),
      gender: Joi.string().valid('male', 'female'),
      DOB: Joi.string().pattern(new RegExp("([0-9]{4}[-](0[1-9]|1[0-2])[-]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-](0[1-9]|1[0-2])[-][0-9]{4})")).message("Incorrect date format, Ex : 2000-10-10"),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send({
      errorCode: 400,
      message: error.message
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

exports.listAccount = (req, res) => {
  try {
    Account.find({ deleted: false }, async (err, list) => {
      if (err) return res.status(500).send({
        errorCode: 500,
        message: err
      })
      var listShow = []
      async function getRole(e) {
        var role = await Role.findById(e.roleID)
        if (!role) res.status(500).send({
          errorCode: 500,
          message: 'Role server is error!'
        })
        var show = {
          _id: e._id,
          accountEmail: e.accountEmail,
          phone: e.phone,
          address: e.address,
          DOB: e.DOB,
          gender: e.gender,
          roleName: role.roleName
        }
        return listShow.push(show)
      }
      await Promise.all(list.map(e => getRole(e)))

      return res.status(200).send({
        errorCode: 0,
        data: listShow
      })
    })
  } catch (error) {
    console.log(error)
  }
}

exports.deleteUserAccount = async (req, res) => {
  try {
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
  } catch (error) {
    return res.status(500).send({
      errorCode: '500',
      message: error
    })
  }
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
    const schema = Joi.object({
      accountEmail: Joi.string().trim().min(5).email().message("Email must be in the format @gmail.com, Ex: thang1@gmail.com"),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send({
      errorCode: 400,
      message: error.message
    });
    /////////////////////////

    //code validate
    // const schema = Joi.object({ accountEmail: Joi.string().email().required() });
    // const { error } = schema.validate(req.body);
    // if (error) return res.status(400).send({
    //   errorCode: 400,
    //   message: error.details[0].message
    // });

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

    return res.status(200).send({
      errorCode: 0,
      message: "password reset link sent to your email account"
      })
  } catch (error) {
    return res.status(200).send({
      errorCode: 0,
      message: "send mail error!"
      })
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
