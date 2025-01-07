import axios from "axios";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/utils/useAuth";
import Course from "./Course";
import { toast } from "sonner";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const { fetchUserProfile, user } = useAuth();
  const { handleProfileUpdate } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false); // Track the dialog's open state

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Handler for the save changes button
  const handleSaveChanges = async () => {
    setIsLoading(true);
    if (!name && !profilePhoto) {
      toast("Please update the name or profile photo.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    
    if (name) formData.append("name", name); // Append name only if provided
    if (profilePhoto) formData.append("profilePhoto", profilePhoto); // Append profile photo if provided

    // Debug FormData content
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      await handleProfileUpdate(formData);
      setIsLoading(false);
      fetchUserProfile();
      setDialogOpen(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 my-24">
      <h1 className="font-bold text-2xl text-center md:text-left">PROFILE</h1>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
            <AvatarImage
              src={user?.user?.photoUrl || "https://github.com/shadcn.png"}
              alt="@shadcn"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Name:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user?.user?.name}
              </span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Email:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user?.user?.email}
              </span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Role:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user?.user?.role.toUpperCase()}
              </span>
            </h1>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="mt-2">
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Name</Label>
                  <Input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Profile Photo</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    className="col-span-3"
                    onChange={(e) => setProfilePhoto(e.target.files[0])}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button disabled={isLoading} onClick={handleSaveChanges}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                      wait
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div>
        <h1 className="font-medium text-lg">Courses you're enrolled in</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
          {user?.user?.enrolledCourses.length === 0 ? (
            <p>You are not enrolled in any course</p>
          ) : (
            user?.user?.enrolledCourses.map((course) => (
              <Course course={course} key={course._id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
