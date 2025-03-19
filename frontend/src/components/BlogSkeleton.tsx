
export const BlogSkeleton = () => {
    return (
        <div className="pl-4 m-4 bg-white rounded-md shadow-md border-b-2 border-slate-300 cursor-pointer animate-pulse">
        
        
        <div className="flex m-2">
            <div className="flex justify-center flex-col">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            </div>
            <div className="flex">
            <div className="font-medium pl-2 text-sm flex flex-col justify-center w-24 h-4 bg-gray-200 rounded"></div>
            <div className="flex justify-center pl-2 flex-col">
                <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
            </div>
            <div className="pl-2 font-thin text-slate-500 flex flex-col justify-center w-20 h-4 bg-gray-200 rounded"></div>
            </div>
        </div>
        
        <div className="font-bold text-3xl pb-4 mr-4 w-3/4 h-8 bg-gray-200 rounded"></div>

        <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>


        <div className="text-sm text-slate-500 pt-2 font-thin w-24 h-4 bg-gray-200 rounded"></div>
        
        <div className="bg-slate-200 h-1 w-full mt-2"></div>
</div>
    );
};
