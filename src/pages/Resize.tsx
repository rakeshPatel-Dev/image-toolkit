// Resize.tsx (optimized)
import React, { useRef, useState, useEffect } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Download, FolderDown, Image as ImageIcon, LockKeyhole, Trash2, Upload, X } from "lucide-react";

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
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [scale, setScale] = useState(100);
  const [showAllPresets, setShowAllPresets] = useState(false);

  const active = queue.find((q) => q.id === activeId);

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

  const updateActiveDims = (partial: Partial<{ newW: number; newH: number; scale: number }>) => {
    if (!activeId) return;
    setQueue((q) =>
      q.map((item) => {
        if (item.id !== activeId) return item;
        let { newW, newH, scale } = { ...item, ...partial };
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
        <h1 className="text-4xl font-black text-gray-900 dark:text-white">Image Resizer</h1>
        <p className="text-base text-gray-500 dark:text-gray-400">Instantly resize, scale, and adjust your images.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Left Controls */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Drop Zone */}
          <div ref={dropRef} className="flex flex-col p-4 bg-white/5 dark:bg-black/20 rounded-xl border border-black/10 dark:border-white/10">
            <div className="flex flex-col items-center gap-6 rounded-lg border-2 cursor-pointer border-dashed border-gray-500/50 dark:border-white/20 px-6 py-14">
              <div className="text-center flex flex-col items-center max-w-[480px]">
              <Upload className=" size-16"/>
                <p className="text-lg font-bold">Drag & Drop Images Here</p>
                <p className="text-sm text-gray-500">Or click the button below to browse your files.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={onBrowseClick} className="flex items-center justify-center border h-10 px-4 dark:bg-black/10 bg-black/5 dark:text-white rounded-lg dark:border-white/10 text-black border-black/10 cursor-pointer hover:scale-105 active:scale-95 transition-all">
                  Upload Images
                </button>
                <button onClick={clearAll} className="flex items-center justify-center bg-red-600 cursor-pointer hover:bg-red-700 transition-all hover:scale-105 active:scale-95 h-10 px-4 border rounded-lg text-white text-sm">
                  Clear All
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
              <input type="range" min={1} max={200} value={active?.scale ?? scale} onChange={(e) => onScaleChange(Number(e.target.value))} className="w-full h-2 rounded-lg" />
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
          <div className="flex flex-col items-center justify-center p-6 bg-white/5 dark:bg-black/20 rounded-xl aspect-video border dark:border-white/10 border-black/10">
            {active ? (
              <div className="w-full flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg p-4 overflow-auto">
                  <img src={active.url} alt="preview" style={{ width: `${active.newW}px`, height: "auto", maxWidth: "100%", maxHeight: "100%" }} className="object-contain" />
                </div>
                <div className="w-full md:w-64">
                  <div className="text-sm mb-2">Preview (live)</div>
                  <div className=" border dark:border-white/10 border-black/10 rounded p-3">
                    <div className="mb-2">
                      <strong>Original:</strong> {active.original.w} x {active.original.h} • {formatBytes(active.original.bytes)}
                    </div>
                    <div className="mb-2">
                      <strong>New:</strong>{" "}
                      <span className="font-medium text-primary">{active.newW} x {active.newH}</span>
                    </div>
                    <div className="mb-2">
                      <strong>Estimated Size:</strong>{" "}
                      <span className={estimateNewSize(active) > active.original.bytes ? "text-red-500" : "text-green-500"}>
                        ~{formatBytes(estimateNewSize(active))}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button onClick={applyAndDownloadActive} className="flex-1 flex items-center justify-center gap-2 rounded-lg h-10 dark:bg-black-10 border bg-black/10 border-black/10  dark:border-white/10 text-black cursor-pointer transition-all hover:scale-105 active:scale-95 dark:text-white">
                        <Download /> Download
                      </button>
                      <button
                        onClick={() =>
                          resizeImageToBlob(active).then((b) =>
                            setQueue((q) => q.map((it) => (it.id === active.id ? { ...it, appliedBlob: b } : it)))
                          )
                        }
                        className="rounded-lg cursor-pointer transition-all hover:scale-105 active:scale-95 h-10 px-4 border"
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
