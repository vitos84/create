const express = require('express');
const models = require('../models');
const router = express.Router();

router.post('/add',async(req,res)=>{
  
    const userId=req.session.UserId;
    const userLogin=req.session.UserLogin;
   
    if(!userId || !userLogin){
        res.json({
            ok:false
        });
    }else{
      const post=req.body.post;
      const body=req.body.body;
      const parent=req.body.parent;
       
     /* if(!body){
          res.json({
              ok:false,
              error:'пустой коментарий'
          })
      }*/

      try {
       if(!parent){
           await models.Coment.create({
               post,
               body,
               owner:userId
           });
           res.json({
               ok:true,
               body,
               login:userLogin
           });
       }else{
           const parentComent=await models.Coment.findById(parent);
           if(!parentComent){
               res.json({
                   ok:false
               })
           }       
            const coment=await models.Coment.create({
                post,
                body,
                parent,
                owner:userId
            });  

            const children=parentComent.children;
            children.push(coment.id);
            parentComent.children=children;
            await parentComent.save();

            res.json({
                ok:true,
                body,
                login:userLogin
            });
           
       }
      } catch (error) {
        res.json({
            ok:false
        });   
      }
    }
});
module.exports = router;