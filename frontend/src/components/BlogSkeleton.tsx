export const BlogSkeleton = () => {
    return (
        <div className="p-6 m-4 bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
            {/* Author Section */}
            <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
                <div className="flex-1">
                    <div className="h-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded w-32 mb-2 animate-pulse"></div>
                    <div className="h-3 bg-gradient-to-br from-gray-200 to-gray-300 rounded w-24 animate-pulse"></div>
                </div>
            </div>

            {/* Title */}
            <div className="mb-4">
                <div className="h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded w-3/4 animate-pulse"></div>
            </div>

            {/* Content Preview */}
            <div className="space-y-3 mb-6">
                <div className="h-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded w-4/6 animate-pulse"></div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="h-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded w-24 animate-pulse"></div>
                <div className="h-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded w-16 animate-pulse"></div>
            </div>
        </div>
    );
};
