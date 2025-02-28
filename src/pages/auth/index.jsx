import CommonForm from "@/components/common-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signInFormControls, signUpFormControls } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { GraduationCap } from "lucide-react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

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

  function handleTabChange(value) {
    setActiveTab(value);
  }

  function checkIfSignInFormIsValid() {
    return (
      signInFormData &&
      signInFormData.email !== "" &&
      signInFormData.password !== ""
    );
  }

  function checkIfSignUpFormIsValid() {
    return (
      signUpFormData &&
      signUpFormData.fName !== "" &&
      signUpFormData.email !== "" &&
      signUpFormData.password !== ""
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-700 bg-gray-800">
        <Link to={"/"} className="flex items-center justify-center text-gray-300 hover:text-white transition">
          <GraduationCap className="h-8 w-8 mr-4" />
          <span className="font-extrabold text-xl">LMS LEARN</span>
        </Link>
      </header>

      {/* Auth Form */}
      <div className="flex items-center justify-center min-h-screen">
        <Tabs
          value={activeTab}
          defaultValue="signin"
          onValueChange={handleTabChange}
          className="w-full max-w-md bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-xl"
        >
          <TabsList className="grid w-full grid-cols-2 bg-gray-500 p-1 rounded-lg">
            <TabsTrigger value="signin" className="text-gray-300 hover:text-white transition">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup" className="text-gray-300 hover:text-white transition">
              Sign Up
            </TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <Card className="bg-gray-700 border border-gray-700 p-6 rounded-lg">
              <CardHeader>
                <CardTitle className="text-gray-100 text-xl font-semibold">Sign in to your account</CardTitle>
                <CardDescription className="text-gray-400">
                  Enter your email and password to access your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <CommonForm
                  formControls={signInFormControls}
                  buttonText={"Sign In"}
                  formData={signInFormData}
                  setFormData={setSignInFormData}
                  isButtonDisabled={!checkIfSignInFormIsValid()}
                  handleSubmit={handleLoginUser}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card className="bg-gray-700 border border-gray-700 p-6 rounded-lg">
              <CardHeader>
                <CardTitle className="text-gray-100 text-xl font-semibold">Create a new account</CardTitle>
                <CardDescription className="text-gray-400">
                  Enter your details to get started.
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
  );
}

export default AuthPage;
