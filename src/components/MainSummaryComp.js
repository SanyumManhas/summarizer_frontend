import { useContext, useEffect, useState } from "react";
import LengthSelector from "./LengthSelector";
import {toast} from 'react-toastify';
import axios from "axios";
import { UserContext } from "../App";

export default function MainSummaryComp(){       
    const [words, setwords] = useState(0);
    const {fetchRecents} = useContext(UserContext);

    const getInitialArticle = ()=>{
        const savedArticle = localStorage.getItem('articleContent');
        return savedArticle || '';
    }

    const getInitialSummary = ()=>{
        const savedSummary = JSON.parse(localStorage.getItem('summaryOBJ'));
        if(savedSummary){
            console.log(savedSummary);
            setwords(savedSummary.length)
            if(savedSummary.type === "bulleted form"){
                console.log("running bulleted form formatting script...")
                
                const points = savedSummary?.summary;
                
                const formattedpoints = points.map((point,_)=>`• ${point}`).join(`\n`);

                return savedSummary.title + '\n\n' + formattedpoints;
            }
            else{
                return savedSummary.title + '\n\n' + savedSummary.summary;
            } 
        }
        else{
            return ""
        }
    }

    const [mode, setmode] = useState(true);
    const [article,setarticle] = useState(getInitialArticle);
    const [level,setlevel] = useState(1);
    const [summary,setsummary] = useState(getInitialSummary);
    const [loading,setloading] = useState(false);
    const {userdata} = useContext(UserContext);

    //summarize the article
    const handleArticle = async()=>{
        try{
            if(!(article.length <= 50)){
                setloading(true)
                const articleData = {
                    article,
                    type:mode,
                    level
                }
                const getSummary = await axios.post(`${process.env.REACT_APP_API_URL}/summarize`, articleData);
                if(getSummary.status === 200){
                    toast.success("Article Summarized");
                    
                    //saving to localstorage
                    localStorage.setItem('summaryOBJ', JSON.stringify({...getSummary.data.response, article: article}));

                    //formatting in bulleted list.
                    if(getSummary.data.response.type === "bulleted form"){
                        console.log("running bulleted form formatting script...")
                        setsummary(()=>{
                            const points = getSummary.data.response.summary;
                            
                            const formattedpoints = points.map((point,_)=>`• ${point}`).join(`\n`);

                            return getSummary.data.response.title + '\n\n' + formattedpoints;
                        })
                    }
                    else{
                        setsummary(getSummary.data.response.title + '\n\n' + getSummary.data.response.summary);
                    } 
                    setwords(getSummary.data.response.length);
                }
                else{
                    toast.info(getSummary.data.msg)
                }
            }
            else{
                toast.info("Article seems too short...")
            }
        }
        catch(e){
            console.log(e);
        }
        finally{
            setloading(false);
        }
    }

    const handlesave = async()=>{
        try{
            let summaryjson = JSON.parse(localStorage.getItem('summaryOBJ'));
            let summarysection = summaryjson.summary;
            if(summarysection.length > 0){
                summarysection = summarysection.toString();
                summaryjson.summary = summarysection;
                console.log(summaryjson.summary);
            }
            if(summaryjson){
                const saveDoc = await axios.post(`${process.env.REACT_APP_API_URL}/savesummary`, {response : summaryjson},{withCredentials: true});
                if(saveDoc.data.success){
                    toast.success("Summary Saved.");
                    fetchRecents(userdata._id);
                }
                else{
                    toast.warn("Problem while saving..Please Retry.")
                }
            }
            else{
                toast.info("There's nothing to save...")
            }
        }
        catch(e){
            if(e.response){
                toast.warn("Please login to save summary...");
            }
            else {
                console.error(e.message);
            }
        }
    };

    const calcRatio = ()=>{
        const ratio = Number.parseInt(Number.parseInt(article.length)/Number.parseInt(words)) || 0;
        return ratio;
    }


    const clearContent = ()=>{
        setmode(true);
        localStorage.removeItem('summaryOBJ');
        localStorage.removeItem('articleContent');
        setarticle(getInitialArticle);
        setsummary(getInitialSummary);
        setlevel(1);
        setwords(0);
    }

    useEffect(() => {
        localStorage.setItem('articleContent', article);
    }, [article]);


    return(
        <div className="relative h-[130vh] w-full bg-gray-900">
            <div className="w-3/4 h-[80vh] mb-6 bg-white/10 backdrop-blur-none absolute bottom-0 left-[12.5%] flex h-fit flex-col gap-x-1 mx-auto mt-10 rounded-2xl p-6" style={{boxShadow: '0px 0px 5px 2px grey'}}>
                <div className="flex flex-row justify-between mb-4">
                    <div className="flex text-white gap-x-2">
                        <p className="text-gray-400">mode:</p>
                        <button className={`pb-1 border-b-2 transition-all duration-300 ${
                            mode ? "border-red-500" : "border-transparent"
                        }`} onClick={(e)=>setmode(true)}>paragraph</button>
                        <button className={`pb-1 border-b-2 transition-all duration-300 ${
                            !mode ? "border-red-500" : "border-transparent"
                        }`} onClick={(e)=>setmode(false)}>bulleted list</button>
                    </div>
                    <div className="flex gap-x-1">
                        <LengthSelector Level={level} setLevel = {setlevel}/>
                        <span className="cursor-pointer text-gray-900 hover:text-white transition delay-100 duration-300" onClick={handlesave}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25" />
                            </svg>
                        </span>
                        <span className="cursor-pointer text-gray-900 hover:text-white transition delay-100 duration-300 " onClick={clearContent}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>

                        </span>
                    </div>
                </div>
                <div className="flex flex-row w-full gap-x-1">
                    <div className="flex flex-col w-1/2">
                        <textarea
                            rows="15"
                            type="text"
                            placeholder="Write your article here..."
                            className="bg-black/50 w-full text-white placeholder-white px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e)=>setarticle(e.target.value)}
                            value={article}
                        />
                    </div>
                    <div className="flex flex-col w-1/2">
                        {!loading?<textarea
                            readOnly={true}
                            rows="15"
                            type="text"
                            placeholder="Ai generated summary..."
                            className="bg-black/50 w-full text-white placeholder-white px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={summary}
                        />: <div role="status text-center">
                            <svg class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                            <span class="sr-only">Loading...</span>
                        </div>}
                    </div>
                </div>
                <div className="w-full flex flex-row-reverse">
                    <div className="w-1/2 flex flex-row justify-between mt-2">
                        <p className="py-2 px-4 text-gray-300 text-sm bg-gray-700 rounded-full">• {words} words</p>
                        <p className="py-2 px-4 text-gray-300 text-sm bg-gray-700 rounded-full">• compressionRatio - {calcRatio()}</p>
                        <button onClick={handleArticle} className='flex bg-transparent hover:bg-white/50 hover:text-black text-white font-bold py-2 px-2 rounded border text-xs'>
                            Generate 
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                            </svg>
                        </button>
                    </div>
                    <div className="w-1/2 flex flex-row justify-between mt-2">
                        <p className="py-2 px-4 text-gray-300 text-sm bg-gray-700 rounded-full">• {article.length} words</p>
                    </div>
                </div>
            </div>
        </div>
    )
}