import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import JWT from 'jsonwebtoken';
 
//Register page
 export const registerController = async(req, res) =>{
    try{
        const {name, email, password, phone, address, answer} = req.body;
       //validations
        if(!name || !email || !password || !phone || !address || !answer){
            return res.json({message:'All fields are Required'});
        }
      
        //Check User
     const existinguser = await userModel.findOne({email})
        if(existinguser){
                return res.status(409).json({
                    success:false,
                    message:'Alredy Register Please login',
                });
        };   
        //register user
     const hashedPassword = await  hashPassword(password);

        //save
        const user = await new userModel({
            name,
             email,
             phone,
             address,
             password: hashedPassword,
             answer,
             role: 0,   //default user role
            }).save();

        res.status(201).json({
            success:true,
            message:'User Register Successfully',
            user,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:'Error in Registration',
            error,
        });

    };
 };

 // login
 export const loginController = async(req, res) =>{
    try{
        const {email, password} = req.body;

        //validation
        if(!email || !password){
            return res.status(400).json({ success: false, message: 'Invalid email or password' });

        };
        //check user
        const user = await userModel.findOne({email});
        if(!user) {
            return res.status(404).json({
                success:false,
                message:'Email is not register',
            });
        };
        const match = await comparePassword(password, user.password);
        if(!match) {
            return res.status(401).json({
                success:false,
                message:'Invalid Password',
            });
        };
        //Generate token
        const token =  JWT.sign({_id: user._id },
        process.env.JWT_SECRET, {expiresIn: '7d' }
    );
    res.cookie("token", token,{
         httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

        .json({
            success:true,
            message:'login succesfully',
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                _id:user._id,
            },
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:'Error in login',
            error,
        });

    };
    
 };
 // forgot password
 export const  forgotPasswordController =async (req, res) => {
    try{
        const {email, answer, newPassword} = req.body;
        if(!email || !answer || !newPassword){
            res.status(400).json({message: 'Email, answer, and new password are  required'});
        }
        //check
        const user = await userModel.findOne({email, answer});
        //validation
        if(!user){
            return res.status(404).json({
                success:false,
                message: 'Wrong Email or Answer',
            });
        }
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, {password: hashed});
        res.status(200).json({
            success:true,
            message:'Password  reset Succesfully',
        })
    } catch (error){
        console.log(error)
        res.status(500).json({
            success:false,
            message: 'Something went wrong',
            error,
        });
    };
 };

 //test controller
 export const testController = (req, res) =>{
    try{
        res.send('protected Route');
    } catch (error) {
        console.log(error);
        res.status(500).send({error});
    }
 };

 //update profile
 export const updateProfileController = async(req, res) => {
    try{
        const {name, email, password,address, phone} = req.body;
        const user = await userModel.findById(req.user._id);
        //password
        if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

        if(password && password.length < 6) {
            return res.status(400).json({error:'Password is required and minimum 6 charecter is required for strong password'})
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updateUser = await userModel.findByIdAndUpdate(req.user._id,{
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address,
        }, {new: true }
    ).select('-password -answer');
          res.status(200).json({
        success:true,
        message: "Profile Updateed Succesfully",
        user: updateUser,
    });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success:false, 
            message: 'Error while Update Profile',
            error,
        });
    }
 };
 export const getUserController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select('-password -answer');
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching user', error });
  }
};



 // orders
 export const getOrdersController = async (req,res) => {
    try{
        const orders = await orderModel.find({buyer: req.user._id}).populate("products","-photo").populate("buyer","name");
        res.json(orders);
    }catch (error) {
        console.log(error);
        res.status(500).send ({
            success:false, 
            message: 'Error while Getting Orders',
            error,
        });
    }
 };
 //All Orders For Admin
  export const getAllOrdersController = async (req,res) => {
    try{
        const orders = await orderModel.find({}).populate("products","-photo").populate("buyer","name").sort({createdAt: "-1"});
        res.json(orders);
    }catch (error) {
        console.log(error);
        res.status(500).json({
            success:false, 
            message: 'Error while Getting Orders',
            error,
        });
    }
 };
 
 //Status Order
 export const orderStatusController = async(req, res) => {
    try{
        const {orderId} = req.params;
        const {status} = req.body;
        const orders = await orderModel.findByIdAndUpdate(orderId, {status}, {new:true});
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message: 'Error while Updating Order Status',
            error,
        });
    }
 };

 //  Get All Users - Admin Only
export const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel
      .find({})
      .select("-password -answer"); // Exclude sensitive data

    res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while getting all users",
      error,
    });
  }
};

 
 // ✅ User auth check
export const userAuthController = (req, res) => {
  try {
    res.status(200).send({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(401).send({ ok: false });
  }
};

// ✅ Admin auth check
export const adminAuthController = (req, res) => {
  try {
    if (req.user?.role !== 1) {
      return res.status(403).send({ ok: false });
    }
    res.status(200).send({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(401).send({ ok: false});
}
};
