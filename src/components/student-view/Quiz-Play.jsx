import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const QuizPlay = () => {
  const { quizSetId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 1-minute timer
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

  // Timer logic: stops when quiz is submitted
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

  const handleNextQuestion = () => {
    const correctAnswer = questions[currentIndex].correctAnswer;

    if (selectedAnswer === correctAnswer) {
      setScore(score + 1);
    } else {
      setWrongAnswers([
        ...wrongAnswers,
        {
          question: questions[currentIndex].question,
          options: questions[currentIndex].options,
          selectedIndex: selectedAnswer,
          correctIndex: correctAnswer,
        },
      ]);
    }

    setSelectedAnswer(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleSubmit(); // Submit when last question is answered
    }
  };

  // Handles quiz submission (stops timer, enables review)
  const handleSubmit = () => {
    setTimerRunning(false); // Stop timer
    setShowResults(true);

    // Store unanswered questions as wrong but without a red mark
    questions.forEach((q, index) => {
      if (!wrongAnswers.find((w) => w.question === q.question) && index >= currentIndex) {
        wrongAnswers.push({
          question: q.question,
          options: q.options,
          selectedIndex: null, // No selection
          correctIndex: q.correctAnswer,
        });
      }
    });
  };

  const handleNextMistake = () => {
    if (reviewIndex + 1 < wrongAnswers.length) {
      setReviewIndex(reviewIndex + 1);
    } else {
      setReviewMode(false); // Exit review mode when done
    }
  };

  if (questions.length === 0) {
    return <p className="text-center text-gray-500">Loading questions...</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6 flex flex-col items-center">
      {/* Show Progress & Timer */}
      <div className="flex justify-between items-center w-full max-w-lg">
        <h2 className="text-xl font-semibold">
          Question {currentIndex + 1} of {questions.length}
        </h2>
        {!showResults && (
          <p className="text-xl font-semibold text-red-600">
            ⏳ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
          </p>
        )}
      </div>

      {/* Quiz Mode */}
      {!showResults && !reviewMode && (
        <div className="bg-white shadow-lg p-6 rounded-lg w-full max-w-lg mt-4">
          <h3 className="text-xl font-semibold mb-4">{questions[currentIndex].question}</h3>
          <div className="space-y-2">
            {questions[currentIndex].options.map((option, index) => (
              <button
                key={index}
                className={`block w-full text-left p-3 border rounded-lg ${
                  selectedAnswer === index
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => setSelectedAnswer(index)}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded w-full"
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
          >
            {currentIndex + 1 === questions.length ? "Finish Quiz" : "Next Question"}
          </button>
        </div>
      )}

      {/* Show Final Score */}
      {showResults && !reviewMode && (
        <div className="text-center">
          <h3 className="text-3xl font-semibold">Quiz Completed!</h3>
          <p className="text-lg mt-3">
            Your Score: <span className="font-bold">{score} / {questions.length}</span>
          </p>

          {wrongAnswers.length > 0 ? (
            <button
              className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
              onClick={() => {
                setReviewMode(true);
                setReviewIndex(0);
              }}
            >
              Review Mistakes
            </button>
          ) : (
            <button
              className="mt-6 bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded"
              onClick={() => navigate("/")}
            >
              Back to Quiz List
            </button>
          )}
        </div>
      )}

      {/* Review Mode */}
      {reviewMode && (
        <div className="bg-white shadow-lg p-6 rounded-lg w-full max-w-lg">
          <h3 className="text-xl font-semibold text-red-600 mb-4">Review Mistakes</h3>
          <p className="font-semibold text-lg">{wrongAnswers[reviewIndex].question}</p>

          <div className="mt-4 space-y-3">
            {wrongAnswers[reviewIndex].options.map((option, i) => (
              <div
                key={i}
                className={`flex justify-between items-center p-4 rounded-lg text-lg font-semibold border-2 ${
                  i === wrongAnswers[reviewIndex].correctIndex
                    ? "bg-green-500 text-white border-green-700" // Correct ✅
                    : i === wrongAnswers[reviewIndex].selectedIndex
                    ? "bg-red-500 text-white border-black" // Wrong ❌
                    : "bg-gray-300 text-gray-800 border-gray-400" // Neutral (Gray)
                }`}
              >
                <span>{option}</span>
                {i === wrongAnswers[reviewIndex].correctIndex ? (
                  <span className="text-xl font-bold">✅</span>
                ) : i === wrongAnswers[reviewIndex].selectedIndex ? (
                  <span className="text-xl font-bold text-black">❌</span>
                ) : null}
              </div>
            ))}
          </div>

          <button
            className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded w-full"
            onClick={handleNextMistake}
          >
            {reviewIndex + 1 === wrongAnswers.length ? "Finish Review" : "Next Mistake"}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizPlay;
