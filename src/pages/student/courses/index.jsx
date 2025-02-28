import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { filterOptions, sortOptions } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { ArrowUpDownIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];
  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }
  return queryParams.join("&");
}

function StudentViewCoursesPage() {
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  function handleFilterOnChange(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    if (!cpyFilters[getSectionId]) cpyFilters[getSectionId] = [];
    const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOption.id);
    if (indexOfCurrentOption === -1) cpyFilters[getSectionId].push(getCurrentOption.id);
    else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    setFilters({ ...cpyFilters });
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  async function fetchAllStudentViewCourses(filters, sort) {
    const query = new URLSearchParams({
      ...filters,
      sortBy: sort,
    });
    const response = await fetchStudentViewCourseListService(query);
    if (response?.success) {
      setStudentViewCoursesList(response?.data);
      setLoadingState(false);
    }
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    const response = await checkCoursePurchaseInfoService(
      getCurrentCourseId,
      auth?.user?._id
    );
    if (response?.success) {
      if (response?.data) {
        navigate(`/course-progress/${getCurrentCourseId}`);
      } else {
        navigate(`/course/details/${getCurrentCourseId}`);
      }
    }
  }

  useEffect(() => {
    const buildQueryStringForFilters = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(buildQueryStringForFilters));
  }, [filters]);

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, []);

  useEffect(() => {
    if (filters !== null && sort !== null)
      fetchAllStudentViewCourses(filters, sort);
  }, [filters, sort]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("filters");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">All Courses</h1>
      <div className="flex justify-between items-center mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center ml-auto gap-2 p-5">
              <ArrowUpDownIcon className="h-4 w-4 text-black" />
              <span className="text-[16px] text-black font-medium">Sort By</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            <DropdownMenuRadioGroup value={sort} onValueChange={(value) => setSort(value)}>
              {sortOptions.map((sortItem) => (
                <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id}>
                  {sortItem.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <aside className="w-full md:w-64 space-y-4 bg-gray-800 p-4 rounded-lg">
          {Object.keys(filterOptions).map((keyItem) => (
            <div key={keyItem} className="p-4 border-b border-gray-700">
              <h3 className="font-bold text-gray-100 mb-3">{keyItem.toUpperCase()}</h3>
              <div className="grid gap-2 mt-2">
                {filterOptions[keyItem].map((option) => (
                  <Label key={option.id} className="flex items-center gap-3 text-gray-300">
                    <Checkbox
                      className="border-gray-500"
                      checked={filters[keyItem]?.includes(option.id)}
                      onCheckedChange={() => handleFilterOnChange(keyItem, option)}
                    />
                    {option.label}
                  </Label>
                ))}
              </div>
            </div>
          ))}
        </aside>
        <main className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {studentViewCoursesList.length > 0 ? (
              studentViewCoursesList.map((courseItem) => (
                <Card
                  key={courseItem._id}
                  onClick={() => handleCourseNavigate(courseItem._id)}
                  className="cursor-pointer bg-gray-800 hover:bg-gray-700 transition p-4 rounded-lg"
                >
                  <CardContent>
                    <img src={courseItem.image} className="w-full h-40 object-cover rounded-md mb-4" />
                    <CardTitle className="text-gray-100 text-xl mb-2">{courseItem.title}</CardTitle>
                    <p className="text-sm text-gray-400 mb-2">Created By {courseItem.instructorName}</p>
                    <p className="font-bold text-green-400">${courseItem.pricing}</p>
                  </CardContent>
                </Card>
              ))
            ) : loadingState ? (
              <Skeleton />
            ) : (
              <h1 className="text-3xl font-bold text-gray-300">No Courses Found</h1>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentViewCoursesPage;
