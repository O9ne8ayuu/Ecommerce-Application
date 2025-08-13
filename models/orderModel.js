import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    products:[
    {
        productId:{ type:mongoose.ObjectId,
        ref: "Product",
        required: true},
        name: String,
        price: Number,
        qty: Number,
    },
],
payment:{
    type:Object,
    required: true,
},
buyer:{
    type: mongoose.ObjectId,
    ref:"Users",
    required:true,
},
deliveryAddress: {
        type: String,
        required: true
    },
status:{
    type:String,
    default: 'Not Process',
    enum:["Not Process", "Processing", "Shipped", "Delivered", "Cancel"],
},

}, {timestamps:true});



export default mongoose.model("Order", orderSchema);