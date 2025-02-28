import React, { useState } from "react";
import axios from "axios";
import { useForm, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const AdminQuizPanel = () => {
  const [quizSetId, setQuizSetId] = useState(null);
  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      title: "",
      category: "",
      description: "",
      questions: [{ question: "", options: ["", "", "", ""], correctAnswer: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const createQuizSet = async (data) => {
    try {
      const response = await axios.post("http://localhost:8000/instructor/quiz/create", data);
      setQuizSetId(response.data.data._id);
    } catch (error) {
      console.error("Error creating quiz set", error);
    }
  };

  const addQuestions = async (data) => {
    try {
      await axios.post("http://localhost:8000/instructor/question/add", {
        quizSetId,
        questions: data.questions,
      });
      alert("Quiz Set & Questions Added Successfully");
      reset();
      setQuizSetId(null);
    } catch (error) {
      console.error("Error adding questions", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {!quizSetId ? (
        <Card className="p-6">
          <h2 className="text-xl font-bold">Create Quiz Set</h2>
          <form onSubmit={handleSubmit(createQuizSet)} className="space-y-4">
            <Input {...register("title", { required: true })} placeholder="Quiz Title" />
            <Input {...register("category", { required: true })} placeholder="Category" />
            <Input {...register("description", { required: true })} placeholder="Description" />
            <Button type="submit" className="w-full">Create Quiz Set</Button>
          </form>
        </Card>
      ) : (
        <Card className="p-6">
          <h2 className="text-xl font-bold">Add Questions</h2>
          <form onSubmit={handleSubmit(addQuestions)} className="space-y-4">
            {fields.map((item, index) => (
              <div key={item.id} className="p-4 border rounded space-y-2">
                <Input {...register(`questions.${index}.question`, { required: true })} placeholder="Question" />
                {item.options.map((_, optIndex) => (
                  <Input
                    key={optIndex}
                    {...register(`questions.${index}.options.${optIndex}`, { required: true })}
                    placeholder={`Option ${optIndex + 1}`}
                  />
                ))}
                <Input
                  {...register(`questions.${index}.correctAnswer`, { required: true })}
                  type="number"
                  placeholder="Correct Option Index (0-3)"
                />
                <Button type="button" onClick={() => remove(index)} className="bg-red-500">Remove Question</Button>
              </div>
            ))}
            <Button type="button" onClick={() => append({ question: "", options: ["", "", "", ""], correctAnswer: 0 })}>
              + Add Question
            </Button>
            <Button type="submit" className="w-full bg-green-500">Submit Questions</Button>
          </form>
        </Card>
      )}
    </div>
  );
};

export default AdminQuizPanel;
