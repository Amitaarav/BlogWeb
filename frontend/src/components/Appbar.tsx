import { Avatar } from "./BlogCard"
import {Link } from "react-router-dom"

export const Appbar = () => {
    return<div className="border-b flex justify-between px-10 py-4 rounded-md shadow-lg">
        <Link to={'/blogs'} className="flex flex-col justify-center font-bold text-2xl cursor-pointer">
            BlogWeb
        </Link>
        <div className="flex gap-4">
            <Link to={'/publish'}>
                <button type="button" className="text-white bg-green-500 hover:bg-green-800  font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 ">New</button>
            </Link>
        
        <div className="flex flex-col justify-center cursor-pointer">
            <Link to="/profile"><Avatar size={8} name="Amit Kumar"/></Link>
        </div>
        </div>
    </div>
}

