import { useEffect, useState, useRef } from "react";
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

function ChildComponent() {
  const [tagnos, setTagnos] = useState([]);
  const [manualInput, setManualInput] = useState("");
  const [apiBaseURL, setApiBaseURL] = useState("");
  const [showIPPrompt, setShowIPPrompt] = useState(false);
  const [inputIP, setInputIP] = useState("192.168.0.458:1234");
  const [invalidTags, setInvalidTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [plusLoading, setPlusLoading] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const bottomRef = useRef(null);
  const [plusCount, setPlusCount] = useState(1);
  const [home, sethome] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const savedIP = localStorage.getItem("api_ip");
    if (!savedIP) {
      setShowIPPrompt(true);
      sethome(false);
    } else initializeApp(savedIP);
  }, []);

  const initializeApp = async (ip) => {
    const fullURL = `http://${ip}/test_android1/index.php`;
    try {
      const res = await fetch(`${fullURL}?action=getRFIDDataalpha_new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tagno: ["100,2219"], cust_id: 0 }),
      });
      const data = await res.json();
      console.log("startcheck",data);
      setApiBaseURL(fullURL);
      setShowIPPrompt(false);
      sethome(true);
      localStorage.setItem("api_ip", ip);
    } catch (err) {
      console.log(err);
      localStorage.removeItem("api_ip");
      setLoading(false);
      setShowIPPrompt(true);
      sethome(false);
      setTagnos([]);
      alert("API not reachable");
    }
  };
  const runCheckIp = () => {
    const savedIP = localStorage.getItem("api_ip");
    if (!savedIP) {
      setShowIPPrompt(true);
      sethome(false);
    } else initializeApp(savedIP);
  };
  const validateAndAddTags = async (tagArray) => {
    runCheckIp();
    const validated = [];
    const invalid = [];
    setLoading(true);

    await Promise.all(
      tagArray.map(async (tag) => {
        console.log("hiii");
        
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
    const input = manualInput.trim();
    if (!input) {
      setInvalidTags(["Please enter tagno"]);
      return;
    }
    const split = input.split(/[\,\s]+/).filter(Boolean);
    await validateAndAddTags(split);
    setManualInput("");
  };
  ///////////////********************handle plus button************************///
  const handlePlus = async () => {
    //console.log("jhg", tagnos);

    if (tagnos.length === 0) return;
    setPlusLoading(true);

    try {
      const lastTag = tagnos[tagnos.length - 1].tagno;
      let trialCount = 0;
      let found = false;

      const isAlpha = isNaN(Number(lastTag));
      const getNextAlphaTag = (tag, increment) => {
        const prefix = tag.slice(0, -1);
        const lastChar = tag.slice(-1);
        const nextChar = String.fromCharCode(
          lastChar.charCodeAt(0) + increment
        );
        return prefix + nextChar;
      };

      const getNextNumericTag = (tag, increment) => {
        return (parseInt(tag) + increment).toString();
      };

      while (!found && trialCount < 10) {
        const trialTag = isAlpha
          ? getNextAlphaTag(lastTag, plusCount + trialCount)
          : getNextNumericTag(lastTag, plusCount + trialCount);

        const res = await fetch(`${apiBaseURL}?action=getRFIDDataalpha_new`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tagno: [trialTag], cust_id: 0 }),
        });

        const data = await res.json();

        if (data.message?.length) {
          const item = data.message.length === 2 ? data.message[1] : data;
          setTagnos((prev) => [...prev, { tagno: trialTag, item }]);
          setPlusCount(1);
          found = true;
          setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 300);
        } else {
          trialCount++;
        }
      }

      if (!found) {
        setPlusCount((prev) => prev + trialCount);
      }
    } catch (err) {
      console.error("Error in handlePlus:", err);
    } finally {
      setPlusLoading(false); // ✅ always stop loading
    }
  };
  //************************************************************************ */
  const handleMinus = (tagToRemove) => {
    setTagnos((prev) => prev.filter((obj) => obj.tagno !== tagToRemove));
  };

  const openQRScanner = () => {
    setShowQRScanner(true);
    sethome(false);
  };
  const handleQRScannerDone = (scannedTagnos) => {
    setShowQRScanner(false);
    sethome(true);
    if (scannedTagnos?.length) {
      validateAndAddTags(scannedTagnos);
    }
  };
  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      {home && (
        <Grow in timeout={800}>
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
        </Grow>
      )}

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

      {home && (
        <>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Button variant="contained" onClick={() => openQRScanner()}>
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
            <Button
              variant="contained"
              color="success"
              onClick={handleManualSubmit}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Search"
              )}
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
                {plusLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "➕ Add Next"
                )}
              </Button>
            </Stack>
          )}
        </>
      )}

      <Dialog
        open={showQRScanner}
        fullWidth
        maxWidth={false}
        slots={{ paper: "div" }}
        slotProps={{
          paper: {
            style: {
              width: "100%",
              maxWidth: "800px",
              margin: "8px",
              borderRadius: "16px",
            },
          },
        }}
      >
        <QRScanner onDone={handleQRScannerDone} />
      </Dialog>
    </Container>
  );
}

export default ChildComponent;
