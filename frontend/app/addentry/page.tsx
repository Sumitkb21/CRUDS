"use client"
import axios from "axios";
import { AxiosError } from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

// import { toast } from "react-toastify";
import "./addform.css"
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
import Home from "../page";

export default function Add(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhonenumber] =useState("");
    const [hobbies, setHobbies] = useState("");
    const [done , setDone] = useState(false);
    const router  = useRouter();
    const submitHandler = async(e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        
        try {
         const {data} = await axios.post("http://localhost:5000/api/v1/task/creatEntry", 
          {
               name, 
               email,
               phoneNumber,
               hobbies,          
          }
          ,{
           headers:{
             "Content-Type": "application/json",
          },
             
          }
  
          )
        
        // return <Navigate to={"/"}/>;

          // console.log(response.headers);
         toast.success("OKKK",{duration:5000});
         console.log("done");
         setDone(true);

       }
        catch (error:any) {
           toast.error("can't submit",{duration:5000});
          //  setIsAuthenticatedReception(false);
        }
     
};
  

if(done){
    router.push("/");
}

  
   return(
    <>
    <h2 style={{textAlign:'center',color:'white', fontFamily: 'Helvetica Neue'}}>Create Entry</h2>
    <form onSubmit={submitHandler}  className="form-container" >
        <input type="text" name="name" value={name} onChange={(e)=>{setName(e.target.value)} } className="form-input" required placeholder="Name" /><br />
        <hr />

        <input type="email" name="email" value={email} onChange={(e)=>{setEmail(e.target.value)} } className="form-input" placeholder="Email"   required /><br />
        <hr />
        <input type="text" name="phoneNumber" value={phoneNumber} onChange={(e)=>{setPhonenumber(e.target.value)} } className="form-input" placeholder="Phone Number" required /><br />
        <hr />
        <input type="text" name="hobbies" value={hobbies} onChange={(e)=>{setHobbies(e.target.value)} } className="form-input" placeholder="Hobbies"   required /><br />
        <hr />
        <button type="submit"  className="submit-button" >Submit</button>
    </form>
    </>
   );
} 