"use client";

import React, { useState, useRef } from "react";
import { Rnd } from "react-rnd";
import { HexColorPicker } from "react-colorful";
import { saveAs } from "file-saver";
import { Trash2, Download } from "lucide-react";

interface WatermarkText {
  id: number;
  text: string;
  font: string;
  color: string;
  size: number;
  opacity: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  blendMode: string;
  x: number;
  y: number;
  rotation: number;
}

interface WatermarkImage {
  id: number;
  src: string;
  width: number;
  height: number;
  opacity: number;
  blendMode: string;
  x: number;
  y: number;
  rotation: number;
  tilt: boolean;
}

const Watermark = () => {
  const [images, setImages] = useState<File[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [textWatermarks, setTextWatermarks] = useState<WatermarkText[]>([]);
  const [imageWatermarks, setImageWatermarks] = useState<WatermarkImage[]>([]);
  const [textInput, setTextInput] = useState("Explore More");
  const [selectedFont, setSelectedFont] = useState("Arial");
  const [selectedColor, setSelectedColor] = useState("#FFFFFF");
  const [fontSize, setFontSize] = useState(64);
  const [opacity, setOpacity] = useState(50);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [blendMode, setBlendMode] = useState("overlay");
  const [activeTab, setActiveTab] = useState<"text" | "image">("text");
  const [tilt, setTilt] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageWatermarkInputRef = useRef<HTMLInputElement>(null);

  const fontOptions = ["Arial", "Times New Roman", "Space Grotesk", "Helvetica", "Roboto", "Poppins", "Montserrat", "Courier New", "Georgia", "Verdana"];
  const blendModes = ["normal", "overlay", "screen", "multiply", "lighten"];

  const handleFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    setImages(prev => [...prev, ...fileArray]);
    if (selectedImageIndex === null && fileArray.length > 0) setSelectedImageIndex(0);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (selectedImageIndex === index) setSelectedImageIndex(null);
  };

  const addTextWatermark = () => {
    const id = Date.now();
    setTextWatermarks(prev => [
      ...prev,
      {
        id,
        text: textInput,
        font: selectedFont,
        color: selectedColor,
        size: fontSize,
        opacity,
        bold,
        italic,
        underline,
        blendMode,
        x: 100,
        y: 100,
        rotation: 0,
      },
    ]);
  };

  const addImageWatermark = (file: File) => {
    const id = Date.now();
    const src = URL.createObjectURL(file);
    setImageWatermarks(prev => [
      ...prev,
      {
        id,
        src,
        width: 200,
        height: 200,
        opacity,
        blendMode,
        x: 100,
        y: 100,
        rotation: 0,
        tilt: false,
      },
    ]);
  };

  const applyToAll = () => {
    if (images.length === 0) return;
    alert("Watermarks applied to all images! (Visual demo, implement export logic as needed)");
  };

  const handleDownload = () => {
    if (selectedImageIndex === null) return;
    const img = images[selectedImageIndex];
    saveAs(img, img.name);
  };

  return (
    <div className="p-6 flex flex-col lg:flex-row gap-6 h-full">
      {/* Left Panel */}
      <div className="flex flex-col gap-6 lg:w-1/3 overflow-y-auto max-h-screen">
        {/* Tabs */}
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded ${activeTab === "text" ? "bg-primary text-white" : "bg-gray-700 text-gray-300"}`}
            onClick={() => setActiveTab("text")}
          >
            Text Watermark
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === "image" ? "bg-primary text-white" : "bg-gray-700 text-gray-300"}`}
            onClick={() => setActiveTab("image")}
          >
            Image Watermark
          </button>
        </div>

        {/* Upload Images */}
        <div
          className="flex flex-col items-center gap-4 border-2 border-dashed border-gray-500 rounded-lg py-6 px-4 cursor-pointer text-center"
          onDrop={(e) => {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
          }}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          <span className="material-symbols-outlined text-4xl text-gray-400">add_photo_alternate</span>
          <p className="text-white font-bold">Drag & Drop or Click to Add Images</p>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </div>

        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
          {images.map((img, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-2 rounded-lg border ${selectedImageIndex === index ? "border-primary" : "border-gray-600"}`}
              onClick={() => setSelectedImageIndex(index)}
            >
              <img
                src={URL.createObjectURL(img)}
                className="w-16 h-10 object-cover rounded"
              />
              <div className="flex-grow">
                <p className="text-sm text-white truncate">{img.name}</p>
                <p className="text-xs text-gray-400">{(img.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button onClick={() => removeImage(index)}>
                <Trash2 className="text-gray-400 hover:text-white" />
              </button>
            </div>
          ))}
        </div>

        {/* Conditional Panels */}
        {activeTab === "text" && (
          <div className="p-4 rounded-xl bg-gray-800 border border-gray-700 flex flex-col gap-3">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Watermark Text"
              className="w-full p-2 rounded-lg bg-gray-700 text-white"
            />
            <div className="grid grid-cols-2 gap-2">
              <select value={selectedFont} onChange={(e) => setSelectedFont(e.target.value)} className="bg-gray-700 text-white rounded p-1">
                {fontOptions.map(f => <option key={f}>{f}</option>)}
              </select>
              <input type="color" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} className="w-full h-8 p-0 border-none cursor-pointer"/>
            </div>
            <div className="flex gap-2">
              <input type="number" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} min={12} max={200} className="w-1/2 p-1 rounded bg-gray-700 text-white"/>
              <input type="number" value={opacity} onChange={(e) => setOpacity(parseInt(e.target.value))} min={0} max={100} className="w-1/2 p-1 rounded bg-gray-700 text-white"/>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setBold(prev => !prev)} className={`${bold ? "bg-primary" : "bg-gray-700"} px-2 rounded text-white`}>B</button>
              <button onClick={() => setItalic(prev => !prev)} className={`${italic ? "bg-primary" : "bg-gray-700"} px-2 rounded text-white`}>I</button>
              <button onClick={() => setUnderline(prev => !prev)} className={`${underline ? "bg-primary" : "bg-gray-700"} px-2 rounded text-white`}>U</button>
            </div>
            <select value={blendMode} onChange={(e) => setBlendMode(e.target.value)} className="bg-gray-700 text-white rounded p-1">
              {blendModes.map(b => <option key={b}>{b}</option>)}
            </select>
            <button onClick={addTextWatermark} className="bg-primary text-white rounded p-2 mt-2">Add Text Watermark</button>
          </div>
        )}

        {activeTab === "image" && (
          <div className="p-4 rounded-xl bg-gray-800 border border-gray-700 flex flex-col gap-3">
            <div
              className="border-2 border-dashed border-gray-500 rounded-lg py-4 px-2 text-center cursor-pointer"
              onClick={() => imageWatermarkInputRef.current?.click()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files[0]) addImageWatermark(e.dataTransfer.files[0]);
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              Upload Watermark Image
              <input
                type="file"
                ref={imageWatermarkInputRef}
                className="hidden"
                onChange={(e) => e.target.files && addImageWatermark(e.target.files[0])}
              />
            </div>
            <div className="flex gap-2 items-center">
              <input type="range" min={0} max={100} value={opacity} onChange={(e) => setOpacity(parseInt(e.target.value))} className="flex-1"/>
              <input type="number" min={0} max={100} value={opacity} onChange={(e) => setOpacity(parseInt(e.target.value))} className="w-16 p-1 rounded bg-gray-700 text-white"/>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-white">Tilt</label>
              <input type="checkbox" checked={tilt} onChange={() => setTilt(prev => !prev)}/>
            </div>
          </div>
        )}

        {/* Download / Apply All */}
        <div className="flex flex-col gap-2">
          <button onClick={handleDownload} className="flex items-center gap-2 bg-primary text-white p-2 rounded"><Download /> Download</button>
          <button onClick={applyToAll} className="flex items-center gap-2 bg-gray-700 text-white p-2 rounded">Apply All</button>
        </div>
      </div>

      {/* Right Preview */}
      <div className="relative flex-1 min-h-[400px] rounded-xl border border-gray-700 bg-gray-900 flex items-center justify-center overflow-hidden">
        {selectedImageIndex !== null && (
          <img
            src={URL.createObjectURL(images[selectedImageIndex])}
            className="max-w-full max-h-full object-contain"
          />
        )}

        {/* Text Watermarks */}
        {textWatermarks.map((wm) => (
          <Rnd
            key={wm.id}
            default={{ x: wm.x, y: wm.y, width: wm.text.length * wm.size * 0.6, height: wm.size + 10 }}
            bounds="parent"
            onDragStop={(e, d) => setTextWatermarks(prev => prev.map(t => t.id === wm.id ? { ...t, x: d.x, y: d.y } : t))}
            onResizeStop={(e, dir, ref, delta, pos) => setTextWatermarks(prev => prev.map(t => t.id === wm.id ? { ...t, size: parseInt(ref.style.height), ...pos } : t))}
          >
            <p
              className="select-none cursor-move"
              style={{
                fontSize: wm.size,
                fontFamily: wm.font,
                fontWeight: wm.bold ? "bold" : "normal",
                fontStyle: wm.italic ? "italic" : "normal",
                textDecoration: wm.underline ? "underline" : "none",
                color: wm.color,
                opacity: wm.opacity / 100,
                mixBlendMode: wm.blendMode as any,
                transform: `rotate(${wm.rotation}deg)`,
              }}
              onDoubleClick={() => setTextInput(wm.text)}
            >
              {wm.text}
            </p>
          </Rnd>
        ))}

        {/* Image Watermarks */}
        {imageWatermarks.map((wm) => (
          <Rnd
            key={wm.id}
            default={{ x: wm.x, y: wm.y, width: wm.width, height: wm.height }}
            bounds="parent"
            onDragStop={(e, d) => setImageWatermarks(prev => prev.map(i => i.id === wm.id ? { ...i, x: d.x, y: d.y } : i))}
            onResizeStop={(e, dir, ref, delta, pos) => setImageWatermarks(prev => prev.map(i => i.id === wm.id ? { ...i, width: ref.offsetWidth, height: ref.offsetHeight, ...pos } : i))}
          >
            <img
              src={wm.src}
              className="select-none cursor-move"
              style={{
                opacity: wm.opacity / 100,
                mixBlendMode: wm.blendMode as any,
                transform: `rotate(${wm.rotation}deg) ${wm.tilt ? "skewX(15deg)" : ""}`,
              }}
            />
          </Rnd>
        ))}
      </div>
    </div>
  );
};

export default Watermark;
