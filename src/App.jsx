import "./App.css";
import Login from "./pages/Login";
import Navbar from "./components/navbar";
import HeroSection from "./pages/student/HeroSection";
function App() {
  return (
    <main>
      <HeroSection></HeroSection>
      <Navbar></Navbar>
      <Login></Login>
    </main>
  );
}

export default App;
