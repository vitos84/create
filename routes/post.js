const express = require('express');
const models = require('../models');
const router = express.Router();
const tr=require('transliter');


//post edit
router.get('/edit/:id',async(req,res,next)=>{
    const userId=req.session.UserId;
    const userLogin=req.session.UserLogin;
    const id=req.params.id.trim().replace(/ +(?= )/g, '');
    if(!userId || ! userLogin){
        res.redirect('/');
        }else{
            try {
                const post=await models.Post.findById(id); 
                if(!post){
                    const err=new Error('Not found');
                    err.status=404;
                    next(err);
                }
                res.render('post/edit',({
                    post,
                    user:{
                        id:userId,
                        login:userLogin
                    }
                }));

            } catch (error) {
                console.log(error);
            }
        }
});

//get for add

router.get('/add',(req,res)=>{
    const userId=req.session.UserId;
    const userLogin=req.session.UserLogin;
   
   if(!userId || ! userLogin){
       res.redirect('/');
   }else{
    res.render('post/edit',({
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
   const title=req.body.title.trim().replace(/ +(?= )/g, '');
   const body=req.body.body.trim();
   const isDraft=req.body.isDraft;
   const postId=req.body.postId;
   const url=`${tr.slugify(title)}-${Date.now().toString(36)}`
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
 }else if(postId){
     try {
        const post=await models.Post.findOneAndUpdate({
            _id:postId,
            owner:userId
        },{
            title,
            body,
            url,
            status:!isDraft ? 'published': 'draft'
        },{new:true});
        res.json({
            ok:true,
            post
        });
     } catch (error) {
         console.log(error);
     }
     
 }else{
     try {
        const post= await models.Post.create({
            title,
            body:body,
            owner:userId,
            url,
            status:!isDraft ? 'published': 'draft'
        });
        console.log(post);
        res.json({
            ok:true,
            post
        });  
     } catch (error) {
         throw new Error('server error');
     }
    
  }
    
}});
module.exports = router;