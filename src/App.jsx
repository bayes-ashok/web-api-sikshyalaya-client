import "./App.css";
import Login from "./pages/Login";
import Navbar from "./components/navbar";
import HeroSection from "./pages/student/HeroSection";
import Courses from "./pages/student/Courses";
import MainLayout from "./layout/MainLayout";
import { RouterProvider,createBrowserRouter } from "react-router-dom";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <HeroSection />
            <Courses />
          </>
        ),
      },
      {
        path: "login",
        element: (
          // <AuthenticatedUser>
            <Login />
          // </AuthenticatedUser>
        ),
      },
    ],
  },
]);
function App() {
  return (
    <main>
      {/* <HeroSection></HeroSection>
      <Navbar></Navbar>
      <Login></Login> */}

      <RouterProvider router={appRouter}></RouterProvider>
    </main>
  );
}

export default App;
