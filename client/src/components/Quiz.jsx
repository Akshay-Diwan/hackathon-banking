import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const Quiz = () => {
  const { t } = useTranslation();

  const questions = t("quiz.questions", { returnObjects: true });

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (selectedOption === questions[currentQuestion].answer) {
      setScore(score + 1);
    }
    setSelectedOption(null);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  if (!questions.length || !questions[currentQuestion]) return null;

  return (
    <div className="flex justify-center items-center mr-40 mt-22">
      <div className="bg-gradient-to-r from-[#0a8df1] to-[#7d0cbadb] shadow-[0_0_20px_rgba(25,162,224,0.5)] rounded-2xl p-6 w-[400px] text-center">
        {!showResult ? (
          <>
            <h2 className="text-lg font-semibold mb-4">
              {t("quiz.questionLabel", {
                current: currentQuestion + 1,
                total: questions.length,
              })}
            </h2>
            <p className="text-indigo-100 font-bold mb-6">
              {questions[currentQuestion].question}
            </p>
            <div className="flex flex-col gap-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  className={`p-3 border cursor-pointer rounded-lg transition ${
                    selectedOption === option
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <button
              onClick={handleNext}
              disabled={!selectedOption}
              className={`mt-6 w-full p-3 cursor-pointer rounded-lg text-white ${
                selectedOption ? "bg-green-500 hover:bg-green-600" : "bg-gray-400"
              }`}
            >
              {currentQuestion === questions.length - 1
                ? t("quiz.finish")
                : t("quiz.next")}
            </button>
          </>
        ) : (
          <div>
            <h2 className="text-xl font-bold">{t("quiz.completed")}</h2>
            <p className="mt-4 text-lg">
              {t("quiz.score", { score, total: questions.length })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
