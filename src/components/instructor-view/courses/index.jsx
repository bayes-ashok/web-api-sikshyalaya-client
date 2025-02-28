import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { Delete, Edit } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

function InstructorCourses({ listOfCourses }) {
  const navigate = useNavigate();
  const {
    setCurrentEditedCourseId,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
  } = useContext(InstructorContext);

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <Card className="bg-white/10 backdrop-blur-md shadow-xl p-6 rounded-lg">
        <CardHeader className="flex justify-between flex-row items-center">
          <CardTitle className="text-gray-100 text-3xl font-extrabold">All Courses</CardTitle>
          <Button
            onClick={() => {
              setCurrentEditedCourseId(null);
              setCourseLandingFormData(courseLandingInitialFormData);
              setCourseCurriculumFormData(courseCurriculumInitialFormData);
              navigate("/instructor/create-new-course");
            }}
            className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Create New Course
          </Button>
        </CardHeader>
        <CardContent className="bg-white p-1 rounded-lg">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-800 text-white">
                  <TableHead className="p-3">Course</TableHead>
                  <TableHead className="p-3">Students</TableHead>
                  <TableHead className="p-3">Revenue</TableHead>
                  <TableHead className="p-3 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listOfCourses && listOfCourses.length > 0
                  ? listOfCourses.map((course, index) => (
                      <TableRow
                        key={course._id}
                        className={`border-b border-gray-700 ${
                          index % 2 === 0 ? "bg-gray-700" : "bg-gray-800"
                        } hover:bg-gray-900 transition`}
                      >
                        <TableCell className="p-3 font-medium text-gray-100">
                          {course?.title}
                        </TableCell>
                        <TableCell className="p-3 text-gray-100">{course?.students?.length}</TableCell>
                        <TableCell className="p-3 text-gray-100">
                          ${course?.students?.length * course?.pricing}
                        </TableCell>
                        <TableCell className="p-3 text-right flex gap-2">
                          <Button
                            onClick={() => {
                              navigate(`/instructor/edit-course/${course?._id}`);
                            }}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md"
                          >
                            <Edit className="h-5 w-5" />
                          </Button>
                          <Button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md">
                            <Delete className="h-5 w-5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  : (
                    <TableRow className="bg-gray-800">
                      <TableCell colSpan="4" className="p-4 text-center text-gray-400">
                        No courses found.
                      </TableCell>
                    </TableRow>
                  )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default InstructorCourses;
