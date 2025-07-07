import { useEffect, useState, useRef } from "react";
 import EditImage from "./EditImage";
//import ImageBuilder from "./ImageBuilder"
import ItemDetail from "./ItemDetail";
import QRScanner from "./QRScanner";

import {
  Container,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  CircularProgress,
  Dialog,
  Grow,
  useMediaQuery,
  useTheme,
} from "@mui/material";
//import ImageUploder from "./ImageUploder";

function ChildComponent() {
  const [tagnos, setTagnos] = useState([]);
  const [manualInput, setManualInput] = useState("");
  const [photoData, setPhotoData] = useState([]);
  const [editingImage, setEditingImage] = useState(null);
  const [apiBaseURL, setApiBaseURL] = useState("");
  const [showIPPrompt, setShowIPPrompt] = useState(false);
  const [inputIP, setInputIP] = useState("192.168.0.458:1234");
  const [invalidTags, setInvalidTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [plusLoading, setPlusLoading] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const cameraInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);
  const [plusCount, setPlusCount] = useState(1);
const [input, setInput] = useState("");
const [home, sethome] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const savedIP = localStorage.getItem("api_ip");
    if (!savedIP) {
      setShowIPPrompt(true)
      sethome(false)
    }
    else initializeApp(savedIP);
  }, []);

  const initializeApp = async (ip) => {
    const fullURL = `http://${ip}/test_android1/index.php`;
    try {
      const res = await fetch(`${fullURL}?action=getRFIDDataalpha_new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tagno: ["105"], cust_id: 0 }),
      });
      const data = await res.json();
      console.log(data);
      setInput(data)
      setApiBaseURL(fullURL);
      setShowIPPrompt(false);
      sethome(true)
      localStorage.setItem("api_ip", ip);
    } catch {
      setLoading(false);
      setShowIPPrompt(true);
      sethome(false);
      setTagnos([]);
      alert("API not reachable");
    }
  };
const runCheckIp = () => {
  const savedIP = localStorage.getItem("api_ip");
  //console.log("runnn");
  
   if (!savedIP) {
      setShowIPPrompt(true)
      sethome(false)
    }
    else initializeApp(savedIP);
};
  const validateAndAddTags = async (tagArray) => {
    runCheckIp()
    const validated = [];
    const invalid = [];
    setLoading(true);

    await Promise.all(
      tagArray.map(async (tag) => {
        const res = await fetch(`${apiBaseURL}?action=getRFIDDataalpha_new`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tagno: [tag], cust_id: 0 }),
        });
        const data = await res.json();
       
        if (data.message?.length) {
          if (!tagnos.find((t) => t.tagno === tag)) {
            validated.push({ tagno: tag, item: data });
          }
        } else {
          invalid.push(tag);
        }
      })
    );

    if (validated.length > 0) {
      setTagnos((prev) => [...prev, ...validated]);
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }

    setInvalidTags(invalid);
    setLoading(false);
  };

  const handleManualSubmit = async () => {
     //runCheckIp();
    setPhotoData([])
    const input = manualInput.trim();
    if (!input) {
      setInvalidTags(["Please enter tagno"]);
      return;
    }
    const split = input.split(/[\,\s]+/).filter(Boolean);
    await validateAndAddTags(split);
    setManualInput("");
  };

  const handlePlus = async () => {
    setPhotoData([])
    if (tagnos.length === 0) return;
    setPlusLoading(true);
    const lastTag = parseInt(tagnos[tagnos.length - 1].tagno);
    let trialCount = 0;
    let found = false;

    while (!found && trialCount < 10) {
      const trialTag = (lastTag + plusCount + trialCount).toString();
      const res = await fetch(`${apiBaseURL}?action=getRFIDDataalpha_new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tagno: [trialTag], cust_id: 0 }),
      });
      const data = await res.json();

      if (data.message?.length) {
        setTagnos((prev) => [...prev, { tagno: trialTag, item: data }]);
        setPlusCount(1);
        found = true;
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 300);
      } else {
        trialCount++;
      }
    }

    if (!found) {
      setPlusCount((prev) => prev + trialCount);
    }

    setPlusLoading(false);
  };

  const handleMinus = (tagToRemove) => {
    setTagnos((prev) => prev.filter((obj) => obj.tagno !== tagToRemove));
  };

  // const handlePhotoCapture = (dataUrl) => {
  //   //console.log(tagnos[0].item);
    
  //   setEditingImage(dataUrl);
  // };

  // const handleSaveEditedImage = (finalImg) => {
  //   setPhotoData((prev) => [...prev, finalImg]);
  //   setEditingImage(null);
  //   setTagnos([]);
  // };
