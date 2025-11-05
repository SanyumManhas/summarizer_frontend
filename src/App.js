import Links from './components/Links';
import {ToastContainer} from 'react-toastify';
import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

const UserContext = createContext();

function App() {
   const [userdata, setuserdata] = useState(null);
   const [items,setitems] = useState([]);

   const fetchRecents = async(id)=>{
      try{
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/getrsummaries?userid=${id}`, {withCredentials: true});
        
        if(response.data.success){
          const parseditems = response.data.summaries.map(ele=>{
            const date = new Date(ele.timeStamp);
            return {
              label: ele.title,
              bgColor: "#0D0716",
              textColor: "#fff",
              links: [
                { label: "go to summary", ariaLabel: "go to summary" }
              ],
              length: ele.length,
              type:ele.type,
              timeStamp: date.toLocaleString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }).replace(",", ""),
              id: ele._id
            }
          })
          console.log("Setting items...")
          setitems(parseditems);

        }
      }
      catch(e){
        console.log(e);
      }
    }


   useEffect(()=>{
    const localuser = JSON.parse(localStorage.getItem('udata'));
    if(localuser){
      setuserdata(localuser);
      fetchRecents(localuser._id)
    }
   },[])

  return (
    <UserContext.Provider value={{userdata, setuserdata, items, setitems, fetchRecents}}>
      <div>
        <Links/>
        <ToastContainer theme="colored"/>
      </div>
    </UserContext.Provider>
  );
}

export default App;
export {UserContext}
