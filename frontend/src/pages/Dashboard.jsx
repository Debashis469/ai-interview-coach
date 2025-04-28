import React, { useState } from "react";
import { useInterviewStore } from '../store/interviewStore.js';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BeatLoader } from "react-spinners"; // Spinner
import {
  Box,
  Card,
  CardActionArea,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false); //Track Loading State
  const navigate = useNavigate(); //Used for navigation
  const { setQuestions } = useInterviewStore();

  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    techStack: "",
    experienceLevel: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStartInterview = async () => {
    setLoading(true); // Show spinner
    try {
      const response = await axios.post(
        "http://localhost:5000/api/interview/generate",
        formData
      );

      console.log("Interview Questions:", response.data);

      // ✅ Set questions in the store
      setQuestions(response.data);

      // ✅ Redirect to Instructions Page
      navigate("/instructions");
    } catch (error) {
      console.error("Error fetching interview questions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        padding: "40px",
        textAlign: "center",
        backgroundColor: "#ecf0f1",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Welcome to Interview Dashboard
      </Typography>

      <Card
        sx={{
          width: 300,
          margin: "20px auto",
          padding: "20px",
          backgroundColor: "#bdc3c7",
          cursor: "pointer",
          "&:hover": { backgroundColor: "#95a5a6" },
        }}
        onClick={() => setOpen(true)}
      >
        <CardActionArea>
          <Typography variant="h6" fontWeight="bold">
            + Create Interview
          </Typography>
        </CardActionArea>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create an Interview</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Job Title" name="jobTitle" margin="dense" value={formData.jobTitle} onChange={handleChange} />
          <TextField fullWidth label="Job Description" name="jobDescription" margin="dense" value={formData.jobDescription} onChange={handleChange} />
          <TextField fullWidth label="Tech Stack" name="techStack" margin="dense" value={formData.techStack} onChange={handleChange} />
          <TextField fullWidth label="Experience Level" name="experienceLevel" margin="dense" value={formData.experienceLevel} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="error" variant="contained">
            Cancel
          </Button>
          <Button onClick={handleStartInterview} color="primary" variant="contained" disabled={loading}>
            {loading ? <BeatLoader color="white" size={8} /> : "Start Interview"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
