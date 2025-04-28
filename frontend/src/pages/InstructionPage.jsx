import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { Box, Typography, Button, IconButton } from "@mui/material";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

const InstructionPage = () => {
  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [micError, setMicError] = useState("");
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  const toggleCamera = async () => {
    if (!cameraOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraOn(true);
        setCameraError("");
        // Clean up: stop the stream when not needed to avoid memory leak
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        console.error("Camera error:", error);
        setCameraError("Camera access denied. Please allow camera permission in browser settings.");
        setCameraOn(false);
      }
    } else {
      setCameraOn(false);
    }
  };

  const toggleMic = async () => {
    if (!micOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicOn(true);
        setMicError("");
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        console.error("Microphone error:", error);
        setMicError("Microphone access denied. Please allow microphone permission in browser settings.");
        setMicOn(false);
      }
    } else {
      setMicOn(false);
    }
  };

  const handleProceed = () => {
    if (cameraOn && micOn) {
      navigate("/interview");
    } else {
      alert("Please enable both camera and microphone to proceed.");
    }
  };

  return (
    <Box
      sx={{
        padding: "20px",
        textAlign: "center",
        minHeight: "100vh",
        backgroundColor: "#fff8d1",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <LightbulbIcon sx={{ fontSize: 60, color: "#f39c12" }} />

      <Typography variant="body2" sx={{ marginTop: "5px", color: "gray" }}>
        🔏 We do not record your video or audio.
      </Typography>

      {/* Camera Preview */}
      <Box sx={{ marginTop: "20px", width: 320, height: 240, border: "2px solid #ccc", borderRadius: "10px", backgroundColor: "#000" }}>
        {cameraOn ? (
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" width="100%" height="100%" videoConstraints={{ facingMode: "user" }} />
        ) : (
          <Typography variant="body2" sx={{ color: "white", marginTop: "90px" }}>
            Camera is off
          </Typography>
        )}
      </Box>

      {/* Errors */}
      {cameraError && <Typography color="error">{cameraError}</Typography>}
      {micError && <Typography color="error">{micError}</Typography>}

      {/* Toggle Buttons */}
      <Box sx={{ marginTop: "20px", display: "flex", gap: "20px" }}>
        <IconButton
          onClick={toggleCamera}
          sx={{
            backgroundColor: cameraOn ? "green" : "red",
            color: "white",
            "&:hover": { backgroundColor: cameraOn ? "#2e7d32" : "#c62828" },
          }}
        >
          {cameraOn ? <VideocamIcon /> : <VideocamOffIcon />}
        </IconButton>

        <IconButton
          onClick={toggleMic}
          sx={{
            backgroundColor: micOn ? "green" : "red",
            color: "white",
            "&:hover": { backgroundColor: micOn ? "#2e7d32" : "#c62828" },
          }}
        >
          {micOn ? <MicIcon /> : <MicOffIcon />}
        </IconButton>
      </Box>

      {/* Proceed Button */}
      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: "30px" }}
        disabled={!cameraOn || !micOn}
        onClick={handleProceed}
      >
        Proceed to Interview
      </Button>
    </Box>
  );
};

export default InstructionPage;
