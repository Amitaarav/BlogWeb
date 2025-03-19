import { useState} from "react";
import { Link,useNavigate } from "react-router-dom"
import axios from "axios"
import { BACKEND_URL } from "../config";
import {SignUpInput } from "@amitaarav/blog-common";
export const Auth = ({type}:{type:"signup" | "signin"}) => {
    const [postInputs,setPostInput] = useState<SignUpInput>({
        username: "",
        password: "",
        email: ""
    })
    const navigate = useNavigate();
    async function sendRequest(){
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`
            ,postInputs);
            const jwt = response.data;
            localStorage.setItem("token",jwt);
            navigate("/blogs");
        } catch (error) {
            alert("Something went wrong");
            console.log(error);
            
        }
        
    }

    return <div className="h-screen flex justify-center flex-col">
    
        <div className="flex justify-center">
            <div className="">
                    <div className="px-6 py-4">
                        <div className="text-2xl font-extrabold text-center">
                        Create an account
                    </div>
                    <div className="text-sm font-semibold text-gray-500">
                        {type === "signin"?"Don't have an account?":"Already have an account?"}
                        <Link className="pl-2 underline font-bold" to={type === "signin"?"/signup":"/signin"}>
                            {type === "signin"?"Sign up":"Sign in"}
                        </Link>
                    </div>
                </div>
            
            <div className="pt-2">
                { type === "signup" ? <LabelInput type="text"label="username" placeholder="Amit Kumar" onChange={(e)=>{
                    setPostInput({
                    ...postInputs,//give all the existing
                    username: e.target.value //update the username override
                    })
                    }}/>: null}
                
                <LabelInput type="text"label="email" placeholder="aaravamit555@gmail.com" onChange={(e)=>{
                    setPostInput({
                    ...postInputs,//give all the existing
                    email: e.target.value //update the username override
                    })
                    }}/>
                <LabelInput type="password"label="password" placeholder="123456789" onChange={(e)=>{
                    setPostInput({
                    ...postInputs,//give all the existing
                    password: e.target.value //update the username override
                    })
                    }}/>
                </div>
                <div className="flex justify-center pt-3">
                <button onClick={sendRequest} type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 w-full">{type === "signin" ? "Sign in" :"Sign up"}</button>
                </div>
            </div>
            
        </div>
    </div>
}

interface LabelInputType {
    label:string,
    placeholder:string,
    onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void,
    type?:string
}

function LabelInput({label,placeholder,onChange,type="password"}:LabelInputType) {
    return <div className="pt-3">
        <label className="block text-lg font-medium text-gray-700">{label}</label>
        <input type={type || "text"} onChange={onChange} placeholder={placeholder} id="first_name" className="mt-1 block w-full px-3 py-2 bg-gray-300 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-slate-900 sm:text-sm
        text-black" />
    </div>
}