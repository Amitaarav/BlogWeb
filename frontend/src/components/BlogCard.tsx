import { Link } from "react-router-dom";

interface BlogCardProps {
  authorName: string;
  title: string;
  content: string;
  date?: string;
  id: string;
}

export const BlogCard = ({
    authorName,
    title,
    content,
    date = "Recently",
    id
}: BlogCardProps) => {
    const cleanContent = content.replace(/<[^>]*>?/gm, '');
    const readTime = Math.max(1, Math.ceil(cleanContent.trim().split(/\s+/).length / 200));

    return (
        <Link to={`/blog/${id}`} className="block w-full">
            <div className="p-4 sm:p-6 bg-white rounded-lg border-b-2 border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors duration-150">
                <div className="flex items-center gap-2 mb-2"> 
                    <Avatar name={authorName || "Anonymous"} size="small" /> 
                    <span className="font-medium text-sm text-slate-800">{authorName || "Anonymous"}</span>
                    <span className="bg-slate-400 h-1 w-1 rounded-full inline-block"></span>
                    <span className="font-thin text-xs text-slate-500">{date}</span>
                </div>

                <h2 className="font-bold text-xl sm:text-2xl text-slate-900 pb-2">
                    {title || "Untitled Blog"}
                </h2>

                <p className="text-slate-600 text-sm sm:text-base line-clamp-3 mb-3 leading-relaxed font-normal">
                    {cleanContent.slice(0, 160) + (cleanContent.length > 160 ? "..." : "")}
                </p>

                <div className="text-xs text-slate-500 font-thin flex items-center justify-between pt-2">
                    <span>{`${readTime} minute(s) read`}</span>
                </div>
            </div>
        </Link>
    );
};

export function Avatar({
    name = "User", 
    size = "medium", 
    imageUrl
}: {
    name?: string; 
    size?: "small" | "medium" | "large" | "xlarge" | number; 
    imageUrl?: string;
}) {
    const sizeClasses = typeof size === "number"
        ? size > 12 ? "w-16 h-16 text-2xl" : "w-8 h-8 text-sm"
        : size === "small" 
            ? "w-7 h-7 text-xs" 
            : size === "large" 
                ? "w-12 h-12 text-lg" 
                : size === "xlarge" 
                    ? "w-16 h-16 text-2xl" 
                    : "w-9 h-9 text-sm";

    const initial = (name && name.trim().length > 0) ? name.trim()[0].toUpperCase() : "U";

    return (
        <div className={`relative inline-flex items-center justify-center ${sizeClasses} overflow-hidden bg-slate-600 text-white font-medium rounded-full flex-shrink-0`}>
            {imageUrl ? (
                <img 
                    src={imageUrl} 
                    alt={name}
                    className="w-full h-full object-cover"
                />
            ) : (
                <span>{initial}</span>
            )}
        </div>
    );
}
