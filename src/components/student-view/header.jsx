import { GraduationCap, TvMinimalPlay } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";

function StudentViewCommonHeader() {
  const navigate = useNavigate();
  const { resetCredentials } = useContext(AuthContext);

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  return (
    <header className="flex items-center justify-between p-5 border-b border-gray-700 bg-gray-900 text-gray-100 shadow-md">
      <div className="flex items-center space-x-6">
        {/* Logo */}
        <Link to="/home" className="flex items-center text-gray-300 hover:text-white transition">
          <GraduationCap className="h-8 w-8 mr-3 text-blue-400" />
          <span className="font-extrabold md:text-xl text-[14px]">
            LMS LEARN
          </span>
        </Link>

        {/* Explore Courses Button */}
        <Button
          variant="ghost"
          onClick={() => {
            if (!location.pathname.includes("/courses")) {
              navigate("/courses");
            }
          }}
          className="text-gray-300 hover:bg-gray-900 hover:text-white hover:font-bold transition text-[14px] md:text-[16px] font-medium"
          >
          Explore Courses
        </Button>
      </div>

      {/* My Courses & Logout Section */}
      <div className="flex items-center space-x-6">
        <div
          onClick={() => navigate("/student-courses")}
          className="flex cursor-pointer items-center gap-3 text-gray-300 hover:text-white transition"
        >
          <span className="font-extrabold md:text-xl text-[14px]">My Courses</span>
          <TvMinimalPlay className="w-8 h-8 text-blue-400 cursor-pointer" />
        </div>

        <Button 
          onClick={handleLogout} 
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
        >
          Sign Out
        </Button>
      </div>
    </header>
  );
}

export default StudentViewCommonHeader;
