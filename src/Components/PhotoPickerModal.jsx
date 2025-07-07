// PhotoPickerModal.jsx
import React, { useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Stack,
} from "@mui/material";

const PhotoPickerModal = ({ open, onClose, onPick }) => {
  const cameraRef = useRef();
  const galleryRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onPick(imageUrl); // ✅ Pass picked image back
      onClose(); // ✅ Close modal
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            zIndex: 20000, // Make sure it's above your Konva editor (zIndex: 9999)
          },
        },
      }}
      sx={{
        zIndex: 20000, // Also apply directly to Dialog as a fallback
      }}
    >
      <DialogTitle>Select Image</DialogTitle>
      <DialogContent>
        <Stack spacing={2} direction="column" sx={{ mt: 1 }}>
          <Button
            variant="contained"
            onClick={() => cameraRef.current?.click()}
          >
            📷 Take Photo
          </Button>
          <Button
            variant="outlined"
            onClick={() => galleryRef.current?.click()}
          >
            🖼️ Choose from Gallery
          </Button>
        </Stack>

        {/* Hidden File Inputs */}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={cameraRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <input
          type="file"
          accept="image/*"
          ref={galleryRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PhotoPickerModal;
