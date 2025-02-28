import { courseCategories } from "@/config";
import banner from "../../../../public/banner-img.png";
import { Button } from "@/components/ui/button";
import { useContext, useEffect, useState } from "react";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { AuthContext } from "@/context/auth-context";
import { useNavigate, Link } from "react-router-dom";
import { GraduationCap, TvMinimalPlay, Sun, Moon } from "lucide-react";

function StudentHomePage() {
  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);
  const { auth, resetCredentials } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fake dark mode toggle
  const [isDarkMode, setIsDarkMode] = useState(false);

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  function handleNavigateToCoursesPage(getCurrentId) {
    sessionStorage.removeItem("filters");
    const currentFilter = { category: [getCurrentId] };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate("/courses");
  }

  async function fetchAllStudentViewCourses() {
    const response = await fetchStudentViewCourseListService();
    if (response?.success) setStudentViewCoursesList(response?.data);
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    const response = await checkCoursePurchaseInfoService(
      getCurrentCourseId,
      auth?.user?._id
    );

    if (response?.success) {
      navigate(response?.data ? `/course-progress/${getCurrentCourseId}` : `/course/details/${getCurrentCourseId}`);
    }
  }

  useEffect(() => {
    fetchAllStudentViewCourses();
  }, []);

  // **Render Dark Mode UI If isDarkMode is TRUE**
  if (isDarkMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
          <div className="flex items-center space-x-4">
            <Link to="/home" className="flex items-center hover:text-gray-300">
              <GraduationCap className="h-8 w-8 mr-4 text-white" />
              <span className="font-extrabold md:text-xl text-[14px] text-white">LMS LEARN</span>
            </Link>
            <Button
              variant="ghost"
              onClick={() => navigate("/courses")}
              className="text-[14px] md:text-[16px] font-medium text-white hover:text-gray-300"
            >
              Explore Courses
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDarkMode(false)}
              className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition"
            >
              <Sun className="w-5 h-5 text-yellow-400" />
            </button>
            <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-500 text-white">
              Sign Out
            </Button>
          </div>
        </header>

        {/* Dark Mode Page */}
        <section className="flex flex-col lg:flex-row items-center justify-between py-12 px-6 lg:px-12">
        <div className="lg:w-1/2 lg:pr-12">
          <h1 className="text-4xl font-bold mb-4 text-white">Learning that gets you</h1>
          <p className="text-xl text-gray-300">
            Skills for your present and your future. Get Started with Us.
          </p>
        </div>
        <div className="lg:w-full mb-8 lg:mb-0">
          <img
            src={banner}
            width={600}
            height={400}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-8 px-6 lg:px-12 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-100">Course Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {courseCategories.map((categoryItem) => (
            <Button
              className="justify-start bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 rounded-lg px-4 py-2"
              key={categoryItem.id}
              onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
            >
              {categoryItem.label}
            </Button>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-12 px-6 lg:px-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-100">Featured Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
            studentViewCoursesList.map((courseItem) => (
              <div
                onClick={() => handleCourseNavigate(courseItem?._id)}
                className="border border-gray-700 rounded-lg overflow-hidden shadow-md cursor-pointer bg-gray-800 hover:bg-gray-700 transition"
              >
                <img
                  src={courseItem?.image}
                  width={300}
                  height={150}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-100 mb-2">{courseItem?.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">{courseItem?.instructorName}</p>
                  <p className="font-bold text-[16px] text-green-400">${courseItem?.pricing}</p>
                </div>
              </div>
            ))
          ) : (
            <h1 className="text-gray-300">No Courses Found</h1>
          )}
        </div>
      </section>
      </div>
    );
  }

  // **Default Light Mode Page**
  return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b relative">
        <div className="flex items-center space-x-4">
          <Link to="/home" className="flex items-center hover:text-black">
            <GraduationCap className="h-8 w-8 mr-4" />
            <span className="font-extrabold md:text-xl text-[14px]">LMS LEARN</span>
          </Link>
          <Button
            variant="ghost"
            onClick={() => navigate("/courses")}
            className="text-[14px] md:text-[16px] font-medium"
          >
            Explore Courses
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsDarkMode(true)}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
          >
            <Moon className="w-5 h-5 text-gray-800" />
          </button>
          <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-500 text-white">
            Sign Out
          </Button>
        </div>
      </header>
        <section className="flex flex-col lg:flex-row items-center justify-between py-8 px-4 lg:px-8">
          <div className="lg:w-1/2 lg:pr-12">
            <h1 className="text-4xl font-bold mb-4">Learning thet gets you</h1>
            <p className="text-xl">
              Skills for your present and your future. Get Started with US
            </p>
          </div>
          <div className="lg:w-full mb-8 lg:mb-0">
            <img
              src={banner}
              width={600}
              height={400}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </section>
        <section className="py-8 px-4 lg:px-8 bg-gray-100">
          <h2 className="text-2xl font-bold mb-6">Course Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {courseCategories.map((categoryItem) => (
              <Button
                className="justify-start"
                variant="outline"
                key={categoryItem.id}
                onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
              >
                {categoryItem.label}
              </Button>
            ))}
          </div>
        </section>
        <section className="py-12 px-4 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Featured COourses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
              studentViewCoursesList.map((courseItem) => (
                <div
                  onClick={() => handleCourseNavigate(courseItem?._id)}
                  className="border rounded-lg overflow-hidden shadow cursor-pointer"
                >
                  <img
                    src={courseItem?.image}
                    width={300}
                    height={150}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold mb-2">{courseItem?.title}</h3>
                    <p className="text-sm text-gray-700 mb-2">
                      {courseItem?.instructorName}
                    </p>
                    <p className="font-bold text-[16px]">
                      ${courseItem?.pricing}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <h1>No Courses Found</h1>
            )}
          </div>
        </section>
      </div>
  );
}

export default StudentHomePage;
