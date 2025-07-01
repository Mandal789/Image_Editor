// ✅ Updated QRScanner.jsx to use @capacitor-community/barcode-scanner instead of html5-qrcode

import { useEffect, useState } from "react";
import {
  Container,
  Box,
  Stack,
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

  const handleManualSubmit = () => {
    const input = manualInput.trim();
    if (input && !scannedTags.includes(input)) {
      const updated = [...scannedTags, input];
      setScannedTags(updated);
      setManualInput("");

      if (updated.length >= 10) {
        handleDone(updated);
      }
    }
  };

  const handleDone = (finalTags = scannedTags) => {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    setShowScanner(false);
    onDone(finalTags);
  };

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Scan QR Codes (Max 10)
      </Typography>

      {showScanner && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Camera scanning active. Point to QR.
        </Typography>
      )}

      <Box mt={2}>
        <TextField
          fullWidth
          size="small"
          label="Enter Tagno manually"
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
        />
        <Button
          fullWidth
          sx={{ mt: 1 }}
          variant="contained"
          color="success"
          onClick={handleManualSubmit}
        >
          ➕ Add Tagno
        </Button>
      </Box>

      {scannedTags.length > 0 && (
        <Box mt={2}>
          <Typography>Scanned ({scannedTags.length}/10):</Typography>
          {scannedTags.map((tag, idx) => (
            <Typography key={idx}>🔹 {tag}</Typography>
          ))}
        </Box>
      )}

      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 3 }}
        color="primary"
        onClick={() => handleDone()}
      >
        ✅ Done ({scannedTags.length})
      </Button>
    </Container>
  );
}

export default QRScanner;
