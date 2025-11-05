import {useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { encryptPassword } from './encryptionUtils-20250415115254';
import { Link, useNavigate } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";
import { UserContext } from '../App';



export default function Login()
{   
    const {setuserdata} = useContext(UserContext);
    const [em,setem] = useState("");
    const [pass,setpass] = useState("");
    const nav = useNavigate();
    const [showPassword, setshowPassword] = useState(false);
    //API handlers
    const handlelogin = async(e)=>{
        e.preventDefault();
        const {encryptedData,iv} = await encryptPassword(pass);
        
        if(human){
            const loginData = {
                em, //email
                encryptedData,
                iv //encrypted password
            }

            const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, loginData, {withCredentials: true});
            if(response.data.success){
                toast.success("login success");
                setuserdata(response.data.udata);
                localStorage.setItem('udata', JSON.stringify(response.data.udata));
                nav("/home")
            }
            else{
                toast.warn("login failed");
            }
        }
        else{
            toast.warn("Please verify you are human!");
        }
    }
    
    const [human,sethuman] = useState(null);
    
    function onChange(value) {
        sethuman(value);
    }

    return(
        <div className="h-full bg-black">
            <div class="flex min-h-full flex-col items-center justify-center px-6 py-12 lg:px-8">
                <div className="flex min-h-full flex-col justify-center w-full px-8 py-12 lg:px-8 lg:w-1/2 bg-gray-900 border-2 border-gray-500 rounded">
                <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img src="./assets/ai_logo.png" alt="Your Company" class="mx-auto h-20 w-auto" />
                    <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Sign in to your account</h2>
                </div>

                <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handlelogin} class="space-y-6">
                    <div>
                        <label for="email" class="block text-sm/6 font-medium text-gray-100">Email address</label>
                        <div class="mt-2">
                        <input onChange={(e)=>setem(e.target.value)} id="email" type="email" name="email" required autocomplete="email" 
                        class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                        </div>
                    </div>

                    <div>
                        <div class="flex items-center justify-between">
                        <label for="password" class="block text-sm/6 font-medium text-gray-100">Password</label>
                        {/* <div class="text-sm">
                            <a href="#" class="font-semibold text-indigo-400 hover:text-indigo-300">Forgot password?</a>
                        </div> */}
                        </div>
                        <div className="mt-2 relative">
                            <input
                                onChange={(e) => setpass(e.target.value)} id="password" type={showPassword? "text":"password"} name="password" required autoComplete="current-password" className="block w-full rounded-md bg-white/5 px-3 py-1.5 pr-10 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                            />
                            {showPassword? <svg
                                onClick={()=>setshowPassword(false)}
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer">
                                <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                />
                                <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                />
                            </svg>:
                            <svg onClick={()=>setshowPassword(true)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-5 text-gray-400 cursor-pointer">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>}

                            </div>
                        </div>

                    <div class="w-full">
                        <ReCAPTCHA
                            class="w-full"
                            sitekey="6LcSiQMsAAAAAALgFYgxYI3W0V4XC-PKM3U4a_rJ"
                            onChange={onChange}
                        />
                    </div>

                    <div>
                        <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Sign in</button>
                    </div>
                    </form>

                    <p class="mt-10 text-center text-sm/6 text-gray-400">
                    Not a member?
                    <Link to="/signup" class="font-semibold text-indigo-400 hover:text-indigo-300">&nbsp;Signup!</Link>
                    </p>
                </div>
                </div>
            </div>
        </div>
    )
}
