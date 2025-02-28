import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const QuizPlay = () => {
  const { quizSetId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5-minute timer (adjustable)
  const [timerRunning, setTimerRunning] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/instructor/question/${quizSetId}`)
      .then((response) => {
        if (response.data.success) {
          setQuestions(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });
  }, [quizSetId]);

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0 && timerRunning) {
      handleSubmit(); // Auto-submit when time runs out
      return;
    }

    if (timerRunning) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, timerRunning]);

  const handleAnswerSelect = (index) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: index,
    }));
  };

  const handleQuestionSelect = (index) => {
    setCurrentIndex(index);
  };

  const handleNextQuestion = () => {
    if (selectedAnswers[currentIndex] === undefined) return;

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setTimerRunning(false);
    setShowResults(true);

    let tempWrongAnswers = [];
    let tempScore = 0;

    questions.forEach((q, index) => {
      const selected = selectedAnswers[index];
      if (selected === q.correctAnswer) {
        tempScore++;
      } else {
        tempWrongAnswers.push({
          question: q.question,
          options: q.options,
          selectedIndex: selected,
          correctIndex: q.correctAnswer,
        });
      }
    });

    setScore(tempScore);
    setWrongAnswers(tempWrongAnswers);
  };

  const handleNextMistake = () => {
    if (reviewIndex + 1 < wrongAnswers.length) {
      setReviewIndex(reviewIndex + 1);
    } else {
      setReviewMode(false);
    }
  };

  if (questions.length === 0) {
    return <p className="text-center text-gray-500">Loading questions...</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6 flex">
      {/* Sidebar Navigation */}
      {!showResults && !reviewMode && (
        <div className="w-1/4 bg-white shadow-lg p-6 rounded-xl border border-gray-300 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Jump to Question
          </h3>

          <div className="grid grid-cols-5 gap-3">
            {questions.map((_, index) => (
              <button
                key={index}
                className={`w-12 h-12 flex items-center justify-center border-2 font-bold text-lg rounded-full transition-all duration-300
            ${
              index === currentIndex
                ? "bg-blue-600 text-white shadow-md scale-110"
                : selectedAnswers[index] !== undefined
                ? "bg-green-400 text-white hover:bg-green-500"
                : "bg-gray-300 text-gray-800 hover:bg-gray-400"
            }`}
                onClick={() => handleQuestionSelect(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Quiz Section */}
      <div className="flex-1 flex flex-col items-center">
        {/* Quiz Mode */}
        {!showResults && !reviewMode && (
          <div className="bg-white shadow-xl p-8 rounded-2xl w-full max-w-lg mt-1 border border-gray-300 text-center relative">
            {!showResults && (
              <p className="text-sm font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-lg shadow-sm absolute top-2 right-2">
                ⏳ {Math.floor(timeLeft / 60)}:
                {(timeLeft % 60).toString().padStart(2, "0")}
              </p>
            )}
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {questions[currentIndex].question}
            </h3>
            <div className="space-y-3">
              {questions[currentIndex].options.map((option, index) => (
                <button
                  key={index}
                  className={`block w-full text-left p-4 border rounded-lg text-lg font-medium transition duration-300 ${
                    selectedAnswers[currentIndex] === index
                      ? "bg-blue-500 text-white shadow-lg scale-105"
                      : "bg-gray-200 hover:bg-gray-400 hover:text-white"
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition duration-300"
                onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
                disabled={currentIndex === 0}
              >
                Previous
              </button>

              <button
                className="bg-green-500 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition duration-300"
                onClick={handleNextQuestion}
                disabled={selectedAnswers[currentIndex] === undefined}
              >
                {currentIndex + 1 === questions.length ? "Finish Quiz" : "Next"}
              </button>
            </div>
          </div>
        )}

        {/* Show Final Score */}
        {showResults && !reviewMode && (
          <div className="text-center bg-white p-8 shadow-lg rounded-2xl mt-6">
            <h3 className="text-3xl font-bold text-gray-900">
              🎉 Quiz Completed!
            </h3>
            <p className="text-xl text-gray-700 mt-4">
              Your Score:{" "}
              <span className="font-bold text-green-600">
                {score} / {questions.length}
              </span>
            </p>

            {wrongAnswers.length > 0 ? (
              <button
                className="mt-6 bg-blue-500 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition duration-300"
                onClick={() => {
                  setReviewMode(true);
                  setReviewIndex(0);
                }}
              >
                Review Mistakes
              </button>
            ) : (
              <button
                className="mt-6 bg-gray-700 hover:bg-gray-900 text-white px-8 py-3 rounded-lg text-lg font-semibold transition duration-300"
                onClick={() => navigate("/")}
              >
                Back to Quiz List
              </button>
            )}
            <button
                className="mt-6 bg-gray-700 hover:bg-gray-900 text-white px-8 py-3 rounded-lg text-lg font-semibold transition duration-300"
                onClick={() => navigate("/")}
              >
                Back to Quiz List
              </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPlay;
