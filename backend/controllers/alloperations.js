import { AllEnteries } from "../models/allenteries.js";
import { Enteries } from "../models/entries.js";
import nodemailer from "nodemailer";


export const createEntry = async(req,res)=>{
    
    const {name,email,hobbies,phoneNumber} = req.body;

    const total = await Enteries.countDocuments();
    const id = total + 1;


    const entry = await AllEnteries.create({
        name,
        email,
        hobbies,
        phoneNumber,
        id,
    })

    await Enteries.create({
        name,
        email,
        hobbies,
        phoneNumber,
        id,
    })
    
   if(entry){
    res.status(200).json({
        success:true,
        message:"Entry created",
    })
   }
   else{
    res.status(401).json({
        success:false,
        message: "Entry not created",
    })
   } 
}; 


export const updateEntry = async(req,res)=>{
    try {
        const {username,
            useremail,
            userphoneNumber,
            userhobbies,
            userid} = req.body;
    
        const update = {
            $set: {
               name:username,
               email:useremail,
               hobbies:userhobbies,
               phoneNumber:userphoneNumber,
            }
        };
    
    
        await AllEnteries.findOneAndUpdate(
            {id:userid}, // Filter for finding the document
            update, // Update operation to apply
        );
        res.status(200).json({
            success: true,
            Message: "updated Succesfully",
        })
        
    } catch (error) {
        res.status(401).json({
            success: false,
            Message: "Not able to update",
        })
        
    }
    

     
}; 


export const deleteEntry = async(req,res)=>{
    try {
        const {idd} = req.body;
    
        await AllEnteries.deleteOne({id:idd});

        res.status(200).json({
            success: true,
            Message: "Deleted succesfully",
        })
        
    } catch (error) {
        res.status(401).json({
            success: false,
            Message: "Not able to delete",
        })
        
    }
    

     
}; 

export const getAllEntries = async(req,res) =>{
    try {
        const entries  = await AllEnteries.find();
    
        res.status(200).json({
        success: true,
        message:"send succefully",
        entries,
        });
            
    } catch (error) {
            res.status(401).json({
            success: false,
            message:"Error in getting entries",
            });
            
    }    
  
    };


    
export const sendEntry = async(req,res)=>{
    try{ 

        const  {entries} = req.body;

        if(!entries.length){
            return res.status(401).json({
                success:false,
                message: "Please mark some entries for send",
            })
        }

        const formattedEntries = [];  
        
        
        entries.map(entry => {
            formattedEntries.push(`Name: ${entry.name}, Email: ${entry.email}, Phone Number: ${entry.phoneNumber}, Hobbies: ${entry.hobbies}`);
        });

        console.log(formattedEntries);

         const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
              user: process.env.SMTP_MAIL,
              pass: process.env.SMTP_PASS, 
            },
          });

          const email = "sumitkb21@iitk.ac.in";

          let mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject: "Entries(TASK)",
            text: `Hey buddy !! \nHere are the requested Entries:\n${formattedEntries.map(entry => entry + '\n').join('')}`,
        };
      
          await transporter.sendMail(mailOptions);
            res.status(200).json({
                success:true,
                message:"Enteries send",
            })
   }
   catch (error) {
    res.status(401).json({
        success:false,
        message: "Enteries not send",
    }) 
   }
   
}; 
