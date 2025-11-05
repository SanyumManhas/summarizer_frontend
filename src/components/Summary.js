import {useContext, useEffect, useState } from "react";
import CardNav from "./NavBar";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../App";

export default function Summary(){
    const [searchParams] = useSearchParams();
    const id = searchParams.get("summaryId");
    const [article,setarticle] = useState("Article can be viewed here...");
    const [summary,setsummary] = useState("Summary Appears here...");
    const {items} = useContext(UserContext);

    const fetchSummary = async()=>{
        try{
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/getsummary?summaryid=${id}`,{withCredentials: true});
            if(response.data.success){
                console.log("found summary")
                setarticle(response.data.content.article)
                setsummary(response.data.content)
            }
            else{
                toast.warn("Some issue occured check server logs...")
            }
        }   
        catch(e){
            console.log(e.message);
        }
    }

    useEffect(()=>{
      if(id){
        fetchSummary()
      }
    },[id]);


    return(
        <div>
            <div className="h-[100vh] w-full bg-gray-900">
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
                <div className="w-full h-[150vh] bg-gray-900 flex items-center justify-center gap-x-4 border px-4">
                    <div className="h-2/3 w-2/4 items-center gap-y-4 border rounded bg-white p-3 overflow-scroll">
                        <div className="w-full border-b-2 border-black">
                            <h1>Article</h1>
                        </div>
                        <div className="p-2 text-md">
                            {article}
                        </div>
                    </div>
                    <div className="h-2/3 w-1/2 items-center gap-y-4 border rounded bg-white p-3  overflow-scroll">
                        <div className="w-full border-b-2 border-black">
                            <h1>Summary</h1>
                        </div>
                        <div className="p-2 text-md">
                            <h2 className="font-semibold">{summary.title}</h2><br/>
                            {summary.summary}
                        </div>
                    </div>

                </div>
            </div>
            
        </div>
    )
}