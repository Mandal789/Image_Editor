import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";

function QRScanner({ onDone }) {
  const [manualInput, setManualInput] = useState("");
  const [scannedTags, setScannedTags] = useState([]);
  const [showScanner, setShowScanner] = useState(true);

  useEffect(() => {
    const startScan = async () => {
      await BarcodeScanner.checkPermission({ force: true });
      BarcodeScanner.hideBackground();
      const result = await BarcodeScanner.startScan();

      if (result.hasContent) {
        const tag = result.content;
        if (tag && !scannedTags.includes(tag)) {
          const updated = [...scannedTags, tag];
          setScannedTags(updated);

          if (updated.length >= 10) {
            handleDone(updated);
          }
        }
      }
    };

    if (showScanner) {
      startScan();
    }

    return () => {
      BarcodeScanner.showBackground();
      BarcodeScanner.stopScan();
    };
  }, [showScanner, scannedTags]);

  // const handleManualSubmit = () => {
  //   const input = manualInput.trim();
  //   if (input && !scannedTags.includes(input)) {
  //     const updated = [...scannedTags, input];
  //     setScannedTags(updated);
  //     setManualInput("");

  //     if (updated.length >= 10) {
  //       handleDone(updated);
  //     }
  //   }
  // };

  const handleDone = (finalTags = scannedTags) => {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    setShowScanner(false);
    onDone(finalTags);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        background: "transparent",
        pointerEvents: "none", // allow camera to remain interactive
      }}
    >
      {/* Bottom UI Panel */}
      <Box
        sx={{
          background: "rgba(0, 0, 0, 0.75)",
          color: "white",
          p: 2,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          pointerEvents: "auto", // make content clickable
        }}
      >
        <Typography variant="h6" gutterBottom>
          Scan QR Codes (Max 10)
        </Typography>

        {showScanner && (
          <Typography variant="body2" sx={{ mb: 1 }}>
            📷 Scanning active. Point to a QR code.
          </Typography>
        )}

        {scannedTags.length > 0 && (
          <Box sx={{ mb: 1 }}>
            <Typography>Scanned ({scannedTags.length}/10):</Typography>
            {scannedTags.map((tag, idx) => (
              <Typography key={idx} sx={{ fontSize: "0.9rem" }}>
                🔹 {tag}
              </Typography>
            ))}
          </Box>
        )}

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => handleDone()}
        >
          ✅ Done ({scannedTags.length})
        </Button>
      </Box>
    </Box>
  );
}

export default QRScanner;
