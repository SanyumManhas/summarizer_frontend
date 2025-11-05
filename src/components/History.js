import { useContext, useEffect, useState } from "react";
import CardNav from "./NavBar";
import { UserContext } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function History(){
    const [list,setlist] = useState([]);
    const {userdata} = useContext(UserContext);
    const {items} = useContext(UserContext);

    const fetchSummaries = async()=>{
      try{
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/getsummaries?userid=${userdata._id}`, {withCredentials: true});
        console.log(response);
        if(response.data.success){
            setlist(response.data.summaries);
        }
        else{
            toast.info("Problem occured while fetching summaries...")
        }
      }
      catch(e){
        console.log(e);
      }
    }

    const deleteSummary = async(summaryId)=>{
        try{
            const delfeedback = await axios.get(`${process.env.REACT_APP_API_URL}/delsummary?summaryid=${summaryId}`,{withCredentials: true});
            console.log("delete feedback..." + delfeedback.msg)
            if(delfeedback.data.success){
                fetchSummaries();
                toast.success("Deleted Successfully");
            }
            else{
                toast.warn("Couldnt Delete please retry...")
            }
        }
        catch(e){
            console.log(e.message);
        }
    }

    useEffect(()=>{
      if(userdata){
        console.log("Inside useeffect")
        fetchSummaries()
      }
    },[userdata]);


    return(
        <div>
                <CardNav
                logo='./assets/ai_logo.png'
                logoAlt="Company Logo"
                items={items}
                baseColor="#fff"
                menuColor="#000"
                buttonBgColor="#111"
                buttonTextColor="#fff"
                ease="power3.out"
                />
                <div className="w-full h-[150vh] bg-gray-900 flex flex-col justify-center">
                    <div className="h-1/2 w-full flex flex-col items-center gap-y-4">
                        <div className="w-3/4 border-b-2 flex flex-row justify-between">
                            <span className="text-[30px] text-white">Summaries</span>
                            <span className="text-[30px] text-white"><span className="text-[18px] text-gray-400">count: </span>{list.length}</span>
                        </div>
                        {
                            list.map((summary,id)=>
                                <div className="w-3/4 h-1/4 p-2 relative bg-white/20 backdrop-blur-none text-white rounded hover:shadow-lg hover:shadow-white/20 transition-shadow duration-300">
                                    <button onClick={()=>{deleteSummary(summary._id)}} className="w-8 h-8 flex justify-center items-center absolute right-5 top-5 hover:bg-white/20 transition delay-150 duration-300 cursor-pointer rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="red" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </button>
                                    <Link to={`/summary?summaryId=${summary._id}`}>
                                    <p className="text-lg">{summary.title}</p>
                                    <p className="text-sm text-gray-400">{summary.length} words</p>
                                    <p className="text-sm text-gray-400">created On: {new Date(summary.timeStamp).toLocaleString("en-GB", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                        hour: "numeric",
                                        minute: "2-digit",
                                        hour12: true,
                                    }).replace(",", "")}</p>
                                    </Link>
                                </div>
                            )
                        }
                    </div>
                </div>
        </div>
    )
}