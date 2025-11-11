// Resize.tsx (optimized)
import React, { useRef, useState, useEffect, useCallback } from "react";
import JSZip from "jszip";
import { Download, FolderDown, Image as ImageIcon, LockKeyhole, Plus, Trash2, Upload, X } from "lucide-react";
import FadeInText from "@/components/ui/FadeInText";
import { TextAnimate } from "@/components/ui/text-animate";

type QueueItem = {
  id: string;
  file: File;
  url: string;
  original: { w: number; h: number; bytes: number };
  newW: number;
  newH: number;
  scale: number;
  appliedBlob?: Blob;
};

const presets = [
  { name: "YouTube Thumbnail", w: 1280, h: 720 },
  { name: "Instagram Profile", w: 320, h: 320 },
  { name: "Web Banner", w: 1200, h: 300 },
  { name: "Favicon (32x32)", w: 32, h: 32 },
  { name: "Facebook Cover", w: 820, h: 312 },
  { name: "Instagram Post", w: 1080, h: 1080 },
  { name: "1080p", w: 1920, h: 1080 },
  { name: "720p", w: 1280, h: 720 },
  { name: "480p", w: 854, h: 480 },
  { name: "360p", w: 640, h: 360 },
  { name: "Square (1:1)", w: 1080, h: 1080 },
];

