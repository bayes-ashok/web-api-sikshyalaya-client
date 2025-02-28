import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Users } from "lucide-react";

function InstructorDashboard({ listOfCourses }) {
  function calculateTotalStudentsAndProfit() {
    const { totalStudents, totalProfit, studentList } = listOfCourses.reduce(
      (acc, course) => {
        const studentCount = course.students.length;
        acc.totalStudents += studentCount;
        acc.totalProfit += course.pricing * studentCount;

        course.students.forEach((student) => {
          acc.studentList.push({
            courseTitle: course.title,
            studentName: student.studentName,
            studentEmail: student.studentEmail,
          });
        });

        return acc;
      },
      {
        totalStudents: 0,
        totalProfit: 0,
        studentList: [],
      }
    );

    return {
      totalProfit,
      totalStudents,
      studentList,
    };
  }

  const config = [
    {
      icon: Users,
      label: "Total Students",
      value: calculateTotalStudentsAndProfit().totalStudents,
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: `$${calculateTotalStudentsAndProfit().totalProfit}`,
    },
  ];

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {config.map((item, index) => (
          <Card
            key={index}
            className="bg-white/10 backdrop-blur-md shadow-xl p-6 rounded-lg"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold text-gray-100">
                {item.label}
              </CardTitle>
              <item.icon className="h-6 w-6 text-gray-300" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Students List Table */}
      <Card className="bg-white/10 backdrop-blur-md shadow-xl p-6 rounded-lg">
        <CardHeader>
          <CardTitle className="text-gray-100 text-2xl font-bold">
            Students List
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white p-1 rounded">
          <div className="overflow-x-auto">
            <Table className="w-full border border-gray-700 rounded-lg overflow-hidden">
              <TableHeader className="bg-gray-900 text-white">
                <TableRow>
                  <TableHead className="p-4 text-left text-white font-bold">
                    Course Name
                  </TableHead>
                  <TableHead className="p-4 text-left text-white font-bold">
                    Student Name
                  </TableHead>
                  <TableHead className="p-4 text-left text-white font-bold">
                    Student Email
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {calculateTotalStudentsAndProfit().studentList.length > 0 ? (
                  calculateTotalStudentsAndProfit().studentList.map(
                    (studentItem, index) => (
                      <TableRow
                        key={index}
                        className={`border-b border-gray-700 ${
                          index % 2 === 0 ? "bg-gray-700" : "bg-gray-800"
                        } hover:bg-gray-600 transition`}
                      >
                        <TableCell className="p-4 font-medium text-gray-100">
                          {studentItem.courseTitle}
                        </TableCell>
                        <TableCell className="p-4 text-gray-100">
                          {studentItem.studentName}
                        </TableCell>
                        <TableCell className="p-4 text-gray-100">
                          {studentItem.studentEmail}
                        </TableCell>
                      </TableRow>
                    )
                  )
                ) : (
                  <TableRow className="bg-gray-800">
                    <TableCell
                      colSpan="3"
                      className="p-4 text-center text-gray-400"
                    >
                      No students enrolled yet.
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

export default InstructorDashboard;
