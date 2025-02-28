import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import InstructorCourses from "@/components/instructor-view/courses";
import InstructorDashboard from "@/components/instructor-view/dashboard";
import AdminQuizPanel from "@/components/instructor-view/dashboard/admin-quiz-panel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import { fetchInstructorCourseListService } from "@/services";
import { BarChart, Book, LogOut, List, Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

function InstructorDashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { resetCredentials } = useContext(AuthContext);
  const { instructorCoursesList, setInstructorCoursesList } =
    useContext(InstructorContext);
  const [quizSets, setQuizSets] = useState([]);

  async function fetchAllCourses() {
    const response = await fetchInstructorCourseListService();
    if (response?.success) setInstructorCoursesList(response?.data);
  }

  async function fetchQuizSets() {
    try {
      const response = await axios.get("http://localhost:8000/instructor/quiz");
      setQuizSets(response.data.data);
    } catch (error) {
      console.error("Error fetching quizzes", error);
    }
  }

  useEffect(() => {
    fetchAllCourses();
    fetchQuizSets();
  }, []);

  const menuItems = [
    {
      icon: BarChart,
      label: "Dashboard",
      value: "dashboard",
      component: <InstructorDashboard listOfCourses={instructorCoursesList} />,
    },
    {
      icon: Book,
      label: "Courses",
      value: "courses",
      component: <InstructorCourses listOfCourses={instructorCoursesList} />,
    },
    {
      icon: List,
      label: "Quizzes",
      value: "quizzes",
      component: (
        <div>
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">All Quiz Sets</h2>
          <Button 
            className="mb-4 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg"
            onClick={() => setActiveTab("add-quiz")}
          >
            + Add Quiz
          </Button>
          <div className="border rounded-lg p-4  shadow-lg">
            {quizSets.length === 0 ? (
              <p className="text-gray-300">No quizzes found.</p>
            ) : (
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-white-800 text-white">
                    <th className="p-3">Title</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quizSets.map((quiz, index) => (
                    <tr 
                      key={quiz._id} 
                      className={`border-b border-gray-700 ${index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}`}
                    >
                      <td className="p-3 text-gray-100">{quiz.title}</td>
                      <td className="p-3 text-gray-100">{quiz.category}</td>
                      <td className="p-3 flex gap-2">
                        <Button 
                          className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md"
                          onClick={() => setActiveTab("edit-quiz")}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md"
                          onClick={() => console.log("Delete quiz", quiz._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ),
    },
    {
      icon: LogOut,
      label: "Logout",
      value: "logout",
      component: null,
    }
  ];

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      {/* Sidebar - Fixed & Always Visible */}
      <motion.aside 
        className="w-72 bg-white/10 backdrop-blur-md shadow-xl h-full p-6 rounded-r-2xl"
      >
        <h2 className="text-2xl font-bold mb-6">Instructor Panel</h2>
        <nav className="space-y-2">
          {menuItems.map((menuItem) => (
            <Button
              key={menuItem.value}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
                activeTab === menuItem.value ? "bg-blue-500 text-white" : "bg-gray-700 hover:bg-gray-600"
              }`}
              onClick={
                menuItem.value === "logout"
                  ? handleLogout
                  : () => setActiveTab(menuItem.value)
              }
            >
              {menuItem.icon && <menuItem.icon className="w-5 h-5" />}
              {menuItem.label}
            </Button>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-gray-100">Dashboard</h1>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {menuItems.map((menuItem) => (
              <TabsContent value={menuItem.value} key={menuItem.value}>
                {menuItem.component !== null ? menuItem.component : null}
              </TabsContent>
            ))}
            {activeTab === "add-quiz" && <AdminQuizPanel />}
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default InstructorDashboardPage;
