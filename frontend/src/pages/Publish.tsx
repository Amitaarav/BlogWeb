import { Appbar } from "../components/Appbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChangeEvent } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
export const Publish = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    const handleTitleChnge = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)
    return ( <div> 
            <Appbar/>
        <div className="w-full max-w-screen-lg mx-auto pt-4 border rounded-md resize-none sm:w-full m-4">
            <div className="m-4 ">
            
        
        <form className="flex flex-col items-center justify-center space-y-4">
            <TitleInput onChange={handleTitleChnge} />
            
            <TextEditor onChange={(e) => setDescription(e.target.value)}/>
            <button
            type="submit"
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-gray-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-gray-900 hover:bg-gray-800"
            onClick={async()=>{
                const response =await axios.post(`${BACKEND_URL}/api/v1/blog`,
                    {
                        title,
                        content :description
                    },{
                        headers: {
                            Authorization:localStorage.getItem('token')
                        }
                    }
                )
                navigate(`/blog/${response.data.id}`)
            }}
            >
            Publish Blog
            </button>
        </form>
        </div>
            </div>
        
        </div>
    );
    };

    function TextEditor({onChange}:{onChange:(e:ChangeEvent<HTMLTextAreaElement>)=>void}){
        return <div className="my-2 bg-white rounded-b-lg w-full">
        <div className="pb-2">
        <label htmlFor="description" className="font-bold">Publish Blog</label>
        </div>
        <textarea
            onChange={onChange}
            placeholder="Write your content here..."
            rows={12}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 bg-gray-300"
            required
        ></textarea>
    </div>
    }

    function TitleInput({onChange}:{onChange:(e:ChangeEvent<HTMLInputElement>)=>void}){
        return (
            <div className="my-2 bg-white rounded-b-lg w-full">
        <div className="pb-2">
        <label htmlFor="description" className="font-bold">Blog Title</label>
        </div>
        <input
            onChange = {onChange}
            type="text"
            placeholder="Enter the title"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 bg-gray-300"
            required
            />
    </div>
        )
        
    }
