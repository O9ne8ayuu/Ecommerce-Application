import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    slug:{
        type:String,
        lowercase:true,
        unique:true,
        trim: true,
    },
    type: {
      type: [String],
      default: [],
},

}, {timestamps:true}
);



export default mongoose.model("Category", categorySchema);