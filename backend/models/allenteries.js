import mongoose from "mongoose";

const schema = new mongoose.Schema({
    id: {
       type: String,
       unique: true,
    },
    name:{
        type: String,
        
    },  
    email: {
        type: String,
        
    },

    phoneNumber: {
        type: String,
        
    },
    hobbies: {
        type: String,
        
    },
    createdAt: {
        type: Date,
        default : Date.now(),
    },
});
 




export const AllEnteries = mongoose.model("allenteries" , schema );
