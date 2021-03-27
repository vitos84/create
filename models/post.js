const mongoose=require('mongoose');
const Schema= mongoose.Schema;


const schema=new Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    url:{
        type:String
    },
    status:{
        type:String,
        enum:['published','draft'],
        required:true,
        default:'published'
    },
    comentCount:{
        type:Number,
        default:0
    }
},
{
    timestamps:true
}
);

schema.statics={
    incComentCount(postId){
        return this.findByIdAndUpdate(
            postId,
            {$inc:{comentCount:1}},
            {new:true}
        )
    }
};



schema.set('toJson',{virtual:true});
module.exports=mongoose.model('Post',schema);