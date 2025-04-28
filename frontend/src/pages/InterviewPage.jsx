// src/pages/InterviewPage.jsx

import React, { useRef, useState } from "react";
import { useInterviewStore } from "../store/interviewStore.js";
import { useSpeechToText } from "../utils/useSpeechToText.js";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import Webcam from "react-webcam";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const InterviewPage = () => {
  const {
    questions,
    currentQuestionIndex,
    userAnswers,
    setCurrentQuestionIndex,
    isRecording,
  } = useInterviewStore();

  const { startRecording, stopRecording } = useSpeechToText();
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleFinishInterview = async () => {
    try {
      setLoading(true); // Start loading

      const webcamImage = webcamRef.current?.getScreenshot();

      const payload = {
        questions,
        userAnswers,
        webcamImage,
      };

      const response = await axios.post(
        "http://localhost:5000/api/interview/analyze",
        payload
      );

      console.log(response.data);

      // Navigate to results page with data
      navigate("/results", { state: response.data });
    } catch (error) {
      console.error("Error submitting interview:", error);
      alert("Something went wrong while finishing the interview.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  if (!currentQuestion) {
    return (
      <Typography variant="h6">
        No questions available. Please start an interview.
      </Typography>
    );
  }

  if (loading) {
    return (
      <Box textAlign="center" p={4}>
        <CircularProgress />
        <Typography variant="h6" mt={2}>
          Analyzing your interview, please wait...
        </Typography>
      </Box>
    );
  }

  return (
    <Box textAlign="center" p={4}>
      <Typography variant="h5" mb={2}>
        Question {currentQuestionIndex + 1} of {questions.length}
      </Typography>
      <Typography variant="h6" mb={4}>
        {currentQuestion.question}
      </Typography>

      {/* Webcam */}
      <Box mb={3} display="flex" justifyContent="center">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={320}
          height={240}
        />
      </Box>

      {/* Recording Buttons */}
      <Box mb={3}>
        {!isRecording ? (
          <Button
            variant="contained"
            color="primary"
            onClick={startRecording}
            disabled={loading}
          >
            Start Recording
          </Button>
        ) : (
          <Button
            variant="contained"
            color="secondary"
            onClick={stopRecording}
            disabled={loading}
          >
            Stop Recording
          </Button>
        )}
      </Box>

      {/* Navigation Buttons */}
      <Box>
        {currentQuestionIndex < questions.length - 1 ? (
          <Button
            variant="outlined"
            color="primary"
            onClick={handleNext}
            disabled={loading}
          >
            Next Question
          </Button>
        ) : (
          <Button
            variant="contained"
            color="success"
            onClick={handleFinishInterview}
            disabled={loading}
          >
            Finish Interview
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default InterviewPage;
