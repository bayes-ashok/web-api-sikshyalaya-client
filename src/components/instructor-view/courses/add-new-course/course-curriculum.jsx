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
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <Card className="bg-white/10 backdrop-blur-md shadow-xl p-6 rounded-lg">
        <CardHeader className="flex flex-row justify-between">
          <CardTitle className="text-gray-100">Create Course Curriculum</CardTitle>
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
              className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white flex items-center px-4 py-2 rounded-lg"
            >
              <Upload className="w-5 h-5 mr-2" />
              Bulk Upload
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Button
            disabled={mediaUploadProgress}
            onClick={handleNewLecture}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Add Lecture
          </Button>
          {mediaUploadProgress && (
            <MediaProgressbar
              isMediaUploading={mediaUploadProgress}
              progress={mediaUploadProgressPercentage}
            />
          )}
          <div className="mt-4 space-y-4">
            {courseCurriculumFormData.map((curriculumItem, index) => (
              <div
                key={index}
                className={`border p-6 rounded-lg ${
                  index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                }`}
              >
                <div className="flex flex-col md:flex-row gap-5 items-start md:items-center">
                  <h3 className="font-semibold text-gray-100">
                    Lecture {index + 1}
                  </h3>
                  {/* Updated Text Box for Better Visibility */}
                  <Input
                    name={`title-${index + 1}`}
                    placeholder="Enter lecture title"
                    className="w-full md:max-w-96 bg-gray-800 text-white border border-gray-700 px-4 py-2 rounded-lg"
                    onChange={(event) => {
                      let updatedCurriculum = [...courseCurriculumFormData];
                      updatedCurriculum[index].title = event.target.value;
                      setCourseCurriculumFormData(updatedCurriculum);
                    }}
                    value={courseCurriculumFormData[index]?.title}
                  />
                  <div className="flex items-center space-x-2">
                    {/* Fully Fixed Free Preview Switch Visibility */}
                    <Switch
                      onCheckedChange={(value) => {
                        let updatedCurriculum = [...courseCurriculumFormData];
                        updatedCurriculum[index].freePreview = value;
                        setCourseCurriculumFormData(updatedCurriculum);
                      }}
                      checked={courseCurriculumFormData[index]?.freePreview}
                      id={`freePreview-${index + 1}`}
                      className="data-[state=unchecked]:bg-gray-500 data-[state=checked]:bg-green-800 border-black-500"
                      />
                    <Label htmlFor={`freePreview-${index + 1}`} className="text-gray-100">
                      Free Preview
                    </Label>
                  </div>
                </div>
                <div className="mt-6">
                  {courseCurriculumFormData[index]?.videoUrl ? (
                    <div className="flex flex-col md:flex-row gap-4">
                      <VideoPlayer
                        url={courseCurriculumFormData[index]?.videoUrl}
                        width="450px"
                        height="200px"
                      />
                      <div className="flex flex-col gap-2">
                        <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                          Replace Video
                        </Button>
                        <Button
                          onClick={() => handleDeleteLecture(index)}
                          className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
                        >
                          <Trash2 className="w-5 h-5" />
                          Delete Lecture
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {/* Improved File Input for Better UI */}
                      <label
                        htmlFor={`video-upload-${index}`}
                        className="flex items-center justify-center w-full px-4 py-3 text-gray-100 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600"
                      >
                        <FileVideo className="w-5 h-5 mr-2" />
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
