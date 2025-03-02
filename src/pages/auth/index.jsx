import { GraduationCap, TvMinimalPlay, Sun, Moon, ClipboardList, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import CommonForm from "@/components/common-form";
import { signInFormControls, signUpFormControls } from "@/config";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
  } = useContext(AuthContext);

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleTabChange(value) {
    setActiveTab(value);
  }

  function checkIfSignInFormIsValid() {
    return (
      signInFormData &&
      signInFormData.userEmail !== "" &&
      signInFormData.password !== ""
    );
  }

  function checkIfSignUpFormIsValid() {
    return (
      signUpFormData &&
      signUpFormData.userName !== "" &&
      signUpFormData.userEmail !== "" &&
      signUpFormData.password !== ""
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-100 to-gray-50">
      <header className="flex items-center justify-between p-3 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg relative">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
            <Menu className="w-7 h-7" />
          </button>
          <Link to="/home" className="flex items-center hover:text-gray-200 transition-all">
            <GraduationCap className="h-9 w-9 mr-3" />
            <span className="font-extrabold text-3xl">Sikshyalaya</span>
          </Link>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition transform hover:scale-110">
            <Moon className="w-7 h-7" />
          </button>
        </div>
      </header>

      <div className="flex items-center justify-center mt-3">
        <div className="w-full max-w-lg bg-gray-50 p-3 rounded-2xl shadow-lg border border-gray-200">
          <Tabs
            value={activeTab}
            defaultValue="signin"
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg">
              <TabsTrigger
                value="signin"
                className="rounded-md text-gray-700 hover:bg-gray-200"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="rounded-md text-gray-700 hover:bg-gray-200"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <Card className="bg-white rounded-lg">
                <CardHeader>
                  <CardTitle className="text-gray-900 text-xl font-semibold">Sign in to your account</CardTitle>
                  <CardDescription className="text-gray-600">
                    Enter your email and password to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CommonForm
                    formControls={signInFormControls}
                    buttonText={"Login"}
                    formData={signInFormData}
                    setFormData={setSignInFormData}
                    isButtonDisabled={!checkIfSignInFormIsValid()}
                    handleSubmit={handleLoginUser}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="signup">
              <Card className="bg-white rounded-lg">
                <CardHeader>
                  <CardTitle className="text-gray-900 text-xl font-semibold">Create a new account</CardTitle>
                  <CardDescription className="text-gray-600">
                    Enter your details to get started
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CommonForm
                    formControls={signUpFormControls}
                    buttonText={"Sign Up"}
                    formData={signUpFormData}
                    setFormData={setSignUpFormData}
                    isButtonDisabled={!checkIfSignUpFormIsValid()}
                    handleSubmit={handleRegisterUser}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;