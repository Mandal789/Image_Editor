// src/components/WebcamCapture.jsx
import { useEffect, useRef, useState } from "react";
import { Box, Button, Stack } from "@mui/material";

function WebcamCapture({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  // Start webcam stream
  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Webcam access error:", err);
        alert("Could not access webcam. Please check permissions or connect a camera.");
        onClose();
      }
    };

    startCamera();

    return () => {
      stopCamera();
    };
  }, [onClose]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const handleTakePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");

    stopCamera(); // ✅ Stop webcam stream
    onCapture(dataUrl);
  };

  const handleCancel = () => {
    stopCamera(); // ✅ Stop webcam stream
    onClose();
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 600,
        margin: "auto",
        mt: 3,
        p: 2,
        border: "2px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#fafafa",
        textAlign: "center",
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: "100%", borderRadius: "4px" }}
      />

      <canvas ref={canvasRef} style={{ display: "none" }} />

      <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
        <Button variant="contained" color="primary" onClick={handleTakePhoto}>
          📸 Take Photo
        </Button>
        <Button variant="outlined" color="error" onClick={handleCancel}>
          ❌ Cancel
        </Button>
      </Stack>
    </Box>
  );
}

export default WebcamCapture;
