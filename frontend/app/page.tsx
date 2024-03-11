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
  // const [idd , setIdd]  = useState<AxiosRequestConfig<string>>(" "); 
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
    
    // Iterate through each row
    rows.forEach(entry => {
      // Check if the entry's id exists in checkedEntries and is set to true
      if (checkedEntries[entry.id]) {
        updatedChecked.push(entry); // Add the entry to the updatedChecked array
      }
    });

    console.log("updatechecked", updatedChecked);
    // Update the checked state with the updatedChecked array
    
    setChecked(prevChecked => updatedChecked);

    
  };
 
  useEffect(() => {
    renderRowsAndUpdateChecked();
    // console.log("checked",checked);

  }, [rows,checkedEntries]);
  
  console.log("checked",checked);




  // const [idd, setIdd] = useState<string>();


  const deleteHandler = async(idToDelete: string) =>{
   
    
    try {
     const {data} = await axios.post("http://localhost:5000/api/v1/task/deleteEntry",{idd:idToDelete});
    
    // return <Navigate to={"/"}/>;

      // console.log(response.headers);

     

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
      //  setIsAuthenticatedReception(false);
    }
 
};


//for update part//





  useEffect(() => {
      
    axios.get("http://localhost:5000/api/v1/task/getAllEntry",{
      withCredentials:true,
    })
    .then(res=>{
      // setUser(res.data.user);
      console.log(res.data.entries);
     
      setRows(res.data.entries);
    // console.log(user)
    // setIsAuthenticatedReception(true);
    // setIsAuthenticated(false);
    // setLoading(false);
    
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

    // const res = await axios.get("http://localhost:5000/api/v1/task/getAllEntry", {
    //   withCredentials: true,
    // });
    // setRows(res.data.entries);

    setCheckedEntries({});
    window.location.reload();
    setDone(true);
  } catch (error:any) {
    // Handle error
    setLoader(false);
    console.error("Error sending entries via email:", error);
    toast.error(error.response.data.message, { duration: 5000 });
  }
};





// if(done){
//   console.log("ha ah ayaa hai ");
//   router.replace("/");
//   setDone(false);
// }
  
  return (
    <>
    
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <button
        className="view-prescription-button"
        id="view-prescription"
        disabled={loader}
        onClick={sendEntries}
        style={{
          borderRadius: '5px',
          backgroundColor: loader ? '#CCCCCC' : '#4CAF50', // Change background color when loader is true
          border: 'transparent'
        }}  
        >Send</button>

      <button className="view-prescription-button"
      id="view-prescription" ><Link href="/addentry"> Add </Link></button>
      
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
                className="view-prescription-button"
                id="view-prescription"  
                
                onClick={() => setShowUpdateForm(prevState => ({ ...prevState, [entry.id]: true }))}
            >
               
                Update 
            </button>
            <button
                className="view-prescription-button"
                id="view-prescription"  
                
                onClick={() => {
                  
                  // setIdd(entry.id);
                  // console.log(entry.id);
                  deleteHandler(entry.id);
                }}
                >

                {/* <FaEye /> */}
                Delete 
            </button>
            <input type="checkbox" 
            className="checkbox"
            // checked = {checkedEntries[entry.id]}
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
