import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const QuizList = () => {
  const [quizSets, setQuizSets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/instructor/quiz")
      .then((response) => {
        if (response.data.success) {
          setQuizSets(response.data.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching quiz sets:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading quizzes...</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Available Quiz Sets</h2>
      {quizSets.length === 0 ? (
        <p className="text-center text-gray-600">No quiz sets available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {quizSets.map((quiz) => (
            <Link to={`/quiz/${quiz._id}`} key={quiz._id}>
              <div className="bg-white shadow-lg p-6 rounded-lg cursor-pointer hover:shadow-xl transition duration-300">
                <h3 className="text-xl font-semibold">{quiz.title}</h3>
                <p className="text-gray-700 mt-2">
                  <strong>Category:</strong> {quiz.category}
                </p>
                <p className="text-gray-600 mt-1">{quiz.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizList;
