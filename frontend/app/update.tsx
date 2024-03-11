"use client"

import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import "./addentry/addform.css"


interface Entry {
  name: string;
  email: string;
  phoneNumber: string;
  hobbies: string;
  id:string;
}

interface MyComponentProps {
  name: string; 
  email: string;
  phoneNumber: string;
  hobbies: string;
  id:string;
  setRows: React.Dispatch<React.SetStateAction<Entry[]>>;
  setShowUpdateForm: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
}




const UpdateForm: React.FC<MyComponentProps> = (props) => {


const [username, setUsername] = useState(props.name);
const [useremail, setUseremail] = useState(props.email);
const [userphoneNumber, setUserphoneNumber] =useState(props.phoneNumber);
const [userhobbies,setUserhobbies] = useState(props.hobbies);
const [userid,setUserid] = useState(props.id);

    const updateHandler = async(e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        
        try {
         const {data} = await axios.post("http://localhost:5000/api/v1/task/updateEntry", 
          { 
            username,
            useremail,
            userphoneNumber,
            userhobbies,
            userid,
          }
          ,{
           headers:{
             "Content-Type": "application/json",
          },
             
          }

  
          );


         toast.success("updated",{duration:5000});
         console.log("done");
         const response = await axios.get("http://localhost:5000/api/v1/task/getAllEntry", {
          withCredentials: true,
        });
         props.setRows(response.data.entries);
         props.setShowUpdateForm(prevState => ({ ...prevState, [props.id]: false }))
        //  setDone(true);
       }
        catch (error:any) {
           toast.error("can't update",{duration:5000});
          //  setIsAuthenticatedReception(false);
        }
     
};



  return (
    <div className="update-form">
      <h2 style={{textAlign:'center',color:'white', fontFamily: 'Helvetica Neue'}}>Update Entry</h2>
      <form onSubmit={updateHandler} className="form-container">
        <input type="text" name="name" value={username} className="form-input" onChange={(e)=>{setUsername(e.target.value)} } /> <br />
        <input type="email" name="email" value={useremail} className="form-input" onChange={(e)=>{setUseremail(e.target.value)} } /> <br />
        <input type="text" name="phoneNumber" value={userphoneNumber} className="form-input" onChange={(e)=>{setUserphoneNumber(e.target.value)} } /> <br />
        <input type="text" name="hobbies" value={userhobbies} className="form-input" onChange={(e)=>{setUserhobbies(e.target.value)} }/> <br />
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default UpdateForm;
