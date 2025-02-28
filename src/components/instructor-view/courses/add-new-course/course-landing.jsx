import FormControls from "@/components/common-form/form-controls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { courseLandingPageFormControls } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { useContext } from "react";

function CourseLanding() {
  const { courseLandingFormData, setCourseLandingFormData } =
    useContext(InstructorContext);

  return (
    <div className="p-2 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 rounded-lg">
      <Card className="bg-white/10 backdrop-blur-md shadow-xl p-6 rounded-lg">
        <CardHeader>
          <CardTitle className="text-gray-100 text-xl font-semibold">
            Course Landing Page
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormControls
            formControls={courseLandingPageFormControls}
            formData={courseLandingFormData}
            setFormData={setCourseLandingFormData}
            className="space-y-4"
            inputClassName="w-full px-3 py-2 bg-gray-800 text-white text-sm border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            selectClassName="w-full px-3 py-2 bg-gray-800 text-white text-sm border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default CourseLanding;
