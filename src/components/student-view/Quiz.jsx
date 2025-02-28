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
    return <p className="text-center text-gray-600">Loading quizzes...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Available Quiz Sets</h2>
      {quizSets.length === 0 ? (
        <p className="text-center text-gray-600">No quiz sets available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {quizSets.map((quiz) => (
            <Link to={`/quiz/${quiz._id}`} key={quiz._id}>
              <div className="bg-white shadow-lg p-8 rounded-xl cursor-pointer hover:shadow-2xl hover:bg-gray-300 transition duration-300 border border-gray-500 text-center transform hover:scale-105">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{quiz.title}</h3>
                <p className="text-gray-700 text-lg">
                  <strong>Category:</strong> {quiz.category}
                </p>
                <p className="text-gray-600 mt-2 text-sm">{quiz.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizList;