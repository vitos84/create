const express = require('express');
const bcrypt=require('bcryptjs');
const models = require('../models');
const session = require('express-session');
const router = express.Router();



// POST is authorized
router.post('/registr', (req, res) => {
  console.log(req.body);
  const login = req.body.login;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;

  if(!login || !password || !passwordConfirm){
    const fields=[];
    if(!login) fields.push('login');
    if(!password) fields.push('password');
    if(!passwordConfirm) fields.push('passwordConfirm');
    res.json({
      ok: false,
      error:'не все поля заполнены',
      fields
    }); 
  }else if (!/^[a-zA-Z0-9]+$/.test(login)) {
    res.json({
      ok: false,
      error: 'Только латинские буквы и цифры!',
      fields: ['login']
    });
  }else if(login.length <3 || login.length>16){
    res.json({
      ok:false,
      error:'логин должен содержать от 3 до 16 символов',
      fields:['login']
    });
  }else if(password.length <5){
    res.json({
      ok:false,
      error:'мимальная длина пароля 5 символов',
      fields:['password']
    });
  }else if(password!==passwordConfirm){
    res.json({
      ok:false,
      error:'пароли не совпадают',
      fields:['password','passwordConfirm']
    });
  }else(
    bcrypt.hash(password, 8, function(err, hash) {
      models.User.create({
        login,
        password:hash
      })
      .then(user=>{
        req.session.UserId=user.id;
        req.session.UserLogin=user.login;
        res.json({
          ok:true,
          messege:'регистрация прошла успешно'
        });
        console.log(user);
      })
      .catch(
        err=>{
         if(err.code==11000){
           res.json({
             ok:false,
            error:'логин занят',
            fields:['login']
           })}
           else(
             res.json({
              ok:false,
              error:'ошибка попробуйте позже'
             })
           )
         }
      )
    })
  )
});
//Post in login
router.post('/login',(req,res)=>{
  console.log(req.body);
  const login = req.body.login;
  const password = req.body.password;

  if(!login || !password ){
    const fields=[];
    if(!login) fields.push('login');
    if(!password) fields.push('password');
    res.json({
      ok: false,
      error:'не все поля заполнены',
      fields
    }); 
  }else if (!/^[a-zA-Z0-9]+$/.test(login)) {
    res.json({
      ok: false,
      error: 'Только латинские буквы и цифры!',
      fields: ['login']
    });
  }else if(login.length <3 || login.length>16){
    res.json({
      ok:false,
      error:'логин должен содержать от 3 до 16 символов',
      fields:['login']
    });
  }else if(password.length <5){
    res.json({
      ok:false,
      error:'мимальная длина пароля 5 символов',
      fields:['password']
    });
  }else{
    models.User.findOne({
      login
    }).then(user=>{
      if(!user){
        res.json({
          ok:false,
          error:'логин и пароль не верны',
          fields:['login','password']
        })
      }else{
        bcrypt.compare(password, user.password, (err, result)=> {
           if(!result){
            res.json({
              ok:false,
              error:'логин и пароль не верны',
              fields:['login','password']
            }) 
           }else{
            req.session.UserId=user.id;
            req.session.UserLogin=user.login;
            res.json({
              ok:true,
              messege:'отлично'
            });
           }
      });
      }
    })
    .catch(err=>{
      console.log(err);
      res.json({
        ok: false,
        error:'ошибка попробуйте позже'
      })
    })
  }
});
//get in logout
router.get('/logout',(req,res)=>{
  if(session){
  req.session.destroy(()=>{
    res.redirect('/');
  }) }else{
    res.redirect('/');
  }
});
module.exports = router;