const openQRScanner=()=>{
setShowQRScanner(true);
sethome(false);
}
  const handleQRScannerDone = (scannedTagnos) => {
    setShowQRScanner(false);
    sethome(true);
    if (scannedTagnos?.length) {
      validateAndAddTags(scannedTagnos);
    }
  };
//const imgsrc =generateEditedImage(editingImage,tagnos)
  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      {home && (<Grow in timeout={800}>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          gutterBottom
          sx={{
            fontWeight: 700,
            textAlign: "center",
            color: "primary.main",
            letterSpacing: 1,
          }}
        >
          ADD IMAGE IN STOCK
        </Typography>
      </Grow>)}

      {showIPPrompt && (
        <Box sx={{ p: 3 }}>
          <TextField
            fullWidth
            placeholder="e.g. 192.168.0.104:1234"
            label="Enter Server IP"
            value={inputIP}
            onChange={(e) => setInputIP(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={() => inputIP.trim() && initializeApp(inputIP.trim())}
          >
            Connect
          </Button>
        </Box>
      )}

     {home && ( <>
      <Stack spacing={2} sx={{ mt: 2 }}>
        <Button variant="contained" onClick={() =>openQRScanner() }>
          📷 QR Scanner
        </Button>
        <TextField
          label="Enter Valid Tagno (comma or space separated)"
          value={manualInput}
          onChange={(e) => {
            setManualInput(e.target.value);
            setInvalidTags([]);
          }}
          error={invalidTags.length > 0}
          helperText={invalidTags.length > 0 ? invalidTags.join(", ") : ""}
        />
        <Button variant="contained" color="success" onClick={handleManualSubmit} disabled={loading}>
          {loading ? <CircularProgress size={20} color="inherit" /> : "Search"}
        </Button>
      </Stack>

      <Stack spacing={2} sx={{ mt: 3 }}>
        {tagnos.map((t) => (
          //console.log(t.item),
          
          <ItemDetail
            key={t.tagno}
            tagno={t.tagno}
            item={t.item}
            onRemove={() => handleMinus(t.tagno)}
          />
        ))}
        <div ref={bottomRef} />
      </Stack>
      

      {tagnos.length > 0 && (
        <Stack direction="row" spacing={2} mt={2}>
          <Button onClick={handlePlus} disabled={plusLoading}>
            {plusLoading ? <CircularProgress size={20} color="inherit" /> : "➕ Add Next"}
          </Button>
        </Stack>
        
      )}</>)}

      {/*----------------------multiple image feature-----------------------*/}
{/* {tagnos.length > 0 &&(<Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={4}>
       
        <Button fullWidth variant="outlined" color="success" onClick={() => fileInputRef.current?.click()}>🖼️ Gallery</Button>
         <Button fullWidth variant="outlined" onClick={() => cameraInputRef.current?.click()}>📷 Camera</Button>
      </Stack>)}
      

      {editingImage && (
        <EditImage
          imageSrc={editingImage}
          itemDetails={tagnos[0].item}
          onSave={handleSaveEditedImage}
          onCancel={() => setEditingImage(null)}
        />
      )}
      {editingImage &&
  tagnos.map((tag, index) => (
    <ImageBuilder
      key={index}
      imageSrc={editingImage}
      itemDetails={tag.item}
      onSave={handleSaveEditedImage}
      onCancel={() => setEditingImage(null)}
    />
  ))}
      {photoData.map((src, idx) => (
        <Box key={idx} mt={2}>
          <img src={src} alt="Edited" style={{ width: "100%", maxWidth: 400 }} />
        </Box>
      ))}

      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={cameraInputRef}
        style={{ display: "none" }}
        onChange={(e) =>
          e.target.files?.[0] &&
          handlePhotoCapture(URL.createObjectURL(e.target.files[0]))
        }
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={(e) =>
          e.target.files?.[0] &&
          handlePhotoCapture(URL.createObjectURL(e.target.files[0]))
        }
      /> */}

      <Dialog
        open={showQRScanner}
        fullWidth
        maxWidth={false}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: { xs: "100%", sm: 600, md: 800 },
            m: 1,
            borderRadius: 2,
          },
        }}
      >
        <QRScanner onDone={handleQRScannerDone} />
      </Dialog>
    </Container>
  );
}

export default ChildComponent;
