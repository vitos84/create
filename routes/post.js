const express = require('express');
const models = require('../models');
const router = express.Router();
const TurndownService = require('turndown');


//get for add

router.get('/add',(req,res)=>{
    const userId=req.session.UserId;
    const userLogin=req.session.UserLogin;
   
   if(!userId || ! userLogin){
       res.redirect('/');
   }else{
    res.render('post/add',({
       user:{
           id:userId,
           login:userLogin
       }
    }))}
});

//post add
router.post('/add',async(req,res)=>{
  
    const userId=req.session.UserId;
    const userLogin=req.session.UserLogin;
   
    if(!userId || !userLogin){
        res.redirect('/');
    }else{
    const turndownService = new TurndownService();
   const title=req.body.title.trim().replace(/ +(?= )/g, '');
   const body=req.body.body;
 if(!title || !body){
     const fields=[];
     if(!title)fields.push('title');
     if(!body)fields.push('body');
   res.json({
       ok:false,
       error:'Все поля должны быть заполнены',
       fields:fields
    });  
 }else if(title.length <3 || title.length>64){
     res.json({
         ok:false,
         error:'Длинна заголовка от 3 до 64 символов',
         fields:['title']
     });
 }else if(body.length<3){
     res.json({
         ok:false,
         error:'Длина текста не менее 3 символов',
         fields:['body']
     });
 }else{
     try {
        const post= await models.Post.create({
            title,
            body:turndownService.turndown(body),
            owner:userId
        });
        console.log(post);
        res.json({
            ok:true
        });  
     } catch (error) {
         throw new Error('server error');
     }
    
  }
    
}});
module.exports = router;