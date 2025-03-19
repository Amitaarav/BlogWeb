
import { Quote } from "../components/Quote"
import { Auth } from "../components/Auth"

export const Signin = () => {
    return <div>
    <div className="grid grid-cols-1 lg:grid-cols-2">
    {/* Signup Form Section */}
    <div className="flex flex-col items-center justify-center col-span-1 lg:col-span-1">
        <div className="w-full lg:w-auto">
            <Auth type="signin" />
        </div>
    </div>

    {/* Quote Section */}
    <div className="hidden lg:block">
        <Quote />
    </div>
    </div>
    </div>
}