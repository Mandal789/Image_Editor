import React, { useRef, useState, useEffect } from "react";
import Konva from "konva";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Text,
  Rect,
  Group,
  Transformer,
} from "react-konva";
import useImage from "use-image";
import { Box, Button, IconButton } from "@mui/material";
import CropIcon from "@mui/icons-material/Crop";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "react-profile/themes/dark";
import { openEditor } from "react-profile";
import { CircularProgress, Zoom } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PhotoPickerModal from "./PhotoPickerModal";
//import logo from "./Ajclogo.jpeg"
import logo from "./watermark logo.png"
const EditImage = ({ tag, imageSrc, itemDetails, onSave, onCancel }) => {
  // ---------------------------------------------------------------------
  // 1.  LOGO LOAD (original + transparent version)
  //console.log("edit");

  // ---------------------------------------------------------------------
  // const logoUrl = `https://kumuduorderapp.blob.core.windows.net/logo/${
  //   itemDetails?.message[0].store_id
  // }-${itemDetails?.message[0].branch_id.toLowerCase()}.jpeg`;
  const logoUrl = `https://kumuduorderapp.blob.core.windows.net/logo/804-jjj.jpeg`;
const watermark=logo
  const [originalLogo] = useImage(logoUrl, "Anonymous");
  const transparentLogo = useTransparentLogo(logoUrl); // ⬅️ improved
  //const [useTransparent, setUseTransparent] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const [watermarkImage] = useImage(watermark, "Anonymous");
const [showWatermark, setShowWatermark] = useState(!!watermark);

  const logoImage = logoUrl
    ? transparentLogo
    : originalLogo;

  // ---------------------------------------------------------------------
  // 2.  MAIN IMAGE + STAGE
  // ---------------------------------------------------------------------
  const [mainImageSrc, setMainImageSrc] = useState(imageSrc);
  const [mainImage] = useImage(mainImageSrc);

  const stageRef = useRef();
  const mainImgRef = useRef();
  const textRef = useRef();
  const logoRef = useRef();
  const trRef = useRef();
  //const cameraInputRef = useRef(null);
  //const fileInputRef = useRef(null);
  const [showEditor, setShowEditor] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  // base size constants
  const BASE_TEXT_WIDTH = 120;//120
  const BASE_TEXT_HEIGHT = 75;//75
  const BASE_FONT_SIZE =16 ;

  const MIN_STICKER_W = 10;
  const MIN_STICKER_H = 40;
  const MIN_FONT = 4;

  const [textSize, setTextSize] = useState({
    width: BASE_TEXT_WIDTH,
    height: BASE_TEXT_HEIGHT,
  });
  const [textFontSize, setTextFontSize] = useState(BASE_FONT_SIZE);

  const [logoSize, setLogoSize] = useState({ width: 76, height: 60 });

  const [textPosition, setTextPosition] = useState({ x: 50, y: 350 });
  const [logoPosition, setLogoPosition] = useState({ x: 20, y: 20 });

  const STAGE_WIDTH = window.innerWidth;
  const STAGE_HEIGHT = window.visualViewport?.height || window.innerHeight;

  // ---------------------------------------------------------------------
  // 3.  Transparent‑logo helper  (unchanged)
  // ---------------------------------------------------------------------
  function useTransparentLogo(url) {
    const [image, setImage] = useState(null);

    useEffect(() => {
      if (!url) return;
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(img, 0, 0);
        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        const THRESH = 225;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i] > THRESH && data[i + 1] > THRESH && data[i + 2] > THRESH)
            data[i + 3] = 0;
        }
        ctx.putImageData(imgData, 0, 0);

        imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imgData.data;
        const w = canvas.width;
        const h = canvas.height;
        const idx = (x, y) => 4 * (y * w + x);
        for (let y = 1; y < h - 1; y++) {
          for (let x = 1; x < w - 1; x++) {
            const i = idx(x, y);
            if (d[i + 3] === 0) continue;
            let clear = false;
            for (let dy = -1; dy <= 1 && !clear; dy++) {
              for (let dx = -1; dx <= 1; dx++) {
                const n = idx(x + dx, y + dy);
                if (d[n + 3] === 0) {
                  clear = true;
                  break;
                }
              }
            }
            if (clear && d[i] > 200 && d[i + 1] > 200 && d[i + 2] > 200)
              d[i + 3] = 0;
          }
        }
        ctx.putImageData(imgData, 0, 0);

        const t = new Image();
        t.src = canvas.toDataURL();
        t.onload = () => setImage(t);
      };
    }, [url]);

    return image;
  }

  // ---------------------------------------------------------------------
  // 4.  Fit main image and set initial sticker / logo positions once
  // ---------------------------------------------------------------------
  const getFittedImageProps = () => {
    if (!mainImage) return null;

    const scale = Math.min(
      STAGE_WIDTH / mainImage.width,
      STAGE_HEIGHT / mainImage.height,
      1
    );
    const w = mainImage.width * scale;
    const h = mainImage.height * scale;
    const x = (STAGE_WIDTH - w) / 2;
    const y = (STAGE_HEIGHT - h) / 2;
    return { width: w, height: h, x, y };
  };
  const imageProps = getFittedImageProps();

  const didInitPos = useRef(false);
  // useEffect(() => {
  //   if (imageProps && !didInitPos.current) {
  //     didInitPos.current = true;
  //     setLogoPosition({
  //       x: imageProps.x + 1, //prev-->20
  //       y: imageProps.y + imageProps.height - logoSize.height - 1, //prev-->20
  //     });
  //     setTextPosition({
  //       x: imageProps.x + imageProps.width - textSize.width - 8, //prev-->20
  //       y: imageProps.y + imageProps.height - textSize.height - 10, //prev-->20
  //     });
  //   }
  // }, [imageProps, logoSize.height, textSize.width, textSize.height]);

 useEffect(() => {
  if (imageProps && !didInitPos.current) {
    didInitPos.current = true;

    // ✅ Logo to Top-Right
    setLogoPosition({
      x: imageProps.x + imageProps.width - logoSize.width-15,
      y: imageProps.y + 5,
    });

    // ✅ Text to Bottom-Left
    setTextPosition({
      x: imageProps.x + 10,
      y: imageProps.y + imageProps.height - textSize.height - 10,
    });
  }
}, [imageProps, logoSize.width, logoSize.height, textSize.width, textSize.height]);


  // ---------------------------------------------------------------------
  // 5.  Transformer selection
  // ---------------------------------------------------------------------
  useEffect(() => {
    const tr = trRef.current;
    if (!tr) return;
    if (selectedId === "text" && textRef.current) {
      tr.nodes([textRef.current]);
    } else if (selectedId === "logo" && logoRef.current) {
      tr.nodes([logoRef.current]);
    } else {
      tr.nodes([]);
    }
    tr.getLayer()?.batchDraw();
  }, [selectedId]);

  // ---------------------------------------------------------------------
  // 6.  EXPORT / CROP (unchanged)
  // ---------------------------------------------------------------------
  const handleExport = () => {
    if (!imageProps) return;
    const { x, y, width, height } = imageProps;
    return stageRef.current.toDataURL({
      pixelRatio: 2,
      x,
      y,
      width,
      height,
    });
  };

  const handleCropDone = async () => {
    try {
      setShowEditor(false);
      const result = await openEditor({ src: mainImageSrc });
      const editedImage = result?.editedImage?.getDataURL();
      if (editedImage) {
        didInitPos.current = false;
        setMainImageSrc(editedImage);
      }
    } catch (err) {
      console.error("Image crop failed:", err);
    } finally {
      setShowEditor(true);
    }
  };
  //*******For change image ************* */
  const handlePhotoCapture = (dataUrl) => {
    didInitPos.current = false;
    setMainImageSrc(dataUrl);
  };

  const handleFinalSave = () => onSave(handleExport());
  const handleUpload = async () => {
    try {
      setUploading(true);
      setUploadDone(false);

      const uri = handleExport();
      const blob = await (await fetch(uri)).blob();
      const formData = new FormData();
      formData.append("image", blob, `${tag.toString().toUpperCase()}.jpg`);
      //formData.append("image", blob, "edited_image.png");
      formData.append(
        "containerName",
        `${
          itemDetails?.message[0].store_id
        }-${itemDetails?.message[0].branch_id.toLowerCase()}`
      ); // ⬅️ extra field

      // 3. POST with Accept header
      const res = await fetch(
        "https://savingappbackend-etducad0cuhkbud8.centralindia-01.azurewebsites.net/api/admin/uploadimagetoblob",
        {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        }
      );
      const data = await res.json();
      console.log(data);

      if (res.ok) {
        setUploadDone(true);
        setTimeout(() => {
          setUploading(false);
          //alert("✅ Upload successful: " + data.statusMessage);
          handleFinalSave(); // Call final save after tick
        }, 1000);
      } else {
        setUploading(false);
        alert("Upload failed");
      }
    } catch (err) {
      console.error("❌ Upload error:", err);
      setUploading(false);
      alert("Upload error");
    }
  };

  // ---------------------------------------------------------------------
  // 7.  RENDER
  // ---------------------------------------------------------------------
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#000",
        zIndex: 9999,
        display: showEditor ? "flex" : "none",
        flexDirection: "column",
      }}
    >
      {uploading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {!uploadDone ? (
            <>
              <CircularProgress size={60} />
              <Box sx={{ color: "#fff", mt: 1 }}>Uploading…</Box>
            </>
          ) : (
            <Zoom in={uploadDone}>
              <CheckCircleIcon sx={{ fontSize: 80, color: "limegreen" }} />
            </Zoom>
          )}
        </Box>
      )}
      <PhotoPickerModal
        open={showPicker}
        onClose={() => setShowPicker(false)}
        onPick={handlePhotoCapture}
      />

      {mainImage && (
        <>
          <Stage
            width={STAGE_WIDTH}
            height={STAGE_HEIGHT}
            ref={stageRef}
            style={{ flex: 1, background: "black", touchAction: "none" }}
            onMouseDown={(e) =>
              e.target === e.target.getStage() && setSelectedId(null)
            }
            onTouchStart={(e) =>
              e.target === e.target.getStage() && setSelectedId(null)
            }
          >
            <Layer>
              <KonvaImage
                ref={mainImgRef}
                image={mainImage}
                {...imageProps}
                onClick={() => setSelectedId(null)}
                onTap={() => setSelectedId(null)}
              />
{watermarkImage && showWatermark && imageProps && (
  <KonvaImage
    image={watermarkImage}
    x={imageProps.x + imageProps.width / 2 - 100} // center horizontally
    y={imageProps.y + imageProps.height / 2 - 100} // center vertically
    width={200}
    height={110}
    ////opacity={100}
    filters={[Konva.Filters.Brighten]}
    //brightness={-50}
    listening={false} // So user interactions skip it
  />
)}

              {/* ------------------ TEXT STICKER ------------------ */}
              <Group
                ref={textRef}
                x={textPosition.x}
                y={textPosition.y}
                draggable
                onClick={() => setSelectedId("text")}
                onTap={() => setSelectedId("text")}
                onDragEnd={(e) =>
                  setTextPosition({ x: e.target.x(), y: e.target.y() })
                }
                onTransformEnd={() => {
                  const grp = textRef.current;
                  const scaleX = grp.scaleX();
                  const scaleY = grp.scaleY();

                  const newW = Math.max(MIN_STICKER_W, textSize.width * scaleX);
                  const newH = Math.max(
                    MIN_STICKER_H,
                    textSize.height * scaleY
                  );

                  // update children
                  const rectNode = grp.findOne("Rect");
                  const textNode = grp.findOne("Text");
                  rectNode.width(newW);
                  rectNode.height(newH);
                  textNode.width(newW);
                  textNode.height(newH);

                  // reset scale
                  grp.scaleX(1);
                  grp.scaleY(1);

                  // react state
                  setTextSize({ width: newW, height: newH });

                  const calcFont = Math.max(
                    MIN_FONT,
                    (newH / BASE_TEXT_HEIGHT) * BASE_FONT_SIZE
                  );
                  setTextFontSize(calcFont);

                  // refresh transformer
                  if (trRef.current) {
                    trRef.current.nodes([grp]);
                    trRef.current.getLayer().batchDraw();
                  }
                }}
              >
                <Rect
                  width={textSize.width}
                  height={textSize.height}
                  //fill="white"
                  //cornerRadius={5}
                />
                <Text
                  text={`${itemDetails.message[0].itemtype_name || ""}\n${
                    (tag || "").toString().toUpperCase()
                  }\n${
                    parseFloat(itemDetails.message[0].gross_orig).toFixed(3) ||
                    ""
                  }Gms`}
                  //   text={`${itemDetails.name || ""}\n${itemDetails.design || ""}\n${
                  //  parseFloat(itemDetails.Weight).toFixed(3)|| ""
                  //   }Gms\n\n${itemDetails.tagno || ""}`}
                  fill="black"
                  fontSize={textFontSize}
                  fontStyle="bold"
                  padding={2}
                  fontFamily="Times New Roman"
                  width={textSize.width}
                  height={textSize.height}
                  align="center"
                  verticalAlign="middle"
                />
              </Group>

              {/* -------------------- LOGO ------------------------ */}
              {logoImage && (
                <KonvaImage
                  ref={logoRef}
                  image={logoImage}
                  x={logoPosition.x}
                  y={logoPosition.y}
                  width={logoSize.width}
                  height={logoSize.height}
                  draggable
                  onClick={() => setSelectedId("logo")}
                  onTap={() => setSelectedId("logo")}
                  onDragEnd={(e) =>
                    setLogoPosition({ x: e.target.x(), y: e.target.y() })
                  }
                  onTransformEnd={() => {
                    const n = logoRef.current;
                    const sX = n.scaleX();
                    const sY = n.scaleY();
                    n.scaleX(1);
                    n.scaleY(1);
                    setLogoSize((prev) => ({
                      width: prev.width * sX,
                      height: prev.height * sY,
                    }));
                  }}
                />
              )}

              {/* ---- Visible Transformer (blue border + anchors) ---- */}
              <Transformer
                ref={trRef}
                keepRatio
                rotateEnabled={false}
                anchorSize={10}
                anchorStroke="#00A3FF"
                anchorFill="#FFFFFF"
                boundBoxFunc={(oldBox, newBox) =>
                  // 30 px for logo, but text sticker min handled inside onTransformEnd
                  newBox.width < 30 || newBox.height < 30 ? oldBox : newBox
                }
              />
            </Layer>
          </Stage>

          {/* ------------------ TOP BAR ------------------ */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "space-between",
              p: 1,
              height: 10,//40
              background: "rgba(0,0,0,0.5)",
              color: "#fff",
              zIndex: 10,
            }}
          >
            <IconButton onClick={onCancel} sx={{ color: "#fff" }}>
              <ArrowBackIcon />
            </IconButton>
            <IconButton onClick={handleCropDone} sx={{ color: "#fff" }}>
              <CropIcon />
            </IconButton>
          </Box>

          {/* ----------------- BOTTOM BAR ---------------- */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 1,
              height: 30,
              background: "rgba(0,0,0,0.5)",
              zIndex: 10,
            }}
          >
            {/* -------- Change image input  -------- */}

            <Button
              sx={{ backgroundColor: "blue", color: "#fff", p: 1, zIndex: 10 }}
              onClick={() => setShowPicker(true)}
            >
              change image
            </Button>


            {/* -------- Logo BG toggle button -------- */}
            {/* <Button
              onClick={() => setUseTransparent((p) => !p)}
              sx={{ backgroundColor: "blue", color: "#fff", paddingInline:4 }}
            >
              {useTransparent ? "BG: OFF" : "BG: ON"}
            </Button> */}

        
           <Button
  onClick={() => setShowWatermark((prev) => !prev)}
  sx={{ backgroundColor: "blue", color: "#fff", paddingY: 1, paddingInline: 4 }}
>
  {showWatermark ? "Hide" : "Show"}
</Button>


            <Button
              onClick={handleUpload}
              disabled={uploading}
              sx={{
                backgroundColor: "blue",
                color: "#fff",
                paddingY: 1,
                paddingInline: 4,
              }}
            >
              Upload
            </Button>
          </Box>
        </>
      )}
    </div>
  );
};

export default EditImage;
