import { Link } from "react-router-dom";

interface BlogCardProps {
  authorName: string;
  authorAvatar: string;
  title: string;
  content: string;
  date: string;
  id:string;
}
export const BlogCard = ({
    authorName,
    title,
    content,
    date,
    id
}:BlogCardProps) => {
    return <Link to = {`/blog/${id}`}>
    <div className="pl-4 m-4 bg-white rounded-md shadow-md border-b-2 border-slate-300 cursor-pointer hover:bg-slate-100">
        <div className="flex m-2"> 
            <div className="flex justify-center flex-col">
                <Avatar name={authorName}/> 
            </div>
            <div className="flex">
            <div className="font-medium pl-2 text-sm flex flex-col justify-center">{authorName}</div>
            <div className="flex justify-center pl-2 flex-col"> <Circle/> </div>
            <div className="pl-2 font-thin text-slate-500 flex flex-col justify-center">{date}</div>
            </div>
            
        </div>
        <div className="font-bold text-3xl pb-4 mr-4">{title}</div>
        <div>
            {content.slice(0, 100) + '...'}
        </div>
        <div className="text-sm text-slate-500 pt-2 font-thin">
            {`${Math.ceil(content.length / 100)} minutes read`}
        </div>
        <div className="bg-slate-200 h-1 w-full">

        </div>
    </div>
    </Link>
}

export function Avatar({name,size = 8}:{name:string,size?:number}){
    return <div>
        <div className={`relative inline-flex items-center justify-center w-${size} h-${size}  overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600`}>
            <span className="font-sm text-gray-600 dark:text-gray-300">{name[0]}</span>
        </div>
    </div>
}

function Circle(){
    return <div className="bg-slate-500 h-1 w-1 rounded-full">

    </div>
}