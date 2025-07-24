import { useState, useEffect } from "react";
import axios from "axios"
import { BACKEND_URL } from "../config";

export interface Blog {
    "content": string,
    "title": string,
    "id": string,
    "author": {
        "name": string,
    }
}

export const useBlog = ({id}:{id:string})=>{
    const [blog, setBlog] = useState<Blog>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    axios.get(`${BACKEND_URL}/api/v1/blog/${id}`,{
        headers:{
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
        .then((res) => {
            setBlog(res.data.blog);
            setLoading(false);
        })
        .catch((error) => {
            console.error("Error fetching blog:", error);
            setLoading(false);
        });
},[id])
        return {
            loading,
            blog
        }
}

export const useBlogs = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    axios.get(`${BACKEND_URL}/api/v1/blog/bulk`,{
        headers:{
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
        .then((res) => {
            setBlogs(res.data.blogs);
            setLoading(false);
        })
},[])
        return {
            loading,
            blogs
        }
}