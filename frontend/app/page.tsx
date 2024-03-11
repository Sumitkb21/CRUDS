"use client"
import Image from "next/image";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AxiosRequestConfig } from 'axios'
import UpdateForm from "./update";


interface Entry {
  name: string;
  email: string;
  phoneNumber: string;
  hobbies: string;
  id:string;
}




export default function Home(){

  const [rows,setRows]=useState<Entry[]>([]);
  const [done , setDone] = useState(false);
  const [checked,setChecked] = useState<Entry[]>([]);// all enteries which are checked 
  const [loader,setLoader] = useState(false);

  const router = useRouter();
  const [showUpdateForm, setShowUpdateForm] = useState<{ [key: string]: boolean }>({});
  const [checkedEntries, setCheckedEntries] = useState<{ [key: string]: boolean }>({});///all entry's checked bool value

  const handleCheckboxChange = (entryId: string) => {
    setCheckedEntries(prevState => ({
      ...prevState,
      [entryId]: !prevState[entryId] // Toggle the checked status
    }));
  };





  const renderRowsAndUpdateChecked = () => {
    const updatedChecked: Entry[] = [];
    
    rows.forEach(entry => {
      if (checkedEntries[entry.id]) {
        updatedChecked.push(entry); // Add the entry to the updatedChecked array
      }
    });

    console.log("updatechecked", updatedChecked);    
    setChecked(prevChecked => updatedChecked);

    
  };
 
  useEffect(() => {
    renderRowsAndUpdateChecked();

  }, [rows,checkedEntries]);
  
  console.log("checked",checked);

  const deleteHandler = async(idToDelete: string) =>{
   
    
    try {
     const {data} = await axios.post("http://localhost:5000/api/v1/task/deleteEntry",{idd:idToDelete});

     

     toast.success("Deleted Succesfully",{duration:5000});
     console.log("deleted");
     setDone(true);
    const response = await axios.get("http://localhost:5000/api/v1/task/getAllEntry", {
      withCredentials: true,
    });
    setRows(response.data.entries);

   }
    catch (error:any) {
       toast.error("can't delete",{duration:5000});
 
    }
 
};








  useEffect(() => {
      
    axios.get("http://localhost:5000/api/v1/task/getAllEntry",{
      withCredentials:true,
    })
    .then(res=>{
 
      console.log(res.data.entries);
     
      setRows(res.data.entries);
    
  })
  .catch((error)=>{
    console.log(error.response.data.message);
    
  })
  
}, [])



const sendEntries = async () => {
  setLoader(true);
  try {
    const response = await axios.post("http://localhost:5000/api/v1/task/sendEntry", { entries: checked });
    
    console.log("Email sent successfully");
    toast.success(response.data.message, { duration: 5000 });
    setLoader(false);

   
    setCheckedEntries({});
    window.location.reload();
    setDone(true);
  } catch (error:any) {
    setLoader(false);
    console.error("Error sending entries via email:", error);
    toast.error(error.response.data.message, { duration: 5000 });
  }
};

  
  return (
    <>
    
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <button
        className="view-task-button"
        id="view-task"
        disabled={loader}
        onClick={sendEntries}
        style={{
          borderRadius: '5px',
          backgroundColor: loader ? '#CCCCCC' : '#4CAF50', // Change background color when loader is true
          border: 'transparent'
        }}  
        >Send</button>

      <button className="view-task-button"
      id="view-task" ><Link href="/addentry"> Add </Link></button>
      
      <br /><hr />
      <h1 style={{ fontSize: '2rem' }}>All Entries </h1>
      
      {rows.map((entry, index) => {
       
        return (
          <div key={index} className="appointment-box">
            <span>
              <strong>Name:</strong> {entry.name},&nbsp;&nbsp;
              <strong>Email:</strong> {entry.email},&nbsp;&nbsp;
              <strong>Phone Number:</strong> {entry.phoneNumber},&nbsp;&nbsp;
              <strong>hobbies:</strong> {entry.hobbies},&nbsp;&nbsp;
            </span>&nbsp;&nbsp;&nbsp;
            <button
                className="view-task-button"
                id="view-task"  
                
                onClick={() => setShowUpdateForm(prevState => ({ ...prevState, [entry.id]: true }))}
            >
               
                Update 
            </button>
            <button
                className="view-task-button"
                id="view-task"  
                
                onClick={() => {
                  
                
                  deleteHandler(entry.id);
                }}
                >

                {/* <FaEye /> */}
                Delete 
            </button>
            <input type="checkbox" 
            className="checkbox"
            onChange={() => handleCheckboxChange(entry.id)}

            />

            {showUpdateForm[entry.id] && <UpdateForm setShowUpdateForm={setShowUpdateForm} name={entry.name} setRows={setRows} email={entry.email} phoneNumber={entry.phoneNumber} hobbies={entry.hobbies} id={entry.id} />}
            
          </div>
          );
          
        })}
        
  

      
    </main>
    <Toaster/>
    </>
  );
}
