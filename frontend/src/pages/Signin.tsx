import { Quote } from "../components/Quote";
import { Auth } from "../components/Auth";

export const Signin = () => {
  return (
    <div
      className="min-h-screen font-mono grid grid-cols-1 lg:grid-cols-2 transition-colors"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="flex flex-col items-center justify-center col-span-1">
        <div className="w-full">
          <Auth type="signin" />
        </div>
      </div>
      <div className="hidden lg:block">
        <Quote />
      </div>
    </div>
  );
};

export default Signin;