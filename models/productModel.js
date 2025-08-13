import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    slug:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type:mongoose.ObjectId,
        ref:'Category',
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
    },
    imageUrl: {
        type:String,
        default: "",
    },
    photos:[{
        data:Buffer,
        contentType:String,
    },
    ],
    shipping:{
        type:Boolean,
        default: false,
    },
    type:{
        type: String,
        required: true,
    },
     stockStatus: {
      type: String,
      enum: ["inStock", "outOfStock"],
      default: "inStock",
    },
    ratings: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    deal: {
  type: Boolean,
  default: false,
},
size:{
    type:[String],
    default:[],
},

},{timestamps:true}
);


export default mongoose.model('Product', productSchema);