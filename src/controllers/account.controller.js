
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
  const user = new Account({
    accountEmail: req.body.accountEmail,
    accountPassword: bcrypt.hashSync(req.body.accountPassword, 8),
    phone: req.body.phone,
    address: req.body.address,
    gender: req.body.gender,
    DOB: req.body.DOB,
    //roleID: req.body.roleID
  })

  user.save((err, user) => {
    if (err) {
      return res.status(500).send({
        errorCode: 500,
        message: err
      })
    }

    if (req.body.roleName) {
      Role.findOne({
        roleName: req.body.roleName
      }, (err, roles) => {
        if (err) {
          return res.status(500).send({
            errorCode: 500,
            message: err
          })
        }
        user.roleID = roles._id
        user.save(err => {
          if (err) {
            return res.status(500).send({
              errorCode: 500,
              message: err
            })
          }
          res.send({
            errorCode: 0,
            message: `${roles.roleName} was registered successfully`
          })
        })
      })
    }
    else {
      Role.findOne({ roleName: 'staff' }, (err, role) => {
        if (err) {
          return res.status(500).send({
            errorCode: 500,
            message: err
          })
        }
        user.roleID = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({
              errorCode: 500,
              message: err
            })
            return
          }
          res.send({
            errorCode: 0,
            message: "Staff was registered successfully!"
          });
        });
      });
    }
  });
}


exports.signin = async (req, res, next) => {
  try {
    const { accountEmail, accountPassword } = req.body;
    if (!(accountEmail && accountPassword)) {
      res.status(500).json({
        errorCode: 500,
        message: "All input is required",
      });
    }
    const user = await Account.findOne({ accountEmail: accountEmail });
    if (!user) {
      res.status(404).json({
        errorCode: "404",
        message: "User not found ~~~",
      });
    }

    if (bcrypt.compareSync(accountPassword, user.accountPassword)) {
      const token = jwt.sign({ id: user._id }, process.env.TOKEN_KEY, {
        expiresIn: process.env.tokenLife,
      });
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN_KEY,
        {
          expiresIn: process.env.refreshTokenLife,
        }
      );
      const role = await Role.findById(user.roleID).then((response) => {
        console.log("response", response);
        return response.roleName;
      });
      return res.status(200).json({
        errorCode: 0,
        token: token,
        role: role,
        refreshToken: refreshToken
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
};

exports.updatePassword = async (req, res, next) => {
  try {
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
    //const { id } = req.params
    const id = req.accountID
    console.log(id)
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

exports.listAccount = async (req, res) => {
  let perPage = 5
  let page = req.params.page || 1
  Account.find({ deleted: { $ne: true } })
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(async (err, list) => {
      if (err) return res.status(500).send({
        errorCode: 0,
        message: err
      })
      var listShow = []
      for (i = 0; i < list.length; i++) {
        var role = await Role.findById({ _id: list[i].roleID })
        if (!role)
          return res.status(500).send({
            errorCode: 0,
            message: 'invalid role'
          })
        var listInfo = {
          _id: list[i]._id,
          accountEmail: list[i].accountEmail,
          phone: list[i].phone,
          address: list[i].address,
          DOB: list[i].DOB,
          gender: list[i].gender,
          roleName: role.roleName
        }
        listShow.push(listInfo)
      }
      Account.countDocuments({ deleted: false }, (err, count) => {
        if (err) return res.status(500).send({
          errorCode: 500,
          message: err
        })
        return res.status(200).send({
          errorCode: 0,
          data: listShow,
          current: page,
          pages: Math.ceil(count / perPage)
        })
      })

    })
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
  let perPage = 5
  let page = req.params.page || 1
  Account.find({ deleted: true })
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(async (err, listDelete) => {
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
      Account.countDocuments({ deleted: true }, (err, count) => {
        if (err) return res.status(500).send({
          errorCode: 500,
          message: err
        })
        return res.status(200).send({
          errorCode: 0,
          data: listDeleteShow,
          current: page,
          pages: Math.ceil(count / perPage)
        })
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
    if (!user) return res.status(400).send("invalid link or expired");

    const token = await ResetPassword.findOne({
      accountID: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send("Invalid link or expired");

    user.accountPassword = bcrypt.hashSync(req.body.accountPassword, 8)
    await user.save();
    await token.delete();
    res.send("password reset sucessfully.");
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
}

exports.searchUser = async (req,res) =>{
  console.log(req.query)
  // var name_search = req.query.email // lấy giá trị của key name trong query parameters gửi lên
  // console.log(name_search)
  // if(name_search){
  //   await Account.find({accountEmail : name_search}, (err,user)=>{
  //     if(err) return res.status(400).send({message: err})
  //     return res.status(200).send({data: user})
  //   })
  // }

  //   return res.status(200).send('loi roi')
  // }
	// var result = users.filter( (user) => {
	// 	// tìm kiếm chuỗi name_search trong user name. 
	// 	// Lưu ý: Chuyển tên về cùng in thường hoặc cùng in hoa để không phân biệt hoa, thường khi tìm kiếm
	// 	return user.name.toLowerCase().indexOf(name_search.toLowerCase()) !== -1
	// })

	// res.render('users/index', {
	// 	users: result // render lại trang users/index với biến users bây giờ chỉ bao gồm các kết quả phù hợp
	// })
}
