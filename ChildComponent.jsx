import { useEffect, useState, useRef } from "react";
<<<<<<< HEAD
 import EditImage from "./EditImage";
//import ImageBuilder from "./ImageBuilder"
import ItemDetail from "./ItemDetail";
import QRScanner from "./QRScanner";

=======
// import EditImage from "./Editimage";
import EditImage from "./EditImage"
import ItemDetail from "./ItemDetail";
import QRScanner from "./QRScanner";
>>>>>>> a3d0e42 (Initial commit)
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
<<<<<<< HEAD
//import ImageUploder from "./ImageUploder";
=======
>>>>>>> a3d0e42 (Initial commit)

function ChildComponent() {
  const [tagnos, setTagnos] = useState([]);
  const [manualInput, setManualInput] = useState("");
  const [photoData, setPhotoData] = useState([]);
  const [editingImage, setEditingImage] = useState(null);
  const [apiBaseURL, setApiBaseURL] = useState("");
  const [showIPPrompt, setShowIPPrompt] = useState(false);
<<<<<<< HEAD
  const [inputIP, setInputIP] = useState("192.168.0.458:1234");
=======
  const [inputIP, setInputIP] = useState("");
>>>>>>> a3d0e42 (Initial commit)
  const [invalidTags, setInvalidTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [plusLoading, setPlusLoading] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const cameraInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);
  const [plusCount, setPlusCount] = useState(1);
<<<<<<< HEAD
const [input, setInput] = useState("");
const [home, sethome] = useState(true);
=======

>>>>>>> a3d0e42 (Initial commit)
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const savedIP = localStorage.getItem("api_ip");
<<<<<<< HEAD
    if (!savedIP) {
      setShowIPPrompt(true)
      sethome(false)
    }
=======
    if (!savedIP) setShowIPPrompt(true);
>>>>>>> a3d0e42 (Initial commit)
    else initializeApp(savedIP);
  }, []);

  const initializeApp = async (ip) => {
<<<<<<< HEAD
    const fullURL = `http://${ip}/test_android1/index.php`;
=======
    const fullURL = `http://${ip}:1234/test_android1/index.php`;
>>>>>>> a3d0e42 (Initial commit)
    try {
      const res = await fetch(`${fullURL}?action=getRFIDDataalpha_new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
<<<<<<< HEAD
        body: JSON.stringify({ tagno: ["100,2219"], cust_id: 0 }),
      });
      const data = await res.json();
      console.log(data);
      setInput(data)
      setApiBaseURL(fullURL);
      setShowIPPrompt(false);
      sethome(true)
=======
        body: JSON.stringify({ tagno: ["2221"], cust_id: 0 }),
      });
      const data = await res.json();
      setApiBaseURL(fullURL);
      setShowIPPrompt(false);
>>>>>>> a3d0e42 (Initial commit)
      localStorage.setItem("api_ip", ip);
    } catch {
      alert("API not reachable");
      setShowIPPrompt(true);
<<<<<<< HEAD
      sethome(false)
    }
  };
const runCheckIp = () => {
  const savedIP = localStorage.getItem("api_ip");
   if (!savedIP) {
      setShowIPPrompt(true)
      sethome(false)
    }
    else initializeApp(savedIP);
};
=======
    }
  };

>>>>>>> a3d0e42 (Initial commit)
  const validateAndAddTags = async (tagArray) => {
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
<<<<<<< HEAD
       
=======
>>>>>>> a3d0e42 (Initial commit)
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
<<<<<<< HEAD
    runCheckIp();
    setPhotoData([])
=======
>>>>>>> a3d0e42 (Initial commit)
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
<<<<<<< HEAD
    setPhotoData([])
=======
>>>>>>> a3d0e42 (Initial commit)
    if (tagnos.length === 0) return;
    setPlusLoading(true);
    const lastTag = parseInt(tagnos[tagnos.length - 1].tagno);
    let trialCount = 0;
    let found = false;

    while (!found && trialCount < 100) {
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

<<<<<<< HEAD
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
=======
  const handlePhotoCapture = (dataUrl) => {
    setEditingImage(dataUrl);
  };

  const handleSaveEditedImage = (finalImg) => {
    setPhotoData((prev) => [...prev, finalImg]);
    setEditingImage(null);
    setTagnos([]);
  };

  const handleQRScannerDone = (scannedTagnos) => {
    setShowQRScanner(false);
>>>>>>> a3d0e42 (Initial commit)
    if (scannedTagnos?.length) {
      validateAndAddTags(scannedTagnos);
    }
  };
<<<<<<< HEAD
//const imgsrc =generateEditedImage(editingImage,tagnos)
  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      {home && (<Grow in timeout={800}>
=======

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Grow in timeout={800}>
>>>>>>> a3d0e42 (Initial commit)
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
<<<<<<< HEAD
      </Grow>)}
=======
      </Grow>
>>>>>>> a3d0e42 (Initial commit)

      {showIPPrompt && (
        <Box sx={{ p: 3 }}>
          <TextField
            fullWidth
<<<<<<< HEAD
            placeholder="e.g. 192.168.0.104:1234"
=======
>>>>>>> a3d0e42 (Initial commit)
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

<<<<<<< HEAD
     {home && ( <>
      <Stack spacing={2} sx={{ mt: 2 }}>
        <Button variant="contained" onClick={() =>openQRScanner() }>
=======
      <Stack spacing={2} sx={{ mt: 2 }}>
        <Button variant="contained" onClick={() => setShowQRScanner(true)}>
>>>>>>> a3d0e42 (Initial commit)
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
<<<<<<< HEAD
          console.log(t.item),
          
=======
>>>>>>> a3d0e42 (Initial commit)
          <ItemDetail
            key={t.tagno}
            tagno={t.tagno}
            item={t.item}
            onRemove={() => handleMinus(t.tagno)}
          />
        ))}
        <div ref={bottomRef} />
      </Stack>
<<<<<<< HEAD
      
=======
>>>>>>> a3d0e42 (Initial commit)

      {tagnos.length > 0 && (
        <Stack direction="row" spacing={2} mt={2}>
          <Button onClick={handlePlus} disabled={plusLoading}>
            {plusLoading ? <CircularProgress size={20} color="inherit" /> : "➕ Add Next"}
          </Button>
        </Stack>
<<<<<<< HEAD
        
      )}</>)}

      {/*----------------------multiple image feature-----------------------*/}
{/* {tagnos.length > 0 &&(<Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={4}>
       
        <Button fullWidth variant="outlined" color="success" onClick={() => fileInputRef.current?.click()}>🖼️ Gallery</Button>
         <Button fullWidth variant="outlined" onClick={() => cameraInputRef.current?.click()}>📷 Camera</Button>
      </Stack>)}
      
=======
      )}

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={4}>
       
        <Button fullWidth variant="outlined" color="success" onClick={() => fileInputRef.current?.click()}>🖼️ Gallery</Button>
         <Button fullWidth variant="outlined" onClick={() => cameraInputRef.current?.click()}>📷 Camera</Button>
      </Stack>
>>>>>>> a3d0e42 (Initial commit)

      {editingImage && (
        <EditImage
          imageSrc={editingImage}
<<<<<<< HEAD
          itemDetails={tagnos[0].item}
=======
          itemDetails={tagnos}
>>>>>>> a3d0e42 (Initial commit)
          onSave={handleSaveEditedImage}
          onCancel={() => setEditingImage(null)}
        />
      )}
<<<<<<< HEAD
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
=======

>>>>>>> a3d0e42 (Initial commit)
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
<<<<<<< HEAD
      /> */}
=======
      />
>>>>>>> a3d0e42 (Initial commit)

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
