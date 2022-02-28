
const db = require('../models/index')
const Account = db.account
const Role = db.role
const ROLES = db.ROLES
var jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.signup = async (req, res) => {
  const user = new Account({
    accountEmail: req.body.accountEmail,
    accountPassword: bcrypt.hashSync(req.body.accountPassword, 8),
    phone: req.body.phone,
    //avatar: req.file.path
  })

  user.save((err, user) => {
    if (err) {
      return res.status(500).send({
        errorCode: 500,
        message: err
      })
    }

    if (req.body.roleID) {
      Role.find({
        roleName: { $in: req.body.roleID }
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
          expiresIn: process.env.RefreshTokenLife,
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
        message: "Invalid Credentials, password",
      })
    }
  } catch (err) {
    return console.log(err);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    //const { id } = req.params
    const id = req.body.id
    const user = await Account.findOne({ _id: id })
    const password = req.body.accountPassword
    const newAccountPassword = bcrypt.hashSync(req.body.newAccountPassword, 8)
    if (bcrypt.compareSync(password, user.accountPassword)) {
      await Account.findByIdAndUpdate({ _id: id }, { accountPassword: newAccountPassword }, { new: true })
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
  const id = req.userId
  Account.findById({ _id: id }).then(accInfo => {
    const acc = {
      avatar: accInfo.avatar,
    } 
    return res.status(200).send({
      errorCode: 0,
      acc
    })
  })
    .catch(err =>{
      return res.status(500).send({
        errorCode: '500',
        message: err
      })
    })

}

exports.updateAccount = async (req, res, next) => {
  try {
    //const { id } = req.params
    const id = req.body.id
    console.log(id)
    const avatar = req.file.path
    await Account.findByIdAndUpdate({ _id: id }, { avatar: avatar,phone:phone }, { new: true })
    return res.status(200).send({ message: 'Change info successfully!' })
  } catch (error) {
    console.log(error)
  }
}



exports.deleteAccount = async (req, res, next) => {
  try {
    const id = req.params.id
    Account.deleteOne({_id: id})
    .then(()=>{
      return res.status(200).send({
        errorCode: 0,
        message: 'Delete account successfully!'
      })
    })
  }
  catch(err){
    
  }
}


