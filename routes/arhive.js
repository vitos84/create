
const express = require('express');
const router = express.Router();
const moment=require('moment');
const config = require('../confiq');
const models = require('../models');

moment.locale('ru');  

async function posts(req,res){
  const userId = req.session.UserId;
  const userLogin = req.session.UserLogin;
  const perPage = +config.PER_PAGE;
  const page = req.params.page || 1;
  try {
    const posts= await models.Post.find({})
      .skip(perPage * page - perPage)
      .populate('owner')
      .sort({ createdAt: -1 })
      .limit(perPage);
    const count= await models.Post.estimatedDocumentCount();
    res.render('arhive/index', {
      posts,
      current: page,
      pages: Math.ceil(count / perPage),
      user: {
        id: userId,
        login: userLogin
      }
    });
  } catch (error) {
    throw new Error('Server Error');  
  }
}
//index page
router.get('/',(req,res)=>{
 posts(req,res)
});

//paginachion
router.get('/arhive/:page',(req, res)=> {
    posts(req,res)
});

//post page
router.get('/posts/:post',async(req,res,next)=>{
  const userId = req.session.UserId;
  const userLogin = req.session.UserLogin;
  const url=req.params.post.trim().replace(/ +(?= )/g, '');

  if(!url){
    const err=new Error('Not found');
    err.status=404;
    next(err)
  }else{
    try {
      const post= await models.Post.findOne({url})
      .populate('owner');
      if(!post){
        const err=new Error('Not found');
        err.status=404;
        next(err)
      }else{
      const coments = await models.Coment.find({
        post:post.id,
        parent: { $exists: false }
      }); 
      console.log(post);
        res.render('post/post', {
          post,
          coments,
          moment,
          user: {
            id: userId,
            login: userLogin
          }
        }); 
      }
    } catch (error) {
      throw new Error('Server Error');
    }
 }});
//user posts
router.get('/users/:login/:page*?',async(req,res)=>{
  const userId = req.session.UserId;
  const userLogin = req.session.UserLogin;
  const perPage = +config.PER_PAGE;
  const page = req.params.page || 1;
  const login = req.params.login;
try {
  const user=await models.User.findOne({login});
  const posts=await models.Post.find({owner:user.id})
                    .skip(perPage)
                    .sort({createdAt:-1})
                    .limit(perPage);
  const count=await models.Post.estimatedDocumentCount({owner:user.id}); 
  
  res.render('arhive/user', {
    posts,
    _user:user,
    current: page,
    pages: Math.ceil(count / perPage),
    user: {
      id: userId,
      login: userLogin
    }
  });
} catch (error) {
  throw new Error('Server Error');
}
});
  
module.exports=router;