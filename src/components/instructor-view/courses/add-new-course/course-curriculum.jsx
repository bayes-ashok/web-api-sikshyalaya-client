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
import { Upload } from "lucide-react";
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
            <Input
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
              variant="outline"
              className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white"
            >
              <Upload className="w-4 h-5 mr-2" />
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
              <div key={index} className="border p-5 rounded-md bg-white/90">
                <div className="flex gap-5 items-center">
                  <h3 className="font-semibold text-gray-800">
                    Lecture {index + 1}
                  </h3>
                  <Input
                    name={`title-${index + 1}`}
                    placeholder="Enter lecture title"
                    className="max-w-96"
                    onChange={(event) => {
                      let updatedCurriculum = [...courseCurriculumFormData];
                      updatedCurriculum[index].title = event.target.value;
                      setCourseCurriculumFormData(updatedCurriculum);
                    }}
                    value={courseCurriculumFormData[index]?.title}
                  />
                  <div className="flex items-center space-x-2">
                    <Switch
                      onCheckedChange={(value) => {
                        let updatedCurriculum = [...courseCurriculumFormData];
                        updatedCurriculum[index].freePreview = value;
                        setCourseCurriculumFormData(updatedCurriculum);
                      }}
                      checked={courseCurriculumFormData[index]?.freePreview}
                      id={`freePreview-${index + 1}`}
                    />
                    <Label htmlFor={`freePreview-${index + 1}`} className="text-gray-800">
                      Free Preview
                    </Label>
                  </div>
                </div>
                <div className="mt-6">
                  {courseCurriculumFormData[index]?.videoUrl ? (
                    <div className="flex gap-3">
                      <VideoPlayer
                        url={courseCurriculumFormData[index]?.videoUrl}
                        width="450px"
                        height="200px"
                      />
                      <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                        Replace Video
                      </Button>
                      <Button
                        onClick={() => handleDeleteLecture(index)}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        Delete Lecture
                      </Button>
                    </div>
                  ) : (
                    <Input
                      type="file"
                      accept="video/*"
                      onChange={(event) => handleSingleLectureUpload(event, index)}
                      className="mb-4"
                    />
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
