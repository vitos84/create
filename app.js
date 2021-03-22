const express=require('express');
const app=express();
const bodyParser = require('body-parser');
const path=require('path');
const staticAsset=require('static-asset');
const mongoose = require('mongoose');
const confiq=require('./confiq');
const routes=require('./routes');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


//sets and uses
app.use(
    session({
      secret: confiq.SESSION_SECRET,
      resave: true,
      saveUninitialized: false,
      store: new MongoStore({
        mongooseConnection: mongoose.connection
      })
    })
  );
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(staticAsset(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'public')));
app.use('/javascripts',express.static(path.join(__dirname,'node_modules','jquery','dist')));
app.set("view engine", "ejs");


//database
    mongoose.Promise=global.Promise;
    mongoose.set=('debug',confiq.IS_PRODUCTIONS);

mongoose.connection
    .on('error',error=>console.log(error))
    .on('close',()=>{console.log('database is close!!!')})
    .once('open',()=>{
        const info=mongoose.connections[0];
        console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
       //require('./mocks')();
    });

mongoose.connect(confiq.MONGO_URL, 
    {useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true})

//routes
app.use('/',routes.arhive);
app.use('/api/auth',routes.auth);
app.use('/post',routes.post);
app.use('/coment',routes.coment);


// catch 404 and forward to error handler
app.use((req,res,next)=>{
 const err=new Error('Not found');
 err.status=404;
 next(err)
});
// error handler
//eslint-disable-next-line no-unused-vars 
app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.render('error',{
        message:error.message,
        error:!confiq.IS_PRODUCTIONS ? error : {}
    })
}); 
app.listen(confiq.PORT,()=>{console.log(`server listen on port ${confiq.PORT}!`)})
   


