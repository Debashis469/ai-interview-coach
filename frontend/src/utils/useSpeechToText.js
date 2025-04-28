import { useState, useEffect, useCallback } from "react";
import { useInterviewStore } from "../store/interviewStore.js";

export const useSpeechToText = () => {
  const [recognition, setRecognition] = useState(null);
  const { currentQuestionIndex, saveAnswer, setRecording } =
    useInterviewStore();

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recog = new SpeechRecognition();

    recog.continuous = true;
    recog.interimResults = false;
    recog.lang = "en-US";

    recog.onstart = () => setRecording(true);

    recog.onend = () => setRecording(false);

    recog.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");

      console.log("Transcript:", transcript);

      saveAnswer(currentQuestionIndex, transcript);
    };

    setRecognition(recog);
  }, [currentQuestionIndex, saveAnswer, setRecording]);

  const startRecording = useCallback(() => {
    recognition?.start();
  }, [recognition]);

  const stopRecording = useCallback(() => {
    recognition?.stop();
  }, [recognition]);

  return { startRecording, stopRecording };
};
