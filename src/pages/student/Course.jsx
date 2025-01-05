import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";


const Course = () => {
  return (
    <Card className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
      <div className="relative">
        <img
          src="https://www.edusoftacademy.com/s/store/courses/66c2f7cd97390914a8ddcac5/cover.jpg?v=1"
          alt="course"
          className="w-full  object-cover rounded-t-lg"
        />
      </div>
      <CardContent className="px-5 py-4 space-y-3">
        <h1 className="hover:underline font-bold text-lg truncate">
        Section Officer Full Course Bundle
        </h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={
                  "https://storage.googleapis.com/bitly-image-upload/Ioa1eHQnPYX" || "https://github.com/shadcn.png"
                }
                alt="@shadcn"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1 className="font-medium text-sm">Edusoft Academy</h1>
          </div>
          <Badge
            className={"bg-blue-600 text-white px-2 py-1 text-xs rounded-full"}
          >
            Beginner
          </Badge>
        </div>
        <div className="text-lg font-bold">
          <span>रु 20800</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default Course;
