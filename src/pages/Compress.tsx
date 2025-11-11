import React, { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import toast from "react-hot-toast";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
    ArrowRight,
    ChevronsLeftRight,
    Download,
    Plus,
    Upload,
    X,
} from "lucide-react";
import { TextAnimate } from "@/components/ui/text-animate";
import FadeInText from "@/components/ui/FadeInText";

interface ImageType {
    file: File;
    preview: string;
    compressedFile: File | null;
    originalSize: number;
    compressedSize: number | null;
    name: string;
}

const Compress: React.FC = () => {
    const [images, setImages] = useState<ImageType[]>([]);
    const [quality, setQuality] = useState<number>(75);
    const [progressive, setProgressive] = useState<boolean>(false);
    const [convertToWebP, setConvertToWebP] = useState<boolean>(true);
    const [targetSizeKB, setTargetSizeKB] = useState<number | undefined>();
    const [sliderPos, setSliderPos] = useState<number>(50);
    const [currentPreviewIndex, setCurrentPreviewIndex] = useState<number>(0);

    const sliderRef = useRef<HTMLDivElement>(null);

    const onDrop = async (acceptedFiles: File[]) => {
        const filesWithPreview: ImageType[] = acceptedFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
            compressedFile: null,
            originalSize: file.size,
            compressedSize: null,
            name: file.name,
        }));
        setImages((prev) => [...prev, ...filesWithPreview]);
        toast.success(`${acceptedFiles.length} image(s) added`);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const compressImage = async (image: ImageType): Promise<File | null> => {
        try {
            const maxWidthOrHeight = 2000;
            let compressedFile: File = image.file;
            let currentQuality = quality / 100;

            for (let i = 0; i < 10; i++) {
                const options: any = {
                    maxSizeMB: compressedFile.size / 1024 / 1024,
                    maxWidthOrHeight,
                    useWebWorker: true,
                    initialQuality: currentQuality,
                    fileType: convertToWebP ? "image/webp" : image.file.type,
                    alwaysKeepResolution: true,
                    exifOrientation: null,
                };

                const tempCompressed = await imageCompression(compressedFile, options);

                if ((targetSizeKB && tempCompressed.size / 1024 <= targetSizeKB) || currentQuality <= 0.3) {
                    compressedFile = tempCompressed;
                    break;
                }

                compressedFile = tempCompressed;
                currentQuality -= 0.1;
            }

            return compressedFile;
        } catch (err) {
            toast.error("Compression failed");
            console.error(err);
            return null;
        }
    };

    const handleBatchCompress = async () => {
        if (!images.length) return;
        toast.loading("Compressing images...");
        const updatedImages: ImageType[] = [];

        for (const img of images) {
            const compressedFile = await compressImage(img);
            if (compressedFile) {
                updatedImages.push({
                    ...img,
                    compressedFile,
                    compressedSize: compressedFile.size,
                });
            } else {
                updatedImages.push(img);
            }
        }

        setImages(updatedImages);
        toast.dismiss();
        toast.success("Batch compression completed!");
    };

    const handleDownload = (image: ImageType) => {
        if (!image.compressedFile) return;
        const url = URL.createObjectURL(image.compressedFile);
        const ext = convertToWebP ? "webp" : image.name.split(".").pop();
        const link = document.createElement("a");
        link.href = url;
        link.download = `compressed_${image.name.split(".")[0]}.${ext}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleDownloadCurrent = () => {
        handleDownload(images[currentPreviewIndex]);
    };

    const handleDownloadAll = async () => {
        if (!images.length) return;
        const zip = new JSZip();
        images.forEach((img) => {
            if (img.compressedFile) {
                const ext = convertToWebP ? "webp" : img.name.split(".").pop();
                zip.file(`compressed_${img.name.split(".")[0]}.${ext}`, img.compressedFile);
            }
        });
        const blob = await zip.generateAsync({ type: "blob" });
        saveAs(blob, "Compressed_Images.zip");
        toast.success("All images downloaded as ZIP!");
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        if (currentPreviewIndex >= index && currentPreviewIndex > 0) {
            setCurrentPreviewIndex((prev) => prev - 1);
        }
        toast("Image removed");
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!sliderRef.current) return;
        const rect = sliderRef.current.getBoundingClientRect();
        let percent = ((e.clientX - rect.left) / rect.width) * 100;
        percent = Math.max(0, Math.min(100, percent));
        setSliderPos(percent);
    };

    return (
        <div className="relative">
            <main className="flex flex-col mt-10 items-center w-full px-3 sm:px-4 md:px-6 lg:px-8 py-10 md:py-16 gap-10">
                {/* Heading */}
                <div className="flex flex-col items-center text-center gap-3 px-2">
                    <FadeInText
                        text="Compress Image"
                        className="text-[#0f0f0f] dark:text-white text-3xl sm:text-4xl md:text-5xl font-black"
                    />
                    <TextAnimate
                        animation="fadeIn"
                        by="word"
                        className="text-gray-700 dark:text-gray-300 max-w-md text-sm sm:text-base"
                    >
                        Fine-tune compression with advanced controls and handle multiple images with ease.
                    </TextAnimate>
                </div>

                {/* Main Grid */}
                <div className="grid w-full max-w-7xl grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3">
                    {/* Left: Preview + Stats */}
                    <div className="flex flex-col gap-6 lg:col-span-2">
                        {images.length > 0 ? (
                            <div
                                className="relative w-full aspect-video overflow-hidden rounded-xl border border-gray-500/40 bg-white/5 select-none"
                                ref={sliderRef}
                                onMouseMove={(e) => e.buttons === 1 && handleMouseMove(e)}
                            >
                                <img
                                    src={images[currentPreviewIndex].preview}
                                    alt="original"
                                    className="absolute inset-0 h-full w-full object-cover pointer-events-none"
                                />
                                {images[currentPreviewIndex].compressedFile && (
                                    <img
                                        src={URL.createObjectURL(images[currentPreviewIndex].compressedFile)}
                                        alt="compressed"
                                        className="absolute top-0 left-0 h-full object-cover pointer-events-none"
                                        style={{ width: `${sliderPos}%` }}
                                    />
                                )}
                                <div className="absolute top-3 left-3 rounded-md bg-black/60 px-2 py-1 text-xs sm:text-sm font-bold text-white">
                                    BEFORE
                                </div>
                                <div className="absolute top-3 right-3 rounded-md bg-black/30 px-2 py-1 text-xs sm:text-sm font-bold text-white">
                                    AFTER
                                </div>
                                <div
                                    className="absolute inset-y-0 w-[2px] bg-[#0f0f0f] dark:bg-white/60 cursor-ew-resize"
                                    style={{ left: `${sliderPos}%` }}
                                >
                                    <div className="absolute top-1/2 -left-3 -translate-y-1/2 bg-gray-500/50 flex items-center justify-center rounded-full border-2 border-gray-500/50 shadow-md p-1">
                                        <ChevronsLeftRight size={18} />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div
                                {...getRootProps()}
                                className="flex h-72 sm:h-80 w-full cursor-pointer flex-col items-center gap-2 justify-center rounded-xl border-2 border-dashed border-gray-400/60 bg-white/60 dark:bg-[#0f0f0f]/70 group hover:border-orange-500/80 transition-all p-4 sm:p-6 text-center"
                            >
                                <input {...getInputProps()} />
                                <Upload className="group-hover:scale-110 transition-all  text-black dark:text-white mb-3 h-14 w-14 sm:h-16 sm:w-16" />
                                <p className="text-[#0f0f0f] dark:text-white font-semibold text-base sm:text-lg">
                                    Drag & Drop images here or click to upload
                                </p>
                                <p className="text-gray-400 font-semibold text-sm">
                                    OR,
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    Upload single or multiple image for size compression.
                                </p>
                                {/* 🟠 Added Browse Button */}
                                <button
                                    type="button"
                                    className="flex items-center gap-2 mt-2 px-4 h-10 rounded-lg border cursor-pointer bg-black/10 dark:bg-white/10 border-gray-400 dark:text-white group text-sm font-bold hover:scale-105 active:scale-95 transition-all"
                                >
                                    <Plus size={16} /> Choose to Browse
                                </button>

                            </div>
                        )}

                        {/* Stats */}
                        {images.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                                <div className="flex flex-col gap-1 sm:gap-2 rounded-lg border border-gray-400/20 bg-white/10 dark:bg-white/5 p-3 sm:p-4">
                                    <p className="text-xs sm:text-sm font-medium text-black/80 dark:text-white/80">Original Size</p>
                                    <p className="text-lg sm:text-2xl font-bold text-primary">
                                        {(images[currentPreviewIndex].originalSize / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                                <div className="flex flex-col gap-1 sm:gap-2 rounded-lg border border-gray-400/20 bg-white/10 dark:bg-white/5 p-3 sm:p-4">
                                    <p className="text-xs sm:text-sm font-medium text-black/80 dark:text-white/80">Compressed Size</p>
                                    <p className="text-lg sm:text-2xl font-bold text-primary">
                                        {images[currentPreviewIndex].compressedSize
                                            ? (images[currentPreviewIndex].compressedSize / 1024 / 1024).toFixed(2)
                                            : "--"}{" "}
                                        MB
                                    </p>
                                    <p className="text-xs sm:text-sm font-normal text-black/70 dark:text-white/70">
                                        Quality: {quality}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-1 sm:gap-2 rounded-lg border-2 border-green-500/40 bg-green-300/50 dark:bg-green-900/20 p-3 sm:p-4">
                                    <p className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-400">You Saved</p>
                                    <p className="text-lg sm:text-2xl font-bold text-green-800 dark:text-green-400">
                                        {images[currentPreviewIndex].compressedSize
                                            ? (
                                                ((images[currentPreviewIndex].originalSize -
                                                    images[currentPreviewIndex].compressedSize) /
                                                    images[currentPreviewIndex].originalSize) *
                                                100
                                            ).toFixed(1)
                                            : "--"}%
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Compression Settings */}
                    <div className="flex flex-col gap-5 rounded-xl border border-gray-500/40 dark:border-white/20 dark:bg-white/5 bg-white/50 p-5 sm:p-6">
                        <p className="text-base sm:text-lg font-bold text-[#0f0f0f] dark:text-white">
                            Compression Settings
                        </p>

                        {/* Quality Slider */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-black/80 dark:text-white/80">
                                    Quality
                                </label>
                                <p className="rounded-md bg-primary/10 px-2 py-0.5 text-sm font-bold text-primary">
                                    {quality}%
                                </p>
                            </div>
                            <input title="Select Quality"
                                type="range"
                                min={0}
                                max={100}
                                value={quality}
                                onChange={(e) => setQuality(Number(e.target.value))}
                                className="w-full h-2 rounded-lg cursor-pointer bg-gray-300 dark:bg-gray-700 accent-orange-600"
                            />
                        </div>

                        {/* Toggles */}
                        <div className="flex flex-col gap-3 mt-2">
                            {[
                                { label: "Convert to WebP", checked: convertToWebP, set: setConvertToWebP },
                                { label: "Progressive JPG", checked: progressive, set: setProgressive },
                            ].map((opt, i) => (
                                <div className="flex items-center gap-3" key={i}>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input title="Toggle Type"
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={opt.checked}
                                            onChange={() => opt.set(!opt.checked)}
                                        />
                                        <div className="w-11 h-6 bg-gray-700 rounded-full peer-checked:bg-green-700 transition-colors"></div>
                                        <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 peer-checked:bg-green-400 transition-transform"></div>
                                    </label>
                                    <span className="text-sm font-medium text-black/80 dark:text-white/80">
                                        {opt.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Buttons */}
                        <div className="mt-auto flex flex-col gap-3 pt-4">
                            <button
                                onClick={handleBatchCompress}
                                className="flex w-full items-center justify-center gap-2 rounded-lg py-3 bg-orange-700 dark:bg-orange-800/30 border border-orange-700 text-white font-bold active:scale-95 transition-all"
                            >
                                <Upload size={18} /> Compress All
                            </button>
                            <button
                                onClick={handleDownloadCurrent}
                                className="flex w-full items-center justify-center gap-2 rounded-lg py-3 bg-green-700 dark:bg-green-800/30 border border-green-700 text-white font-bold active:scale-95 transition-all"
                            >
                                <Download size={18} /> Download Current
                            </button>
                        </div>
                    </div>
                </div>

                {/* Batch Compression List (same logic) */}
                {images.length > 0 && (
                    <div className="w-full max-w-7xl rounded-xl border border-gray-400/20 dark:border-white/10 bg-white/40 dark:bg-white/5 p-4 sm:p-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:items-center">
                                <h3 className="text-lg sm:text-xl font-bold text-primary">
                                    Batch Compression ({images.length})
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        {...getRootProps()}
                                        className="flex items-center gap-2 rounded-lg border border-gray-600 dark:border-white/30 px-3 sm:px-4 py-2 text-sm font-bold dark:text-white text-[#0f0f0f] active:scale-95 transition-all"
                                    >
                                        <input {...getInputProps()} />
                                        <Plus size={16} /> Add Images
                                    </button>
                                    <button
                                        onClick={handleDownloadAll}
                                        className="flex items-center gap-2 rounded-lg bg-black dark:bg-white text-white dark:text-black px-3 sm:px-4 py-2 text-sm font-bold border border-gray-700 dark:border-white/30 active:scale-95 transition-all"
                                    >
                                        <Download size={16} /> Download All
                                    </button>
                                </div>
                            </div>

                            {/* Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {images.map((img, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center gap-4 rounded-lg p-3 border-2 transition-all cursor-pointer ${currentPreviewIndex === index
                                            ? "border-orange-500 dark:bg-white/10 bg-black/10 shadow-lg"
                                            : "border-transparent bg-black/5 dark:bg-white/5"
                                            }`}
                                        onClick={() => setCurrentPreviewIndex(index)}
                                    >
                                        <img
                                            alt={img.name}
                                            src={img.preview}
                                            className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-md border border-gray-400/30"
                                        />
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <p className="truncate text-sm sm:text-base font-medium text-primary">
                                                {img.name}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-white/70">
                                                <span>{(img.originalSize / 1024 / 1024).toFixed(2)} MB</span>
                                                <ArrowRight
                                                    className={`${img.compressedSize
                                                        ? img.compressedSize > img.originalSize
                                                            ? "text-red-500"
                                                            : "text-green-500"
                                                        : "text-primary"
                                                        }`}
                                                />
                                                <span
                                                    className={`font-semibold ${img.compressedSize
                                                        ? img.compressedSize > img.originalSize
                                                            ? "text-red-500"
                                                            : "text-green-500"
                                                        : "text-primary"
                                                        }`}
                                                >
                                                    {img.compressedSize
                                                        ? (img.compressedSize / 1024 / 1024).toFixed(2)
                                                        : "--"}{" "}
                                                    MB
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            title="Remove"
                                            className="rounded-full p-2 text-white/60 bg-[#0f0f0f]/80 hover:bg-red-600 hover:text-white transition-all active:scale-95"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeImage(index);
                                            }}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>

        </div>
    );
};

export default Compress;
