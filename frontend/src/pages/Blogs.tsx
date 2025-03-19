import { BlogCard } from "../components/BlogCard"
import { Appbar } from "../components/Appbar"
import { useBlogs } from "../hooks/useBlogs"
import { BlogSkeleton } from "../components/BlogSkeleton"


export const Blogs = () => {
    const { loading,blogs } = useBlogs();
    if(loading) return <div className="">
        <Appbar/>
        <div>
        <BlogSkeleton/>
        <BlogSkeleton/>
        <BlogSkeleton/>
        <BlogSkeleton/>
        </div>
        
    </div>

    return <div>
        <Appbar />
        <div className="flex justify-center flex-col items-center m-4">
        
        <div className="flex justify-center max-w-full flex-wrap gap-4">
        { blogs.map(blog =><BlogCard
                    id =  {blog.id}
                    authorName={blog.author.name || "Anonymous"}
                    title = {blog.title}
                    authorAvatar={"avtaar"}
                    content={blog.content}
                    date={"21st Dec 2024"}
                    />)}
        </div>
        </div>
    </div>
}