import MediaProgressbar from "@/components/media-progress-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InstructorContext } from "@/context/instructor-context";
import { mediaUploadService } from "@/services";
import { Upload, Trash2 } from "lucide-react";
import { useContext, useRef } from "react";

function CourseSettings() {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  const fileInputRef = useRef(null);

  async function handleImageUploadChange(event) {
    const selectedImage = event.target.files[0];

    if (selectedImage) {
      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          imageFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: response.data.url,
          });
          setMediaUploadProgress(false);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <Card className="bg-white/10 backdrop-blur-md shadow-xl p-6 rounded-lg">
        <CardHeader>
          <CardTitle className="text-gray-100 text-lg font-semibold tracking-wide">
            Course Settings
          </CardTitle>
        </CardHeader>
        <div className="p-4">
          {mediaUploadProgress ? (
            <MediaProgressbar
              isMediaUploading={mediaUploadProgress}
              progress={mediaUploadProgressPercentage}
            />
          ) : null}
        </div>
        <CardContent>
          {courseLandingFormData?.image ? (
            <div className="flex flex-col items-center space-y-4">
              {/* Fixed Large Image Size */}
              <div className="relative">
                <img
                  src={courseLandingFormData.image}
                  alt="Course Preview"
                  className="rounded-lg shadow-lg border border-gray-600 w-[400px] h-[250px] object-cover"
                />
                {/* Improved "Remove Image" Button */}
                <button
                  onClick={() =>
                    setCourseLandingFormData({ ...courseLandingFormData, image: "" })
                  }
                  className="absolute top-2 right-2 flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Label className="text-gray-200 text-sm font-medium">
                Upload Course Image
              </Label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUploadChange}
                ref={fileInputRef}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg hover:bg-gray-700 transition duration-200"
              >
                <Upload className="w-5 h-5 mr-2" />
                Select Image
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CourseSettings;
