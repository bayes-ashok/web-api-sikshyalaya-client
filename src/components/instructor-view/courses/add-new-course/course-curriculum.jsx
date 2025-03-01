import MediaProgressbar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import VideoPlayer from "@/components/video-player";
import { courseCurriculumInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import {
  mediaBulkUploadService,
  mediaDeleteService,
  mediaUploadService,
} from "@/services";
import { Upload, FileVideo, Trash2 } from "lucide-react";
import { useContext, useRef } from "react";

function CourseCurriculum() {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  const bulkUploadInputRef = useRef(null);

  function handleNewLecture() {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
        ...courseCurriculumInitialFormData[0],
      },
    ]);
  }

  async function handleSingleLectureUpload(event, currentIndex) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const videoFormData = new FormData();
      videoFormData.append("file", selectedFile);
      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          videoFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          let updatedCurriculum = [...courseCurriculumFormData];
          updatedCurriculum[currentIndex] = {
            ...updatedCurriculum[currentIndex],
            videoUrl: response?.data?.url,
            public_id: response?.data?.public_id,
          };
          setCourseCurriculumFormData(updatedCurriculum);
          setMediaUploadProgress(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function handleDeleteLecture(currentIndex) {
    let updatedCurriculum = [...courseCurriculumFormData];
    const publicId = updatedCurriculum[currentIndex].public_id;
    const response = await mediaDeleteService(publicId);
    if (response?.success) {
      updatedCurriculum = updatedCurriculum.filter(
        (_, index) => index !== currentIndex
      );
      setCourseCurriculumFormData(updatedCurriculum);
    }
  }

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-900">
  <Card className="bg-white shadow-2xl p-6 rounded-xl">
    <CardHeader className="flex flex-row justify-between">
      <CardTitle className="text-gray-900 font-bold text-xl">Create Course Curriculum</CardTitle>
      <div>
        {/* Styled Media Picker */}
        <input
          type="file"
          ref={bulkUploadInputRef}
          accept="video/*"
          multiple
          className="hidden"
          id="bulk-media-upload"
          onChange={handleSingleLectureUpload}
        />
        <Button
          as="label"
          htmlFor="bulk-media-upload"
          className="cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white flex items-center px-6 py-3 rounded-lg shadow-md transition duration-300"
        >
          <Upload className="w-5 h-5 mr-3" />
          Bulk Upload
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <Button
        disabled={mediaUploadProgress}
        onClick={handleNewLecture}
        className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white px-6 py-3 rounded-lg shadow-md transition duration-300"
      >
        Add Lecture
      </Button>
      {mediaUploadProgress && (
        <MediaProgressbar
          isMediaUploading={mediaUploadProgress}
          progress={mediaUploadProgressPercentage}
        />
      )}
      <div className="mt-6 space-y-6">
        {courseCurriculumFormData.map((curriculumItem, index) => (
          <div
            key={index}
            className={`border p-6 rounded-lg shadow-md ${
              index % 2 === 0 ? "bg-white" : "bg-gray-50"
            } transition duration-300`}
          >
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <h3 className="font-semibold text-xl text-gray-900">Lecture {index + 1}</h3>
              {/* Updated Text Box for Better Visibility */}
              <Input
                name={`title-${index + 1}`}
                placeholder="Enter lecture title"
                className="w-full md:max-w-xs bg-gray-100 text-gray-900 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(event) => {
                  let updatedCurriculum = [...courseCurriculumFormData];
                  updatedCurriculum[index].title = event.target.value;
                  setCourseCurriculumFormData(updatedCurriculum);
                }}
                value={courseCurriculumFormData[index]?.title}
              />
              <div className="flex items-center space-x-3">
                {/* Fully Fixed Free Preview Switch Visibility */}
                <Switch
                  onCheckedChange={(value) => {
                    let updatedCurriculum = [...courseCurriculumFormData];
                    updatedCurriculum[index].freePreview = value;
                    setCourseCurriculumFormData(updatedCurriculum);
                  }}
                  checked={courseCurriculumFormData[index]?.freePreview}
                  id={`freePreview-${index + 1}`}
                  className="data-[state=unchecked]:bg-gray-300 data-[state=checked]:bg-green-500 border-gray-400"
                />
                <Label htmlFor={`freePreview-${index + 1}`} className="text-gray-900 text-sm">
                  Free Preview
                </Label>
              </div>
            </div>
            <div className="mt-6">
              {courseCurriculumFormData[index]?.videoUrl ? (
                <div className="flex flex-col md:flex-row gap-6">
                  <VideoPlayer
                    url={courseCurriculumFormData[index]?.videoUrl}
                    width="450px"
                    height="200px"
                  />
                  <div className="flex flex-col gap-4">
                    <Button className="bg-yellow-500 hover:bg-yellow-400 text-white px-6 py-3 rounded-lg transition duration-300">
                      Replace Video
                    </Button>
                    <Button
                      onClick={() => handleDeleteLecture(index)}
                      className="bg-red-500 hover:bg-red-400 text-white px-6 py-3 rounded-lg transition duration-300"
                    >
                      <Trash2 className="w-5 h-5 mr-2" />
                      Delete Lecture
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col">
                  {/* Clean and Premium File Upload */}
                  <label
                    htmlFor={`video-upload-${index}`}
                    className="flex items-center justify-center w-full px-6 py-4 text-gray-800 bg-gray-200 hover:bg-gray-300 rounded-lg cursor-pointer transition duration-300"
                  >
                    <FileVideo className="w-6 h-6 mr-3" />
                    Upload Video
                  </label>
                  <input
                    id={`video-upload-${index}`}
                    type="file"
                    accept="video/*"
                    onChange={(event) => handleSingleLectureUpload(event, index)}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
</div>


  );
}

export default CourseCurriculum;
