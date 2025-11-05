"use client";

import { useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { X, Download, Upload, Plus } from "lucide-react";
import { TextAnimate } from "@/components/ui/text-animate";
import FadeInText from "@/components/ui/FadeInText";

interface UploadedFile {
  file: File;
  preview: string;
  convertedBlob?: Blob;
  convertedType?: string;
  originalSize?: number;
  newSize?: number;
  originalWidth?: number;
  originalHeight?: number;
  selectedForZip?: boolean;
}

const Convert: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [targetFormat, setTargetFormat] = useState<string>("JPG");
  const [quality, setQuality] = useState<number>(85);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const resetState = () => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
    setIsConverting(false);
  };

  const handleFileUpload = (fileList: FileList) => {
    const uploadedFiles: UploadedFile[] = Array.from(fileList).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      originalSize: file.size,
      selectedForZip: true,
    }));
    setFiles((prev) => [...prev, ...uploadedFiles]);
    toast.success(`${uploadedFiles.length} file(s) uploaded`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFileUpload(e.target.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) handleFileUpload(e.dataTransfer.files);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const removeFile = (index: number) => {
    const newFiles = [...files];
    URL.revokeObjectURL(newFiles[index].preview);
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const toggleSelect = (index: number) => {
    const newFiles = [...files];
    newFiles[index].selectedForZip = !newFiles[index].selectedForZip;
    setFiles(newFiles);
  };

  const convertFile = (file: File, type: string, quality: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 1920;
        let w = img.width;
        let h = img.height;
        if (w > h && w > maxDim) {
          h = (h / w) * maxDim;
          w = maxDim;
        } else if (h > w && h > maxDim) {
          w = (w / h) * maxDim;
          h = maxDim;
        }
        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("Canvas error");
        ctx.drawImage(img, 0, 0, w, h);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject("Conversion failed");
            resolve(blob);
          },
          type === "JPG" ? "image/jpeg" : `image/${type.toLowerCase()}`,
          ["JPG", "WEBP"].includes(type) ? quality / 100 : undefined
        );
      };
      img.onerror = () => reject("Image load error");
    });
  };

  const handleConvert = async () => {
    if (!files.length) return toast.error("No files to convert!");
    setIsConverting(true);

    const convertedFiles: UploadedFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      try {
        const blob = await convertFile(f.file, targetFormat, quality);
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.src = url;
        await new Promise((res) => (img.onload = res));

        const newSize = Math.min(blob.size, f.originalSize || blob.size);

        convertedFiles.push({
          ...f,
          convertedBlob: blob,
          convertedType: targetFormat,
          newSize,
          originalWidth: img.width,
          originalHeight: img.height,
        });
      } catch {
        toast.error(`Failed to convert ${f.file.name}`);
      }
    }

    setFiles(convertedFiles);
    setIsConverting(false);
    toast.success("Conversion complete!");
  };

  const handleDownloadFile = (f: UploadedFile) => {
    if (!f.convertedBlob) return;
    saveAs(
      f.convertedBlob,
      `converted_${f.file.name.replace(/\.[^/.]+$/, "")}.${f.convertedType?.toLowerCase()}`
    );
  };

  const handleDownloadSelectedZip = async () => {
    const selectedFiles = files.filter((f) => f.selectedForZip && f.convertedBlob);
    if (!selectedFiles.length) return toast.error("No files selected for ZIP!");
    const zip = new JSZip();
    selectedFiles.forEach((f) =>
      zip.file(
        `converted_${f.file.name.replace(/\.[^/.]+$/, "")}.${f.convertedType?.toLowerCase()}`,
        f.convertedBlob!
      )
    );
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "ConvertedImages.zip");
  };

  const formatSize = (size?: number) => {
    if (!size) return "";
    if (size < 1024) return size + " B";
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + " KB";
    return (size / (1024 * 1024)).toFixed(1) + " MB";
  };

  const isQualityApplicable = ["JPG", "WEBP"].includes(targetFormat);

  return (
    <main className="flex flex-col gap-8 py-10 mt-10 px-4 max-w-6xl mx-auto">
      <Toaster position="top-right" />

      {/* Page Heading */}
      <div className="flex flex-col gap-2">
        <FadeInText text="Convert Image Format" className="text-[#0f0f0f] dark:text-white text-4xl md:text-5xl font-black animate-fadeIn">
        </FadeInText>
        <TextAnimate animation="fadeIn" by="word" className="text-gray-400 text-base md:text-lg animate-fadeIn">
          Change your JPG, PNG, GIF, and more in seconds. Drag and drop your files to start.
        </TextAnimate>
      </div>

      {/* Upload Area */}
      <div
        className="flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-gray-200 shadow-md px-6 py-14 hover:border-orange-600 transition-colors duration-300 group cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-12 h-12 text-primary transition-transform duration-300 group-hover:scale-110" />
        <p className="text-[#0f0f0f] dark:text-white text-lg font-bold text-center">
          Drag & Drop Your Images Here
        </p>
        <p className="text-gray-400 text-sm text-center">
          Upload single or multiple images for conversion.
        </p>
        <button className="flex items-center gap-2 mt-2 px-4 h-10 rounded-lg border cursor-pointer bg-black/10 dark:bg-white/10 border-gray-400 dark:text-white group text-sm font-bold hover:scale-105 active:scale-95 transition-all">
          <Plus className="w-4 h-4" /> Choose Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          multiple
        />
        {files.length > 0 && (
          <p className="text-green-600 font-semibold font-mono text-md mt-2">
            {files.length} file{files.length > 1 ? "s" : ""} uploaded
          </p>
        )}
      </div>

      {/* Format Selection & Quality */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 flex flex-col gap-4">
          <h2 className=" text-[#0f0f0f] dark:text-white text-xl font-bold border-b dark:border-white/10 border-black/20  pb-2">
            Select Output Format
          </h2>
          <div className="flex gap-3 flex-wrap">
            {["JPG", "PNG", "WEBP", "GIF", "BMP"].map((f) => (
              <button
                key={f}
                onClick={() => setTargetFormat(f)}
                className={` cursor-pointer flex h-10 items-center justify-center px-4 rounded-lg text-sm font-medium transition-colors ${targetFormat === f ? "bg-primary dark:text-[#0f0f0f] text-white scale-85" : "dark:bg-white/10 bg-black/80 text-white hover:bg-black/70"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-xl bg-[#0f0f0f]/90 border dark:border-white/10 p-4">
          <h3 className="text-white font-bold flex justify-between items-center">
            Quality {isQualityApplicable && <span className="text-sm text-gray-300">{quality}{`%`}</span>}
          </h3>
          <input title="Choose Quality"
            type="range"
            min={0}
            max={100}
            value={quality}
            disabled={!isQualityApplicable}
            onChange={(e) => setQuality(parseInt(e.target.value))}
            className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${isQualityApplicable ? "accent-primary bg-gray-200" : "bg-gray-500 cursor-not-allowed"
              }`}
          />
          {!isQualityApplicable && (
            <p className="text-xs text-gray-300 mt-1">Not applicable for this file type</p>
          )}
        </div>
      </div>

      {/* File Queue */}
      {files.length > 0 && (
        <div className="flex flex-col gap-4 select-none"> {/* prevents selecting text/images */}
          <div className="flex justify-between items-center border-b dark:border-white/10 border-black/20 pb-2 flex-wrap gap-2">
            <h2 className="text-[#0f0f0f] dark:text-white text-xl font-bold">
              Image Queue ({files.length})
            </h2>
            <div className="flex gap-2 flex-wrap">
              {files.some((f) => f.convertedBlob) && (
                <button
                  onClick={handleDownloadSelectedZip}
                  className="cursor-pointer flex items-center gap-2 px-4 h-10 bg-green-600 text-white rounded-lg active:scale-95 hover:bg-green-700 transition-all"
                >
                  <Download className="w-4 h-4" /> Download Selected ZIP
                </button>
              )}
              <button
                onClick={resetState}
                className="cursor-pointer flex items-center gap-2 px-4 h-10 bg-red-500 text-white rounded-lg active:scale-95 hover:bg-red-600 transition-all"
              >
                <X className="w-4 h-4" /> Clear Queue
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {files.map((f, i) => (
              <div
                key={i}
                onClick={() => f.convertedBlob && toggleSelect(i)} // select card
                className={`hover:scale-[1.02] transition-all bg-black/90 border ${f.selectedForZip ? "border-orange-500" : "border-white/10"
                  } rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start cursor-pointer`}
                style={{ userSelect: "none" }} // prevent image/text selection
              >
                <img
                  className="w-full md:w-32 h-32 md:h-auto object-cover rounded-lg pointer-events-none select-none"
                  src={f.preview}
                  alt={f.file.name}
                  draggable={false}
                />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-white font-bold truncate">{f.file.name}</p>
                  </div>
                  <div className="text-xs text-gray-400 space-y-1">
                    <p>
                      <span className="font-semibold text-gray-300">Original:</span>{" "}
                      {f.originalWidth ? `${f.originalWidth}x${f.originalHeight}` : ""},{" "}
                      {formatSize(f.originalSize)}
                    </p>
                    {f.convertedBlob && (
                      <p>
                        <span className="font-semibold text-gray-300">
                          New ({f.convertedType}):
                        </span>{" "}
                        {f.originalWidth && f.originalHeight
                          ? `${f.originalWidth}x${f.originalHeight}`
                          : ""}
                        , {formatSize(f.newSize)}{" "}
                        <span className="text-green-400 font-bold">
                          {f.newSize && f.originalSize
                            ? `(-${Math.round(
                              100 - (f.newSize / f.originalSize) * 100
                            )}%)`
                            : ""}
                        </span>
                      </p>
                    )}
                  </div>
                  {f.convertedBlob && (
                    <div className="flex items-center gap-2 mt-auto pt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadFile(f);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-3 h-9 border border-stone-500/50 text-white rounded-lg hover:bg-green-500/50 cursor-pointer transition-all"
                      >
                        <Download className="w-4 h-4" /> Download
                      </button>
                      <button
                        title="Remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(i);
                        }}
                        className="flex cursor-pointer items-center justify-center h-9 w-9 bg-white/10 text-white rounded-lg hover:bg-red-500/80 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* Global Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mt-4 items-center justify-center border-t border-black/20 dark:border-white/10 pt-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer flex items-center justify-center gap-2 px-6 h-12 dark:bg-white/10 active:scale-95 bg-black/80 text-white rounded-lg hover:bg-black/70 transition-all dark:hover:bg-white/20"
        >
          <Plus className="w-4 h-4" /> Add More Files
        </button>
        <button
          onClick={handleConvert}
          className="flex items-center justify-center gap-2 px-6 h-12 bg-orange-600 active:scale-95 text-white rounded-lg hover:bg-orange-700/90 cursor-pointer transition-all"
        >
          <Download className="w-4 h-4" /> {isConverting ? "Converting..." : "Convert & Download All"}
        </button>
      </div>
    </main>
  );
};

export default Convert;
