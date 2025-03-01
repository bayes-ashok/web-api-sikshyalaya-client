import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  createPaymentService,
  fetchStudentViewCourseDetailsService,
} from "@/services";
import { CheckCircle, Globe, Lock, PlayCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function StudentViewCourseDetailsPage() {
  const {
    studentViewCourseDetails,
    setStudentViewCourseDetails,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);

  const { auth } = useContext(AuthContext);

  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
    useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const [approvalUrl, setApprovalUrl] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  async function fetchStudentViewCourseDetails() {
    const response = await fetchStudentViewCourseDetailsService(
      currentCourseDetailsId
    );

    if (response?.success) {
      setStudentViewCourseDetails(response?.data);
      setLoadingState(false);
    } else {
      setStudentViewCourseDetails(null);
      setLoadingState(false);
    }
  }

  function handleSetFreePreview(getCurrentVideoInfo) {
    console.log(getCurrentVideoInfo);
    setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl);
  }

  async function handleCreatePayment() {
    const paymentPayload = {
      userId: auth?.user?._id,
      fName: auth?.user?.fName,
      email: auth?.user?.email,
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "initiated",
      orderDate: new Date(),
      paymentId: "",
      payerId: "",
      instructorId: studentViewCourseDetails?.instructorId,
      instructorName: studentViewCourseDetails?.instructorName,
      courseImage: studentViewCourseDetails?.image,
      courseTitle: studentViewCourseDetails?.title,
      courseId: studentViewCourseDetails?._id,
      coursePricing: studentViewCourseDetails?.pricing,
    };

    console.log(paymentPayload, "paymentPayload");
    const response = await createPaymentService(paymentPayload);

    if (response.success) {
      sessionStorage.setItem(
        "currentOrderId",
        JSON.stringify(response?.data?.orderId)
      );
      setApprovalUrl(response?.data?.approveUrl);
    }
  }

  useEffect(() => {
    if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true);
  }, [displayCurrentVideoFreePreview]);

  useEffect(() => {
    if (currentCourseDetailsId !== null) fetchStudentViewCourseDetails();
  }, [currentCourseDetailsId]);

  useEffect(() => {
    if (id) setCurrentCourseDetailsId(id);
  }, [id]);

  useEffect(() => {
    if (!location.pathname.includes("course/details"))
      setStudentViewCourseDetails(null),
        setCurrentCourseDetailsId(null),
        setCoursePurchaseId(null);
  }, [location.pathname]);

  if (loadingState) return <Skeleton />;

  if (approvalUrl !== "") {
    window.location.href = approvalUrl;
  }

  const getIndexOfFreePreviewUrl =
    studentViewCourseDetails !== null
      ? studentViewCourseDetails?.curriculum?.findIndex(
          (item) => item.freePreview
        )
      : -1;

  return (
    <div className=" mx-auto p-4">
      <div className="bg-gray-900 text-white p-8 rounded-t-lg">
        <h1 className="text-3xl font-bold mb-4">
          {studentViewCourseDetails?.title}
        </h1>
        <p className="text-xl mb-4">{studentViewCourseDetails?.subtitle}</p>
        <div className="flex items-center space-x-4 mt-2 text-sm">
          <span>Created By {studentViewCourseDetails?.instructorName}</span>
          <span>Created On {studentViewCourseDetails?.date.split("T")[0]}</span>
          <span className="flex items-center">
            <Globe className="mr-1 h-4 w-4" />
            {studentViewCourseDetails?.primaryLanguage}
          </span>
          <span>
            {studentViewCourseDetails?.students.length}{" "}
            {studentViewCourseDetails?.students.length <= 1
              ? "Student"
              : "Students"}
          </span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <main className="flex-1 bg-gray-100 p-6 rounded-lg">
          {/* What You'll Learn */}
          <Card className="p-5 shadow-md border border-gray-300 rounded-lg bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">
                What You'll Learn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {studentViewCourseDetails?.objectives
                  .split(";")
                  .map((objective, index) => (
                    <li
                      key={index}
                      className="flex items-start text-sm text-gray-800"
                    >
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{objective.trim()}</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>

          {/* Course Description */}
          <Card className="p-5 shadow-md border border-gray-300 rounded-lg bg-white mt-5">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Course Description
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-800 leading-relaxed">
              {studentViewCourseDetails?.description}
            </CardContent>
          </Card>

          {/* Course Curriculum */}
          <Card className="p-5 shadow-md border border-gray-300 rounded-lg bg-white mt-5">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Course Curriculum
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {studentViewCourseDetails?.curriculum?.map(
                  (curriculumItem, index) => (
                    <li
                      key={index}
                      className={`flex items-center p-2 rounded-md transition ${
                        curriculumItem?.freePreview
                          ? "cursor-pointer hover:bg-gray-200"
                          : "cursor-not-allowed opacity-60"
                      }`}
                      onClick={
                        curriculumItem?.freePreview
                          ? () => handleSetFreePreview(curriculumItem)
                          : null
                      }
                    >
                      {curriculumItem?.freePreview ? (
                        <PlayCircle className="mr-2 h-4 w-4 text-blue-500" />
                      ) : (
                        <Lock className="mr-2 h-4 w-4 text-gray-500" />
                      )}
                      <span className="text-sm text-gray-800">
                        {curriculumItem?.title}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </CardContent>
          </Card>
        </main>

        <aside className="md:w-1/3 min-w-[300px] max-w-md">
          <Card className="sticky top-4 shadow-lg border border-gray-300 rounded-lg bg-white">
            <CardContent className="p-6">
              {/* Video Section */}
              <div className="aspect-video mb-4 rounded-lg overflow-hidden shadow-sm border border-gray-200 flex items-center justify-center bg-gray-50">
                <VideoPlayer
                  url={
                    getIndexOfFreePreviewUrl !== -1
                      ? studentViewCourseDetails?.curriculum[
                          getIndexOfFreePreviewUrl
                        ].videoUrl
                      : ""
                  }
                  width="100%"
                  height="220px"
                />
              </div>

              {/* Pricing */}
              <div className="mb-5 text-center">
                <span className="text-3xl font-bold text-gray-900">
                  Rs. {studentViewCourseDetails?.pricing}
                </span>
              </div>

              {/* Payment Heading */}
              <div className="text-center mb-5">
                <h2 className="text-lg font-semibold text-gray-800">
                  Buy with
                </h2>
                <p className="text-sm text-gray-600">
                  Choose your preferred payment method
                </p>
              </div>

              {/* Khalti Payment Button */}
              <button
                onClick={async () => {
                  const paymentPayload = {
                    userId: auth?.user?._id,
                    fName: auth?.user?.fName,
                    email: auth?.user?.email,
                    phone: "9800000001",
                    orderStatus: "pending",
                    paymentMethod: "khalti",
                    paymentStatus: "initiated",
                    orderDate: new Date().toISOString(),
                    paymentId: "",
                    payerId: "",
                    instructorId: studentViewCourseDetails?.instructorId,
                    instructorName: studentViewCourseDetails?.instructorName,
                    courseImage: studentViewCourseDetails?.image,
                    courseTitle: studentViewCourseDetails?.title,
                    courseId: studentViewCourseDetails?._id,
                    coursePricing: studentViewCourseDetails?.pricing,
                  };

                  try {
                    const response = await axios.post(
                      "http://localhost:8000/student/order/create-khalti",
                      paymentPayload
                    );
                    if (response.data.success) {
                      window.location.href = response.data.payment_url; // Redirect to Khalti payment URL
                    } else {
                      alert("Payment initiation failed.");
                    }
                  } catch (error) {
                    console.error(error);
                    alert("An error occurred while processing payment.");
                  }
                }}
                className="w-auto h-auto mx-auto flex"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/e/ee/Khalti_Digital_Wallet_Logo.png.jpg"
                  alt="Khalti Logo"
                  className="w-32 h-auto"
                />
              </button>

              {/* OR Divider */}
              <div className="flex items-center my-5 justify-center relative">
                <hr className="w-full border-t border-gray-300" />
                <span className="absolute px-2 bg-white text-gray-500">OR</span>
              </div>

              {/* PayPal Payment Button */}
              <button
                className="w-auto h-auto mx-auto flex"
                onClick={handleCreatePayment}
              >
                <img
                  src="https://images.ctfassets.net/drk57q8lctrm/21FLkQ2lbOCWynXsDZvXO5/485a163f199ef7749b914e54d4dc3335/paypal-logo.webp"
                  alt="PayPal Logo"
                  className="w-32 h-auto"
                />
              </button>
            </CardContent>
          </Card>
        </aside>
      </div>

      <Dialog
        open={showFreePreviewDialog}
        onOpenChange={() => {
          setShowFreePreviewDialog(false);
          setDisplayCurrentVideoFreePreview(null);
        }}
      >
        <DialogContent className="w-[800px]">
          <DialogHeader>
            <DialogTitle>Course Preview</DialogTitle>
          </DialogHeader>
          <div className="aspect-video rounded-lg flex items-center justify-center">
            <VideoPlayer
              url={displayCurrentVideoFreePreview}
              width="450px"
              height="200px"
            />
          </div>
          <div className="flex flex-col gap-2">
            {studentViewCourseDetails?.curriculum
              ?.filter((item) => item.freePreview)
              .map((filteredItem) => (
                <p
                  onClick={() => handleSetFreePreview(filteredItem)}
                  className="cursor-pointer text-[16px] font-medium"
                >
                  {filteredItem?.title}
                </p>
              ))}
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseDetailsPage;
