import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Button,
  Dialog,
  DialogContent,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useRef, useState } from "react";
import EditImage from "./EditImage";
import PhotoPickerModal from "./PhotoPickerModal";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
// Hook to check if image URL works
const useImageExists = (url) => {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!url) {
      setIsValid(false);
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;

    img.onload = () => setIsValid(true);
    img.onerror = () => setIsValid(false);

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [url]);

  return isValid;
};

const ItemDetail = ({ tagno, item, onRemove }) => {
  const message = item?.message?.[0];
  const originalUrl = message?.blobUrl;
  // const originalUrl = message?.blobUrl
  // ? `${message.blobUrl}?v=${Date.now()}`
  // : null;

  const [safeBlobUrl, setSafeBlobUrl] = useState(null);
  const [loadingImage, setLoadingImage] = useState(true);
  const [editingImage, setEditingImage] = useState(null);
  const [updatedImage, setUpdatedImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  //const cameraInputRef = useRef(null); // 👈 for Add Image button

  // Fetch remote image and convert to local blob URL
  useEffect(() => {
    if (!originalUrl) {
      setSafeBlobUrl(null);
      setLoadingImage(false);
      return;
    }

    setLoadingImage(true); // Start loading

    fetch(originalUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const localUrl = URL.createObjectURL(blob);
        setSafeBlobUrl(localUrl);
        setLoadingImage(false); // Done loading
      })
      .catch((err) => {
        console.error("Failed to fetch image as blob:", err);
        setLoadingImage(false); // Done loading (error)
      });
  }, [originalUrl]);

  let hasValidImage = useImageExists(safeBlobUrl);
  //console.log(hasValidImage);

  const handleSaveEditedImage = (finalImg) => {
     //setLoadingImage(false);
    setUpdatedImage(finalImg);
    hasValidImage = true;
    setEditingImage(null);
   
  };

  const handlePhotoCapture = (dataUrl) => {
    setEditingImage(dataUrl);
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2}>
          {/* ✅ Image Box */}
          {loadingImage ? (
            <Box
              sx={{
                width: 100,
                height: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f5f5f5",
                borderRadius: 1,
              }}
            >
              <CircularProgress size={24} />
            </Box>
          ) : hasValidImage && (updatedImage || originalUrl) ? (
            <Box
              sx={{
                width: 100,
                height: 100,
                flexShrink: 0,
                borderRadius: 1,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f5f5f5",
                cursor: "pointer",
              }}
              onClick={() => setShowPreview(true)}
            >
              <img
                src={updatedImage || originalUrl}
                alt="item"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            </Box>
          ) : null}

          {/* ✅ Details */}
          <Box flexGrow={1}>
            <Typography variant="subtitle1" fontWeight="bold">
              Tag No: {tagno.toUpperCase()}
            </Typography>
            {message ? (
              <>
                <Typography>Name: {message.itemtype_name}</Typography>
                <Typography>Design: {message.designName}</Typography>
                <Typography>
                  Weight: {parseFloat(message.gross_orig).toFixed(3)} Gms
                </Typography>
              </>
            ) : (
              <Typography color="error">Item Not Found</Typography>
            )}

            {/* ✅ Conditional Buttons */}
            {!loadingImage && hasValidImage ? (
              <Button
                variant="outlined"
                size="small"
                sx={{ mt: 1 }}
                onClick={() => setEditingImage(updatedImage || safeBlobUrl)}
              >
                Edit Image
              </Button>
            ) : (
              !loadingImage && (
                // <>
                //   <Button
                //     variant="outlined"
                //     size="small"
                //     sx={{ mt: 1 }}
                //     onClick={() => cameraInputRef.current?.click()}
                //   >
                //     Add Image
                //   </Button>
                //   <input
                //     type="file"
                //     accept="image/*"
                //     capture="environment"
                //     ref={cameraInputRef}
                //     style={{ display: "none" }}
                //     onChange={(e) =>
                //       e.target.files?.[0] &&
                //       handlePhotoCapture(URL.createObjectURL(e.target.files[0]))
                //     }
                //   />
                // </>
                <>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mt: 1 }}
                    onClick={() => setShowPicker(true)}
                  >
                    Add Image
                  </Button>

                  <PhotoPickerModal
                    open={showPicker}
                    onClose={() => setShowPicker(false)}
                    onPick={handlePhotoCapture}
                  />
                </>
              )
            )}
          </Box>

          {/* Delete */}
          <IconButton onClick={onRemove} sx={{ alignSelf: "flex-start" }}>
            <DeleteIcon color="error" />
          </IconButton>
        </Box>

        {/* ✅ Editor */}
        {editingImage && (
          <Box mt={2}>
            <EditImage
              imageSrc={editingImage}
              tag={tagno}
              itemDetails={item}
              onSave={handleSaveEditedImage}
              onCancel={() => setEditingImage(null)}
            />
          </Box>
        )}

        {/* ✅ Fullscreen Preview */}
        <Dialog
          open={showPreview}
          onClose={() => setShowPreview(false)}
          fullWidth
          maxWidth="md"
          slots={{ paper: "div" }}
          slotProps={{
            paper: {
              style: {
                background: "transparent",
                boxShadow: "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 0,
              },
            },
          }}
        >
          <DialogContent
            //onClick={() => setShowPreview(false)}
            style={{
              padding: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "rgba(0,0,0,0.85)",
            }}
          >
            <Zoom>
              <img
                src={updatedImage || originalUrl}
                alt="Preview"
                style={{
                  maxWidth: "90vw",
                  maxHeight: "90vh",
                  objectFit: "contain",
                }}
              />
            </Zoom>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ItemDetail;
