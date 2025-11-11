"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Upload, X, Download, FolderDown } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import getCroppedImg from "../utils/CropImage"; // custom util (we’ll include below)
import toast from "react-hot-toast";
import FadeInText from "@/components/ui/FadeInText";
import { TextAnimate } from "@/components/ui/text-animate";

interface UploadedImage {
  file: File;
  url: string;
}

const aspectRatios = [
  { label: "Freeform", value: 0 },
  { label: "1:1", value: 1 / 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
  { label: "3:2", value: 3 / 2 },
];

const CropImage = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [aspect, setAspect] = useState<number | undefined>();
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });

  // Displayed image/client metrics
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });

  // Selection rectangle state (in displayed px)
  const [selection, setSelection] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ mx: number; my: number; sx: number; sy: number } | null>(null);
  const [resizing, setResizing] = useState<null | {
    handle: string;
    startX: number;
    startY: number;
    startRect: { x: number; y: number; width: number; height: number };
  }>(null);
  // Refs for pointer-driven global listeners
  const isDraggingRef = useRef(isDragging);
  const dragStartRef = useRef(dragStart);
  const resizingRef = useRef(resizing);
  const selectionRef = useRef(selection);
  useEffect(() => { isDraggingRef.current = isDragging; }, [isDragging]);
  useEffect(() => { dragStartRef.current = dragStart; }, [dragStart]);
  useEffect(() => { resizingRef.current = resizing; }, [resizing]);
  useEffect(() => { selectionRef.current = selection; }, [selection]);

  // Custom aspect ratio inputs
  const [customW, setCustomW] = useState<number | "">("");
  const [customH, setCustomH] = useState<number | "">("");

  const inputRef = useRef<HTMLInputElement>(null);

  // Helpers
  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

  const initSelection = useCallback(() => {
    const wrap = wrapperRef.current;
    if (!wrap) return;
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    setDisplaySize({ width: w, height: h });
    // default selection: centered, half of shortest dimension, obey aspect if set
    let selW = Math.round(w * 0.6);
    let selH = Math.round(h * 0.6);
    if (aspect && aspect > 0) {
      if (selW / selH > aspect) {
        selW = Math.round(selH * aspect);
      } else {
        selH = Math.round(selW / aspect);
      }
    }
    setSelection({
      x: Math.round((w - selW) / 2),
      y: Math.round((h - selH) / 2),
      width: selW,
      height: selH,
    });
  }, [aspect]);

  useEffect(() => {
    // Recompute selection when image changes or window resizes
    const handle = () => initSelection();
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, [initSelection]);

  // Global pointer listeners for real-time interaction
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const wrap = wrapperRef.current;
      if (!wrap) return;

      // Drag move
      if (isDraggingRef.current && dragStartRef.current) {
        const dx = e.clientX - dragStartRef.current.mx;
        const dy = e.clientY - dragStartRef.current.my;
        const maxX = wrap.clientWidth - selectionRef.current.width;
        const maxY = wrap.clientHeight - selectionRef.current.height;
        let nx = clamp(dragStartRef.current.sx + dx, 0, maxX);
        let ny = clamp(dragStartRef.current.sy + dy, 0, maxY);
        // Snap to edges
        const snap = 8;
        if (nx < snap) nx = 0;
        if (ny < snap) ny = 0;
        if (Math.abs(maxX - nx) < snap) nx = maxX;
        if (Math.abs(maxY - ny) < snap) ny = maxY;
        setSelection((prev) => ({ ...prev, x: Math.round(nx), y: Math.round(ny) }));
        return;
      }

      // Resize move
      if (resizingRef.current) {
        const { handle, startX, startY, startRect } = resizingRef.current;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        let { x, y, width, height } = { ...startRect };

        const applyAspect = (w: number, h: number) => {
          if (!aspect || aspect <= 0) return { w, h };
          let nh = Math.round(w / aspect);
          let nw = w;
          if (nh < 1) nh = 1;
          if (nh > wrap.clientHeight) {
            nh = wrap.clientHeight;
            nw = Math.round(nh * aspect);
          }
          return { w: nw, h: nh };
        };
        const minSize = 20;
        switch (handle) {
          case "e": {
            let w = clamp(width + dx, minSize, wrap.clientWidth - x);
            let h = height;
            if (aspect && aspect > 0) {
              const adj = applyAspect(w, h);
              w = adj.w;
              h = adj.h;
            }
            width = w; height = h;
            break;
          }
          case "s": {
            let h = clamp(height + dy, minSize, wrap.clientHeight - y);
            let w = width;
            if (aspect && aspect > 0) {
              w = Math.round(h * aspect);
              if (x + w > wrap.clientWidth) {
                w = wrap.clientWidth - x;
                h = Math.round(w / aspect);
              }
            }
            width = w; height = h;
            break;
          }
          case "w": {
            let newW = clamp(width - dx, minSize, width + x);
            let newX = x + (width - newW);
            let newH = height;
            if (aspect && aspect > 0) {
              newH = Math.round(newW / aspect);
              if (newX < 0) {
                newX = 0;
                newW = x + width;
                newH = Math.round(newW / aspect);
              }
              if (y + newH > wrap.clientHeight) {
                newH = wrap.clientHeight - y;
                newW = Math.round(newH * aspect);
                newX = x + (width - newW);
              }
            }
            x = clamp(newX, 0, wrap.clientWidth - newW);
            width = newW; height = newH;
            break;
          }
          case "n": {
            let newH = clamp(height - dy, minSize, height + y);
            let newY = y + (height - newH);
            let newW = width;
            if (aspect && aspect > 0) {
              newW = Math.round(newH * aspect);
              if (newY < 0) {
                newY = 0;
                newH = y + height;
                newW = Math.round(newH * aspect);
              }
              if (x + newW > wrap.clientWidth) {
                newW = wrap.clientWidth - x;
                newH = Math.round(newW / aspect);
                newY = y + (height - newH);
              }
            }
            y = clamp(newY, 0, wrap.clientHeight - newH);
            width = newW; height = newH;
            break;
          }
          case "ne": {
            let tempWidth = clamp(width + dx, minSize, wrap.clientWidth - x);
            let tempHeight = clamp(height - dy, minSize, height + y);
            if (aspect && aspect > 0) {
              tempHeight = Math.round(tempWidth / aspect);
              let newY = y + (height - tempHeight);
              if (newY < 0) {
                newY = 0;
                tempHeight = y + height;
                tempWidth = Math.round(tempHeight * aspect);
              }
              y = newY;
            } else {
              y = y + (height - tempHeight);
            }
            width = tempWidth; height = tempHeight;
            break;
          }
          case "nw": {
            let tempWidth = clamp(width - dx, minSize, width + x);
            let tempX = x + (width - tempWidth);
            let tempHeight = clamp(height - dy, minSize, height + y);
            let tempY = y + (height - tempHeight);
            if (aspect && aspect > 0) {
              tempHeight = Math.round(tempWidth / aspect);
              tempY = y + (height - tempHeight);
              if (tempX < 0) {
                tempX = 0;
                tempWidth = x + width;
                tempHeight = Math.round(tempWidth / aspect);
                tempY = y + (height - tempHeight);
              }
              if (tempY < 0) {
                tempY = 0;
                tempHeight = y + height;
                tempWidth = Math.round(tempHeight * aspect);
                tempX = x + (width - tempWidth);
              }
            }
            x = clamp(tempX, 0, wrap.clientWidth - tempWidth);
            y = clamp(tempY, 0, wrap.clientHeight - tempHeight);
            width = tempWidth; height = tempHeight;
            break;
          }
          case "se": {
            let tempWidth = clamp(width + dx, minSize, wrap.clientWidth - x);
            let tempHeight = clamp(height + dy, minSize, wrap.clientHeight - y);
            if (aspect && aspect > 0) {
              tempHeight = Math.round(tempWidth / aspect);
              if (y + tempHeight > wrap.clientHeight) {
                tempHeight = wrap.clientHeight - y;
                tempWidth = Math.round(tempHeight * aspect);
              }
            }
            width = tempWidth; height = tempHeight;
            break;
          }
          case "sw": {
            let tempWidth = clamp(width - dx, minSize, width + x);
            let tempX = x + (width - tempWidth);
            let tempHeight = clamp(height + dy, minSize, wrap.clientHeight - y);
            if (aspect && aspect > 0) {
              tempHeight = Math.round(tempWidth / aspect);
              if (y + tempHeight > wrap.clientHeight) {
                tempHeight = wrap.clientHeight - y;
                tempWidth = Math.round(tempHeight * aspect);
                tempX = x + (width - tempWidth);
              }
            }
            x = clamp(tempX, 0, wrap.clientWidth - tempWidth);
            width = tempWidth; height = tempHeight;
            break;
          }
        }
        // Snap selection to wrapper edges
        const snap = 8;
        const maxX = wrap.clientWidth - width;
        const maxY = wrap.clientHeight - height;
        if (x < snap) x = 0;
        if (y < snap) y = 0;
        if (Math.abs(maxX - x) < snap) x = maxX;
        if (Math.abs(maxY - y) < snap) y = maxY;
        if (Math.abs(x + width - wrap.clientWidth) < snap) width = wrap.clientWidth - x;
        if (Math.abs(y + height - wrap.clientHeight) < snap) height = wrap.clientHeight - y;

        setSelection({ x: Math.round(x), y: Math.round(y), width: Math.round(width), height: Math.round(height) });
      }
    };
    const onPointerUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDragging(false);
        setDragStart(null);
      }
      if (resizingRef.current) {
        setResizing(null);
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [aspect]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
    if (currentIndex === null && newImages.length > 0) setCurrentIndex(0);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    if (!files.length) return;
    const imagesOnly = files.filter((f) => f.type.startsWith("image/"));
    const newImages = imagesOnly.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    if (newImages.length) {
      setImages((prev) => [...prev, ...newImages]);
      if (currentIndex === null) setCurrentIndex(0);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleImageClick = (i: number) => setCurrentIndex(i);

  const clearAll = () => {
    setImages([]);
    setCurrentIndex(null);
  };

  const deleteImage = (i: number) => {
    const updated = images.filter((_, index) => index !== i);
    setImages(updated);
    if (currentIndex === i) setCurrentIndex(updated.length ? 0 : null);
  };

  const computePixelCropForImage = async (
    imageUrl: string,
    baseNatural?: { width: number; height: number }
  ) => {
    // Ensure we have natural size
    const natural = await new Promise<{ width: number; height: number }>((resolve, reject) => {
      if (baseNatural) return resolve(baseNatural);
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = reject;
      img.src = imageUrl;
    });

    // Map selection (display px) to natural pixels by proportion against displayed image size
    const disp = wrapperRef.current ? { width: wrapperRef.current.clientWidth, height: wrapperRef.current.clientHeight } : displaySize;
    const scaleX = natural.width / disp.width;
    const scaleY = natural.height / disp.height;

    // Clamp to image bounds
    const x = clamp(Math.round(selection.x * scaleX), 0, natural.width - 1);
    const y = clamp(Math.round(selection.y * scaleY), 0, natural.height - 1);
    const w = clamp(Math.round(selection.width * scaleX), 1, natural.width - x);
    const h = clamp(Math.round(selection.height * scaleY), 1, natural.height - y);

    return { x, y, width: w, height: h, natural };
  };

  const downloadCropped = async () => {
    if (currentIndex === null) return;
    const image = images[currentIndex];
    const pixelCrop = await computePixelCropForImage(image.url, originalSize);
    const croppedImage = await getCroppedImg(image.url, pixelCrop);
    saveAs(croppedImage, `cropped_${image.file.name}`);
    toast.success("Cropped image downloaded!");
  };

  const downloadAllAsZip = async () => {
    if (images.length === 0) return;
    const zip = new JSZip();

    // Compute ratios from current image selection relative to its natural size
    let baseNatural = originalSize.width && originalSize.height ? originalSize : null;
    if (!baseNatural && images.length) {
      // Load current image natural if not set
      const cur = images[currentIndex ?? 0];
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const im = new Image();
        im.onload = () => resolve(im as HTMLImageElement);
        im.onerror = reject;
        im.src = cur.url;
      });
      baseNatural = { width: img.naturalWidth, height: img.naturalHeight };
    }
    if (!baseNatural) return;

    const pixelCropForCurrent = await computePixelCropForImage(images[currentIndex ?? 0].url, baseNatural);
    const rx = pixelCropForCurrent.x / baseNatural.width;
    const ry = pixelCropForCurrent.y / baseNatural.height;
    const rw = pixelCropForCurrent.width / baseNatural.width;
    const rh = pixelCropForCurrent.height / baseNatural.height;

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      // Load natural for each image
      const nat = await new Promise<{ width: number; height: number }>((resolve, reject) => {
        const im = new Image();
        im.onload = () => resolve({ width: im.naturalWidth, height: im.naturalHeight });
        im.onerror = reject;
        im.src = image.url;
      });
      const pixelCrop = {
        x: Math.round(rx * nat.width),
        y: Math.round(ry * nat.height),
        width: Math.max(1, Math.round(rw * nat.width)),
        height: Math.max(1, Math.round(rh * nat.height)),
      };
      const croppedImage = await getCroppedImg(image.url, pixelCrop);
      const blob = await (await fetch(croppedImage)).blob();
      zip.file(`cropped_${image.file.name}`, blob);
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "CroppedImages.zip");
    toast.success("All images downloaded as ZIP!");
  };

  const currentImage = currentIndex !== null ? images[currentIndex] : null;

  return (
    <main className="flex-1 mt-10">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {/* Heading */}
        <div className="flex flex-wrap justify-between gap-3 p-3 sm:p-4">
          <div className="flex flex-col gap-3">
            <FadeInText text="Crop Image" className="text-white text-2xl sm:text-3xl md:text-4xl font-black"></FadeInText>
            <TextAnimate animation="fadeIn" by="word" className="text-white/60 text-sm md:text-base">
              Upload, crop, and download perfectly sized images.
            </TextAnimate>
          </div>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-12 gap-4 sm:gap-6 mt-4 sm:mt-6">
          {/* LEFT SIDEBAR */}
          <aside className="col-span-12 lg:col-span-3 border border-black/10 dark:border-white/10 bg-white/5 rounded-xl p-4 sm:p-5 lg:p-6 flex flex-col gap-5 sm:gap-6">
            <div
              className="flex flex-col items-center gap-3 sm:gap-4 rounded-xl border-2 border-dashed border-gray-200 shadow-md px-4 py-8 sm:px-6 sm:py-10 hover:border-orange-600 transition-colors duration-300 text-center cursor-pointer"
              onClick={() => inputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-primary transition-transform duration-300" />
              <p className="text-[#0f0f0f] dark:text-white font-bold text-sm sm:text-base">Add Images</p>
              <p className="text-gray-400 text-xs sm:text-sm">Drag & drop or click to browse.</p>
              <input
                ref={inputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                aria-label="Upload images"
                onChange={handleUpload}
              />
            </div>
            <div className="w-full h-px bg-black/10 dark:bg-white/10 my-4" />

            <div className="flex flex-col gap-3 sm:gap-4 flex-1 overflow-y-auto">
              <h3 className="text-primary  text-base sm:text-lg font-bold">Uploaded Images</h3>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className={`relative group cursor-pointer border-2 rounded-md ${
                      i === currentIndex ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <div
                      onClick={() => handleImageClick(i)}
                      className="bg-cover bg-center aspect-square rounded-md"
                      style={{ backgroundImage: `url(${img.url})` }}
                    />
                    <button
                      onClick={() => deleteImage(i)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-600"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {images.length > 0 && (
              <button
                onClick={clearAll}
                className="w-full flex items-center justify-center gap-2 h-9 sm:h-10 md:h-11 px-3 sm:px-4 bg-red-500/80 text-white text-sm sm:text-base font-bold cursor-pointer hover:scale-105 active:scale-95 hover:bg-red-600 rounded-lg transition-all"
              >
                <X className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            )}
          </aside>

          {/* CENTER PREVIEW */}
          <main className="col-span-12 lg:col-span-6 border bg-black/20 rounded-xl p-2 sm:p-3 md:p-4 flex items-center justify-center relative overflow-hidden aspect-auto md:aspect-4/3 lg:aspect-auto">
            {currentImage ? (
              <div ref={containerRef} className="relative max-w-full max-h-full w-full h-full flex items-center  justify-center select-none">
                {/* Exact-size wrapper around the rendered image */}
                <div
                  ref={wrapperRef}
                  className="relative"
                  style={{ width: displaySize.width || "auto", height: displaySize.height || "auto" }}
                >
                  <img
                    ref={imageRef}
                    src={currentImage.url}
                    alt="to-crop"
                    className="block max-w-full max-h-[55svh] sm:max-h-[60svh] md:max-h-[65svh] lg:max-h-[70svh] object-contain select-none"
                    onLoad={(e) => {
                      const img = e.currentTarget;
                      setOriginalSize({ width: img.naturalWidth, height: img.naturalHeight });
                      // Measure actual rendered size to size wrapper
                      requestAnimationFrame(() => {
                        const w = img.clientWidth;
                        const h = img.clientHeight;
                        setDisplaySize({ width: w, height: h });
                        // After wrapper takes these dimensions, init selection
                        requestAnimationFrame(() => initSelection());
                      });
                    }}
                    draggable={false}
                    style={{ width: displaySize.width ? displaySize.width : undefined, height: displaySize.height ? displaySize.height : undefined }}
                  />

                  {/* Mask limited to the image area */}
                  <div className="absolute inset-0 pointer-events-none" aria-hidden>
                    <svg className="w-full h-full">
                      <defs>
                        <mask id="cutout">
                          <rect x="0" y="0" width="100%" height="100%" fill="white" />
                          <rect
                            x={selection.x}
                            y={selection.y}
                            width={selection.width}
                            height={selection.height}
                            fill="black"
                            rx="2"
                          />
                        </mask>
                      </defs>
                      <rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        fill="rgba(0,0,0,0.5)"
                        mask="url(#cutout)"
                      />
                    </svg>
                  </div>

                {/* Draggable + resizable selection */}
                <div
                  className="absolute border-2 border-primary shadow-[0_0_0_9999px_rgba(0,0,0,0)]"
                  style={{
                    left: selection.x,
                    top: selection.y,
                    width: selection.width,
                    height: selection.height,
                    cursor: isDragging ? "grabbing" : "grab",
                    touchAction: "none",
                  }}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    // Start dragging if click inside selection but not on handle
                    const target = e.target as HTMLElement;
                    if (target.dataset.handle) return;
                    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
                    setIsDragging(true);
                    setDragStart({ mx: e.clientX, my: e.clientY, sx: selection.x, sy: selection.y });
                  }}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      const wrap = wrapperRef.current;
                      if (!wrap) return;
                      const step = e.shiftKey ? 10 : 1;
                      let { x, y, width, height } = selectionRef.current;
                      if (e.key === "ArrowLeft") {
                        if (e.altKey) {
                          // resize from west
                          const nx = Math.max(0, x - step);
                          width += x - nx;
                          x = nx;
                        } else {
                          x = Math.max(0, x - step);
                        }
                        e.preventDefault();
                      } else if (e.key === "ArrowRight") {
                        if (e.altKey) {
                          // resize to east
                          width = Math.min(wrap.clientWidth - x, width + step);
                        } else {
                          x = Math.min(wrap.clientWidth - width, x + step);
                        }
                        e.preventDefault();
                      } else if (e.key === "ArrowUp") {
                        if (e.altKey) {
                          // resize to north
                          const ny = Math.max(0, y - step);
                          height += y - ny;
                          y = ny;
                        } else {
                          y = Math.max(0, y - step);
                        }
                        e.preventDefault();
                      } else if (e.key === "ArrowDown") {
                        if (e.altKey) {
                          // resize to south
                          height = Math.min(wrap.clientHeight - y, height + step);
                        } else {
                          y = Math.min(wrap.clientHeight - height, y + step);
                        }
                        e.preventDefault();
                      }
                      setSelection({ x: Math.round(x), y: Math.round(y), width: Math.round(width), height: Math.round(height) });
                    }}
                >
                  {/* handles */}
                  {["nw", "n", "ne", "e", "se", "s", "sw", "w"].map((h) => (
                    <div
                      key={h}
                      data-handle={h}
                      className="absolute bg-primary"
                      style={(() => {
                        const size = 10;
                        const half = size / 2;
                        const cursorMap: Record<string, React.CSSProperties["cursor"]> = {
                          n: "ns-resize",
                          s: "ns-resize",
                          e: "ew-resize",
                          w: "ew-resize",
                          nw: "nwse-resize",
                          se: "nwse-resize",
                          ne: "nesw-resize",
                          sw: "nesw-resize",
                        };
                        const base: React.CSSProperties = { width: size, height: size, pointerEvents: "auto", cursor: cursorMap[h], touchAction: "none" };
                        switch (h) {
                          case "nw":
                            return { ...base, left: -half, top: -half };
                          case "n":
                            return { ...base, left: "50%", transform: "translateX(-50%)", top: -half, cursor: "ns-resize" };
                          case "ne":
                            return { ...base, right: -half, top: -half };
                          case "e":
                            return { ...base, right: -half, top: "50%", transform: "translateY(-50%)", cursor: "ew-resize" };
                          case "se":
                            return { ...base, right: -half, bottom: -half };
                          case "s":
                            return { ...base, left: "50%", transform: "translateX(-50%)", bottom: -half, cursor: "ns-resize" };
                          case "sw":
                            return { ...base, left: -half, bottom: -half };
                          case "w":
                            return { ...base, left: -half, top: "50%", transform: "translateY(-50%)", cursor: "ew-resize" };
                          default:
                            return base;
                        }
                      })()}
                      onPointerDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
                        setResizing({
                          handle: h,
                          startX: e.clientX,
                          startY: e.clientY,
                          startRect: { ...selection },
                        });
                      }}
                    />
                  ))}

                  {/* Size label */}
                  <div className="absolute bottom-0 right-0 translate-y-full mt-1 px-2 py-0.5 bg-black/60 text-white text-xs rounded">
                    {Math.round(selection.width)} × {Math.round(selection.height)}
                  </div>
                </div>

                </div>
              </div>
            ) : (
              <p className="text-primary/60">Upload an image to start cropping</p>
            )}
          </main>

          {/* RIGHT SIDEBAR */}
          <aside className="col-span-12 border border-black/10 dark:border-white/10 lg:col-span-3 bg-white/5 rounded-xl p-4 sm:p-5 lg:p-6 flex flex-col gap-5 sm:gap-6">
            <div className="flex flex-col gap-3 sm:gap-4">
              <h3 className="text-primary text-base sm:text-lg font-bold">Crop Settings</h3>
                          <div className="w-full h-px bg-black/10 dark:bg-white/10 my-2" />

               <h1 className="text-primary/50">Aspect Ratio</h1>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {aspectRatios.map((r) => (
                  <button
                    key={r.label}
                    onClick={() => {
                      setAspect(r.value || undefined);
                      if (r.value) {
                        setCustomW("");
                        setCustomH("");
                      }
                      // Re-fit selection to new aspect
                      requestAnimationFrame(() => initSelection());
                    }}
                    className={`px-2 py-1.5 sm:py-2 text-xs sm:text-sm rounded-md ${
                      aspect === r.value || (!aspect && r.value === 0)
                        ? "bg-gray-500/20 border border-black/10  dark:border-white/10 text-black dark:text-white"
                        : "  border border-black/10  dark:border-white/10 text-black dark:text-white hover:bg-white/20"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            <div className="w-full h-px bg-black/10 dark:bg-white/10 my-2" />

              {/* Custom aspect ratio */}
              <h1 className="text-primary/50">Custom Ratio</h1>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  placeholder="W"
                  value={customW}
                  onChange={(e) => {
                    const v = e.target.value === "" ? "" : Math.max(1, Number(e.target.value));
                    setCustomW(v);
                    if (v !== "" && customH !== "") {
                      const a = Number(v) / Number(customH);
                      setAspect(a);
                      requestAnimationFrame(() => initSelection());
                    }
                  }}
                  className="w-16 sm:w-20 px-4 py-2 rounded-md bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-primary text-xs sm:text-sm outline-none focus:ring ring-orange-500 transition-all"
                />
                <span className="text-primary/60">:</span>
                <input
                  type="number"
                  min={1}
                  placeholder="H"
                  value={customH}
                  onChange={(e) => {
                    const v = e.target.value === "" ? "" : Math.max(1, Number(e.target.value));
                    setCustomH(v);
                    if (customW !== "" && v !== "") {
                      const a = Number(customW) / Number(v);
                      setAspect(a);
                      requestAnimationFrame(() => initSelection());
                    }
                  }}
                  className="w-16 sm:w-20 px-4 py-2 rounded-md bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-primary text-xs sm:text-sm outline-none focus:ring ring-orange-500 transition-all"
                />
                <button
                  onClick={() => {
                    setAspect(undefined);
                    setCustomW("");
                    setCustomH("");
                    requestAnimationFrame(() => initSelection());
                  }}
                  className="ml-2 px-4 py-2 rounded-md border border-black/10 dark:border-white/10 cursor-pointer hover:scale-105 active:scale-95 transition-all bg-white/10 text-primary hover:bg-white/20 text-xs sm:text-sm "
                >
                  Free
                </button>
              </div>
            </div>

            {/* PREVIEW DETAILS */}
            {currentImage && (
              <>
              <div className="w-full h-px bg-black/10 dark:bg-white/10 my-2" />
                <div className="flex flex-col gap-2">
                  <p className="text-primary font-bold text-sm sm:text-base">Original Dimensions</p>
                  <p className="text-primary/50 text-xs sm:text-sm">
                    {originalSize.width} × {originalSize.height}px
                  </p>
                  <p className="text-primary font-bold mt-2 text-sm sm:text-base">Cropped Dimensions</p>
                  <p className="text-primary/50 text-xs sm:text-sm font-bold">
                    {selection.width} × {selection.height}px (display)
                  </p>
                </div>
              </>
            )}

            {/* ACTION BUTTONS */}
            <div className="w-full h-px bg-black/10 dark:bg-white/10 my-2" />
            <div className="flex flex-col gap-3 sm:gap-4 mt-auto">
              <button
                onClick={downloadCropped}
                className="w-full h-10 cursor-pointer hover:scale-105 active:scale-95 sm:h-11 md:h-12 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Download className="w-4 h-4" /> Download Cropped Image
              </button>
              <button
                onClick={downloadAllAsZip}
                className="w-full h-10 sm:h-11 md:h-12 bg-black/80 text-white font-bold rounded-lg cursor-pointer hover:scale-105 active:scale-95  hover:bg-black/70 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <FolderDown className="w-4 h-4" /> Download All as ZIP
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default CropImage;