const formatBytes = (bytes: number) => {
  if (!bytes) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

const Resize: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [scale, setScale] = useState(100);
  const [showAllPresets, setShowAllPresets] = useState(false);
  const [resizing, setResizing] = useState<{ handle: string; startX: number; startY: number; startW: number; startH: number; startActualW: number; startActualH: number; scale: number } | null>(null);
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });

  const active = queue.find((q) => q.id === activeId);

  const updateActiveDims = useCallback((partial: Partial<{ newW: number; newH: number; scale: number }>) => {
    if (!activeId) return;
    setQueue((q) =>
      q.map((item) => {
        if (item.id !== activeId) return item;
        const { newW: baseW, newH: baseH, scale: baseScale } = item;
        const { newW: partialW, newH: partialH, scale: partialScale } = { newW: baseW, newH: baseH, scale: baseScale, ...partial };
        let newW = partialW;
        let newH = partialH;
        const scale = partialScale;
        if (locked) {
          if (partial.newW && !partial.newH) newH = Math.round(newW * (item.original.h / item.original.w));
          else if (partial.newH && !partial.newW) newW = Math.round(newH * (item.original.w / item.original.h));
        }
        if (partial.scale !== undefined) {
          newW = Math.round((item.original.w * scale) / 100);
          newH = Math.round((item.original.h * scale) / 100);
        }
        return { ...item, newW, newH, scale };
      })
    );
  }, [activeId, locked]);

  // Resize handlers
  useEffect(() => {
    if (!resizing || !active || !previewContainerRef.current) return;

    const handleMove = (e: PointerEvent) => {
      if (!previewContainerRef.current || !imageRef.current) return;
      const container = previewContainerRef.current;
      const rect = container.getBoundingClientRect();
      const dx = e.clientX - resizing.startX;
      const dy = e.clientY - resizing.startY;
      
      let newW = resizing.startW;
      let newH = resizing.startH;
      const aspectRatio = active.original.h / active.original.w;

      const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
      const minSize = 20;
      const maxW = rect.width - 40;
      const maxH = rect.height - 40;

      switch (resizing.handle) {
        case "e": // East (right)
          newW = clamp(resizing.startW + dx, minSize, maxW);
          if (locked) newH = Math.round(newW * aspectRatio);
          break;
        case "w": // West (left)
          newW = clamp(resizing.startW - dx, minSize, maxW);
          if (locked) newH = Math.round(newW * aspectRatio);
          break;
        case "s": // South (bottom)
          newH = clamp(resizing.startH + dy, minSize, maxH);
          if (locked) newW = Math.round(newH / aspectRatio);
          break;
        case "n": // North (top)
          newH = clamp(resizing.startH - dy, minSize, maxH);
          if (locked) newW = Math.round(newH / aspectRatio);
          break;
        case "se": // Southeast
          newW = clamp(resizing.startW + dx, minSize, maxW);
          newH = locked ? Math.round(newW * aspectRatio) : clamp(resizing.startH + dy, minSize, maxH);
          if (locked && newH > maxH) {
            newH = maxH;
            newW = Math.round(newH / aspectRatio);
          }
          break;
        case "sw": // Southwest
          newW = clamp(resizing.startW - dx, minSize, maxW);
          newH = locked ? Math.round(newW * aspectRatio) : clamp(resizing.startH + dy, minSize, maxH);
          if (locked && newH > maxH) {
            newH = maxH;
            newW = Math.round(newH / aspectRatio);
          }
          break;
        case "ne": // Northeast
          newW = clamp(resizing.startW + dx, minSize, maxW);
          newH = locked ? Math.round(newW * aspectRatio) : clamp(resizing.startH - dy, minSize, maxH);
          if (locked && newH > maxH) {
            newH = maxH;
            newW = Math.round(newH / aspectRatio);
          }
          break;
        case "nw": // Northwest
          newW = clamp(resizing.startW - dx, minSize, maxW);
          newH = locked ? Math.round(newW * aspectRatio) : clamp(resizing.startH - dy, minSize, maxH);
          if (locked && newH > maxH) {
            newH = maxH;
            newW = Math.round(newH / aspectRatio);
          }
          break;
      }

      // Convert display pixels to actual image pixels using stored scale
      const actualW = Math.max(1, Math.round(newW / resizing.scale));
      const actualH = Math.max(1, Math.round(newH / resizing.scale));
      updateActiveDims({ newW: actualW, newH: actualH });
      // Update display size immediately for visual feedback
      setDisplaySize({ width: newW, height: newH });
    };

    const handleEnd = () => setResizing(null);

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleEnd);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleEnd);
    };
  }, [resizing, active, locked, displaySize, updateActiveDims]);

  // Update display size when active changes
  useEffect(() => {
    if (!active) {
      setDisplaySize({ width: 0, height: 0 });
      return;
    }
    if (!imageRef.current) {
      // Wait for image to load
      const checkImage = () => {
        if (imageRef.current && imageRef.current.complete) {
          const container = previewContainerRef.current;
          if (!container) return;
          // Calculate scale based on container and original image
          const containerW = container.clientWidth - 32; // padding
          const containerH = container.clientHeight - 32;
          const scaleX = containerW / active.original.w;
          const scaleY = containerH / active.original.h;
          const scale = Math.min(scaleX, scaleY, 1); // Don't scale up
          const displayW = active.newW * scale;
          const displayH = active.newH * scale;
          setDisplaySize({ width: displayW, height: displayH });
        } else {
          setTimeout(checkImage, 50);
        }
      };
      checkImage();
      return;
    }
    const updateDisplay = () => {
      const container = previewContainerRef.current;
      if (!container) return;
      const containerW = container.clientWidth - 32;
      const containerH = container.clientHeight - 32;
      const scaleX = containerW / active.original.w;
      const scaleY = containerH / active.original.h;
      const scale = Math.min(scaleX, scaleY, 1);
      const displayW = active.newW * scale;
      const displayH = active.newH * scale;
      setDisplaySize({ width: displayW, height: displayH });
    };
    requestAnimationFrame(updateDisplay);
  }, [active?.id, active?.newW, active?.newH, active?.original]);

  // Drag & Drop
  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      el.classList.add("ring", "ring-primary/50");
    };
    const handleDragLeave = () => el.classList.remove("ring", "ring-primary/50");
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      el.classList.remove("ring", "ring-primary/50");
      if (e.dataTransfer?.files.length) handleFiles(Array.from(e.dataTransfer.files));
    };
    el.addEventListener("dragover", handleDragOver);
    el.addEventListener("dragleave", handleDragLeave);
    el.addEventListener("drop", handleDrop);
    return () => {
      el.removeEventListener("dragover", handleDragOver);
      el.removeEventListener("dragleave", handleDragLeave);
      el.removeEventListener("drop", handleDrop);
    };
  }, []);

  // File handling
  const handleFiles = async (files: File[]) => {
    const images = files.filter((f) => f.type.startsWith("image/"));
    const newItems = await Promise.all(
      images.map(async (file) => {
        const url = URL.createObjectURL(file);
        const { width, height } = await getImageMetaFromFile(file);
        return {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          file,
          url,
          original: { w: width, h: height, bytes: file.size },
          newW: width,
          newH: height,
          scale: 100,
        } as QueueItem;
      })
    );
    setQueue((q) => [...q, ...newItems]);
    if (!activeId && newItems.length) setActiveId(newItems[0].id);
  };

  const onBrowseClick = () => fileInputRef.current?.click();
  const onFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    await handleFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  const getImageMetaFromFile = (file: File) =>
    new Promise<{ width: number; height: number }>((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
        URL.revokeObjectURL(url);
      };
      img.onerror = (err) => {
        reject(err);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    });

  const selectItem = (id: string) => setActiveId(id);
  const removeItem = (id: string) => {
    setQueue((q) => {
      const filtered = q.filter((s) => s.id !== id);
      setActiveId((prev) => (prev === id ? filtered[0]?.id ?? null : prev));
      return filtered;
    });
  };
  const clearAll = () => {
    queue.forEach((i) => URL.revokeObjectURL(i.url));
    setQueue([]);
    setActiveId(null);
  };

  const onScaleChange = (v: number) => {
    setScale(v);
    if (!activeId) return;
    setQueue((q) =>
      q.map((item) =>
        item.id === activeId
          ? {
              ...item,
              newW: Math.max(1, Math.round((item.original.w * v) / 100)),
              newH: Math.max(1, Math.round((item.original.h * v) / 100)),
              scale: v,
            }
          : item
      )
    );
  };

  const loadImage = (url: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });

  const resizeImageToBlob = async (item: QueueItem): Promise<Blob> => {
    const img = await loadImage(item.url);
    const canvas = document.createElement("canvas");
    canvas.width = item.newW;
    canvas.height = item.newH;
    const ctx = canvas.getContext("2d")!;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const type = item.file.type || "image/png";
    return new Promise((res) => canvas.toBlob((b) => res(b as Blob), type, 0.92));
  };

  const applyAndDownloadActive = async () => {
    if (!active) return;
    const blob = await resizeImageToBlob(active);
    const a = document.createElement("a");
    const ext = active.file.name.split(".").pop() ?? "png";
    a.href = URL.createObjectURL(blob);
    a.download = `resized_${active.file.name.replace(/\.[^/.]+$/, "")}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
    setQueue((q) => q.map((it) => (it.id === active.id ? { ...it, appliedBlob: blob } : it)));
  };

  const downloadAllZip = async () => {
    if (!queue.length) return;
    const zip = new JSZip();
    for (const item of queue) {
      const blob = await resizeImageToBlob(item);
      const ext = item.file.name.split(".").pop() ?? "png";
      zip.file(`ResizedImage/resized_${item.file.name.replace(/\.[^/.]+$/, "")}.${ext}`, blob);
    }
    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = `ResizedImages_${Date.now()}.zip`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
  };

  const resetActiveToOriginal = () => {
    if (!activeId) return;
    setQueue((q) =>
      q.map((it) => (it.id === activeId ? { ...it, newW: it.original.w, newH: it.original.h, scale: 100 } : it))
    );
    setScale(100);
  };

  const estimateNewSize = (item: QueueItem) => {
    const ratio = (item.newW * item.newH) / (item.original.w * item.original.h);
    return Math.max(100, Math.round(item.original.bytes * ratio));
  };

  return (
    <div className="px-4 sm:px-8 lg:px-16 py-8 mt-10">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <FadeInText text="Image Resizer" className="text-4xl font-black text-gray-900 dark:text-white"></FadeInText>
        <TextAnimate animation="fadeIn" by="word" className="text-base text-gray-500 dark:text-gray-400">Instantly resize, scale, and adjust your images.</TextAnimate>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Left Controls */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Drop Zone */}
          <div ref={dropRef} className="flex flex-col p-4 bg-white/5 dark:bg-black/20 rounded-xl border border-black/10 dark:border-white/10">
            <div onClick={onBrowseClick} className="flex flex-col items-center gap-6 group rounded-lg border-2 cursor-pointer border-dashed border-gray-500/50 transition-all hover:border-orange-500 dark:hover:border-orange-500 dark:border-white/20 px-6 py-14">
              <div className="text-center flex flex-col items-center max-w-[480px]">
              <Upload className="group-hover:scale-110 transition-all size-16"/>
                <p className="text-lg font-bold">Drag & Drop Images Here</p>
                <p className="text-sm text-gray-500">Or click the button below to browse your files.</p>
              </div>
              <div className="flex gap-2">
                <button className="gap-2 flex items-center justify-center border h-10 px-4 dark:bg-black/10 bg-black/5 dark:text-white rounded-lg dark:border-white/10 text-black border-black/10 cursor-pointer hover:scale-105 active:scale-95 transition-all">
                  <Plus/> Click to Browse
                </button>
              </div>
              <input ref={fileInputRef} onChange={onFileInputChange} type="file" accept="image/*" multiple hidden />
            </div>
          </div>

          {/* Resize Options */}
          <div className="flex flex-col p-6 bg-white/5 dark:bg-black/20 rounded-xl border border-black/10 dark:border-white/10 gap-6">
            <h2 className="text-xl font-bold">Resize Options</h2>
            {/* Width/Height Inputs */}
            <div className="flex flex-col gap-4">
              <p className="text-sm font-medium text-black/50 dark:text-white/50">Resize by Pixels</p>
              <div className="flex items-center gap-3">
                <label className="flex flex-col flex-1">
                  <p className="text-base pb-2">Width</p>
                  <input
                    type="number"
                    value={active?.newW ?? ""}
                    onChange={(e) => updateActiveDims({ newW: Math.max(1, Number(e.target.value) || 1) })}
                    className="form-input border w-full h-12 rounded-lg px-3"
                  />
                </label>
                <button onClick={() => setLocked((s) => !s)} title="lock" className={`p-3 mt-8 active:scale-95 transition-all rounded-lg ${locked ? "bg-primary/80 text-white" : "bg-primary/20 text-primary"}`}>
                  <LockKeyhole />
                </button>
                <label className="flex flex-col flex-1">
                  <p className="text-base pb-2">Height</p>
                  <input
                    type="number"
                    value={active?.newH ?? ""}
                    onChange={(e) => updateActiveDims({ newH: Math.max(1, Number(e.target.value) || 1) })}
                    className="form-input border w-full h-12 rounded-lg px-3"
                  />
                </label>
                <button title="reset" onClick={resetActiveToOriginal} className="ml-2 transition-all hover:scale-105 active:scale-95  mt-8 h-10 px-3 border rounded-lg">
                  Reset
                </button>
              </div>
            </div>

            {/* Scale Slider */}
            <div className="w-full h-px bg-black/10 dark:bg-white/10 my-4" />
            <div className="flex flex-col gap-4">
              <p className="text-sm font-medium text-black/50 dark:text-white/50">Scale by Percentage</p>
              <input type="range" min={1} max={200} value={active?.scale ?? scale} onChange={(e) => onScaleChange(Number(e.target.value))} className="w-full h-2 rounded-lg" title="Scale by Percentage" />
              <div className="flex justify-between text-sm text-gray-500">
                <span>1%</span>
                <span className={ `font-bold ${scale >= 100 ?"text-green-500": "text-red-500" }`} >{(active?.scale ?? scale) + "%"}</span>
                <span>200%</span>
              </div>
            </div>

            {/* Presets */}
            <div className="w-full h-px bg-black/10 dark:bg-white/10 my-4" />
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-black/50 dark:text-white/50 mb-2">Quick Presets</p>
              <div className="flex flex-wrap gap-2">
                {(showAllPresets ? presets : presets.slice(0, 3)).map((p) => (
                  <button
                    key={p.name}
                    onClick={() => {
                      if (!activeId) return;
                      setQueue((q) =>
                        q.map((it) =>
                          it.id === activeId
                            ? { ...it, newW: p.w, newH: p.h, scale: Math.round((p.w / it.original.w) * 100) }
                            : it
                        )
                      );
                    }}
                    className="px-3 py-1.5 text-sm rounded-full bg-gray-700/50 dark:text-white text-black cursor-pointer hover:scale-105 active:scale-95 hover:bg-green-600 transition-all"
                  >
                    {p.name} ({p.w}×{p.h})
                  </button>
                ))}
              </div>
              <button onClick={() => setShowAllPresets((s) => !s)} className="mt-2 text-sm text-blue-500 underline hover:text-blue-600 transition">
                {showAllPresets ? "Show Less ▲" : "Show More ▼"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Preview & Queue */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Preview */}
          <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-white/5 dark:bg-black/20 rounded-xl aspect-video border dark:border-white/10 border-black/10 overflow-hidden">
            {active ? (
              <div className="w-full flex flex-col md:flex-row gap-4 md:gap-6 items-start h-full">
                <div 
                  ref={previewContainerRef}
                  className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-hidden relative w-full h-full min-h-[200px]"
                >
                  <div className="relative inline-block" style={{ width: displaySize.width || active.newW, height: displaySize.height || active.newH }}>
                    <img
                      ref={imageRef}
                      src={active.url}
                      alt="preview"
                      className="block w-full h-full object-contain select-none"
                      style={{ 
                        width: displaySize.width || active.newW, 
                        height: displaySize.height || active.newH,
                        maxWidth: "100%",
                        maxHeight: "100%"
                      }}
                      onLoad={() => {
                        const container = previewContainerRef.current;
                        if (!container) return;
                        const containerW = container.clientWidth - 32;
                        const containerH = container.clientHeight - 32;
                        const scaleX = containerW / active.original.w;
                        const scaleY = containerH / active.original.h;
                        const scale = Math.min(scaleX, scaleY, 1);
                        const displayW = active.newW * scale;
                        const displayH = active.newH * scale;
                        setDisplaySize({ width: displayW, height: displayH });
                      }}
                      draggable={false}
                    />
                    
                    {/* Resize handles */}
                    {displaySize.width > 0 && displaySize.height > 0 && (
                      <>
                        {["nw", "n", "ne", "e", "se", "s", "sw", "w"].map((handle) => {
                          const size = 12;
                          const half = size / 2;
                          const cursorMap: Record<string, string> = {
                            n: "ns-resize",
                            s: "ns-resize",
                            e: "ew-resize",
                            w: "ew-resize",
                            nw: "nwse-resize",
                            se: "nwse-resize",
                            ne: "nesw-resize",
                            sw: "nesw-resize",
                          };
                          const getStyle = (): React.CSSProperties => {
                            const base: React.CSSProperties = {
                              position: "absolute",
                              width: size,
                              height: size,
                              backgroundColor: "rgb(249, 115, 22)",
                              border: "2px solid white",
                              borderRadius: "50%",
                              cursor: cursorMap[handle],
                              pointerEvents: "auto",
                              touchAction: "none",
                              zIndex: 10,
                            };
                            switch (handle) {
                              case "nw": return { ...base, left: -half, top: -half };
                              case "n": return { ...base, left: "50%", transform: "translateX(-50%)", top: -half };
                              case "ne": return { ...base, right: -half, top: -half };
                              case "e": return { ...base, right: -half, top: "50%", transform: "translateY(-50%)" };
                              case "se": return { ...base, right: -half, bottom: -half };
                              case "s": return { ...base, left: "50%", transform: "translateX(-50%)", bottom: -half };
                              case "sw": return { ...base, left: -half, bottom: -half };
                              case "w": return { ...base, left: -half, top: "50%", transform: "translateY(-50%)" };
                              default: return base;
                            }
                          };
                          return (
                            <div
                              key={handle}
                              style={getStyle()}
                              onPointerDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
                                if (!active) return;
                                const scale = displaySize.width > 0 ? displaySize.width / active.newW : 1;
                                setResizing({
                                  handle,
                                  startX: e.clientX,
                                  startY: e.clientY,
                                  startW: displaySize.width,
                                  startH: displaySize.height,
                                  startActualW: active.newW,
                                  startActualH: active.newH,
                                  scale,
                                });
                              }}
                            />
                          );
                        })}
                        {/* Size label */}
                        <div className="absolute -bottom-6 left-0 px-2 py-1 bg-black/70 text-white text-xs rounded whitespace-nowrap">
                          {active.newW} × {active.newH}px
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="w-full md:w-64 shrink-0">
                  <div className="text-sm mb-2 font-medium">Preview (live)</div>
                  <div className="border dark:border-white/10 border-black/10 rounded p-3">
                    <div className="mb-2 text-sm">
                      <strong>Original:</strong> {active.original.w} × {active.original.h} • {formatBytes(active.original.bytes)}
                    </div>
                    <div className="mb-2 text-sm">
                      <strong>New:</strong>{" "}
                      <span className="font-medium text-primary">{active.newW} × {active.newH}</span>
                    </div>
                    <div className="mb-2 text-sm">
                      <strong>Estimated Size:</strong>{" "}
                      <span className={estimateNewSize(active) > active.original.bytes ? "text-red-500" : "text-green-500"}>
                        ~{formatBytes(estimateNewSize(active))}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button onClick={applyAndDownloadActive} className="flex-1 flex items-center justify-center gap-2 rounded-lg h-10 dark:bg-black-10 border bg-black/10 border-black/10 dark:border-white/10 text-black cursor-pointer transition-all hover:scale-105 active:scale-95 dark:text-white text-sm">
                        <Download size={16} /> Download
                      </button>
                      <button
                        onClick={() =>
                          resizeImageToBlob(active).then((b) =>
                            setQueue((q) => q.map((it) => (it.id === active.id ? { ...it, appliedBlob: b } : it)))
                          )
                        }
                        className="rounded-lg cursor-pointer transition-all hover:scale-105 active:scale-95 h-10 px-4 border text-sm"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 text-center">
                <ImageIcon className="size-14 text-black/50 dark:text-white/50" />
                <p className="text-black/50 dark:text-white/50">Upload an image to see the preview</p>
              </div>
            )}
          </div>

          {/* Queue */}
          <div className="flex flex-col p-6 bg-white/5 dark:bg-black/20 rounded-xl border border-black/10 dark:border-white/10">
            <h2 className="text-xl font-bold mb-4">Image Queue ({queue.length})</h2>
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              {queue.map((it) => (
                <div key={it.id} className="relative shrink-0">
                  <img
                    onClick={() => selectItem(it.id)}
                    className={`w-24 h-20 object-cover rounded-lg cursor-pointer ${it.id === activeId ? "border-2 border-primary" : "opacity-90"}`}
                    src={it.url}
                    alt={it.file.name}
                  />
                  <button onClick={() => removeItem(it.id)} title="close" className="absolute -top-2 -right-2 bg-red-500 transition-all hover:scale-105 cursor-pointer active:scale-95 text-white rounded-full p-0.5">
                    <X />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Details & Actions */}
          <div className="flex flex-col p-6 bg-white/5 dark:bg-black/20 rounded-xl border border-black/10 dark:border-white/10">
            <h2 className="text-xl font-bold mb-4">Image Details</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-6">
              {[
                { label: "Original Dimensions", value: active ? `${active.original.w} x ${active.original.h}` : "—" },
                { label: "New Dimensions", value: active ? `${active.newW} x ${active.newH}` : "—", highlight: "text-primary" },
                { label: "Original Size", value: active ? formatBytes(active.original.bytes) : "—" },
                {
                  label: "Estimated New Size",
                  value: active ? `~${formatBytes(active ? estimateNewSize(active) : 0)}` : "—",
                  highlight: active && estimateNewSize(active) > active.original.bytes ? "text-red-500" : "text-green-500",
                },
              ].map((row) => (
                <div className="flex justify-between items-baseline" key={row.label}>
                  <span className="text-black/50 dark:text-white/50">{row.label}</span>
                  <span className={`font-medium ${row.highlight ?? "text-gray-800 dark:text-white"}`}>{row.value}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={applyAndDownloadActive} className="flex-1 flex items-center justify-center gap-2 rounded-lg h-12 dark:border-white/10 dark:bg-black/10 border-black/10 transition-all border hover:scale-105 active:scale-95 cursor-pointer text-primary">
                <Download /> <span>Apply & Download</span>
              </button>
              <button onClick={downloadAllZip} className="flex-1 flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 gap-2 rounded-lg h-12 bg-gray-700/50 text-primary">
                <FolderDown /> <span>Download All (.zip)</span>
              </button>
              <button onClick={clearAll} className="flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 px-4 py-2 rounded-lg h-12 border text-red-500">
                <Trash2 /> <span>Clear All</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resize;
