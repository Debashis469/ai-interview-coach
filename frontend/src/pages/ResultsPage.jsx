// src/pages/ResultsPage.jsx

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
} from "@mui/material";

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { analysis } = location.state || {};

  if (!analysis) {
    return (
      <Box textAlign="center" p={4}>
        <Typography variant="h6">
          No results available. Please complete an interview first.
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate("/")}
        >
          Go to Home
        </Button>
      </Box>
    );
  }

  // Helper function to format the key names nicely
  const formatKey = (key) => {
    return key
      .replace(/([A-Z])/g, " $1") // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
  };

  return (
    <Box textAlign="center" p={4}>
      <Typography variant="h4" mb={3}>
        🎉 Interview Results
      </Typography>

      <Card
        sx={{ maxWidth: 600, margin: "auto", borderRadius: 4, boxShadow: 3 }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Detailed Analysis:
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {Object.entries(analysis).map(([key, value]) => (
            <Box key={key} mb={2} textAlign="left">
              <Typography variant="subtitle1" fontWeight="bold">
                {formatKey(key)}:
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                {value}
              </Typography>
            </Box>
          ))}
        </CardContent>
      </Card>

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 4 }}
        onClick={() => navigate("/")}
      >
        Back to Home
      </Button>
    </Box>
  );
};

export default ResultsPage;
