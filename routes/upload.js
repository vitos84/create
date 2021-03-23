const express=require('express');

const router=express.Router();
const multer=require('multer');
const path=require('path');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null,Date.now()+path.extname(file.originalname))}
    })
  
  var upload = multer({
      storage,
      limits:{fileSize: 1*1024*1024},
      fileFilter:function(req,file,cb){
          const ext=path.extname(file.originalname);
        if(ext!=='.png'&& ext!=='.jpeg' && ext!=='.jpg'){
            const err=new Error('EXTENTION');
            err.code='EXTENTION';
           return cb(err);
        } 
        cb(null,true); 
      }
  }).single('file');

router.post('/image',(req,res)=>{
    upload(req,res,err=>{
        let error='';
        if(err){
            if(err.code==='EXTENTION'){
                error='Только jpeg png jpg';
            }
            if(err.code==='LIMIT_FILE_SIZE'){
                error = 'Картинка не более 1mb!';
            }
            res.json({
                ok:!error,
                error
            });
        }
    })
});

module.exports = router;