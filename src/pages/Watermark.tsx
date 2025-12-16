// Watermark.tsx
import FadeInText from "@/components/ui/FadeInText";
import { TextAnimate } from "@/components/ui/text-animate";
import { AlignHorizontalSpaceAround,  Download, Layers, Upload, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

/**
 * Watermark.tsx
 * - Canvas-based editor with text + image watermark support
 * - Canva-like controls: drag, corner resize (preserve/aspect), rotate, scale, real-time edit
 * - Batch download (sequential) and single download
 * - No external libs
 *
 * Usage: drop into your React project. Tailwind classes used from your UI.
 */

// --- types
type UploadedImage = {
  id: string;
  file?: File;
  url: string;
  name: string;
  size: number;
};

type WmType = "text" | "image";

type WatermarkState = {
  type: WmType;
  // transform center (relative 0..1)
  cx: number;
  cy: number;
  // dimension in pixels (relative to canvas drawing size)
  w: number;
  h: number;
  scale: number;
  rotation: number; // radians
  // text props
  text: string;
  fontFamily: string;
  fontSize: number; // base pixel size
  color: string;
  opacity: number; // 0..1
  blend: GlobalCompositeOperation;
  // image (logo) props
  imageUrl?: string | null;
  keepAspect: boolean;
};

const blendModes = ["source-over", "overlay", "screen", "multiply", "lighten"] as GlobalCompositeOperation[];

// helper
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
const formatBytes = (b: number) =>
  b < 1024 ? `${b} B` : b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} KB` : `${(b / (1024 * 1024)).toFixed(1)} MB`;

export default function Watermark() {
  // images uploaded
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('after');

  // watermark state (single watermark object user edits; can be applied to all images)
  const [wm, setWm] = useState<WatermarkState>({
    type: "text",
    cx: 0.5,
    cy: 0.5,
    w: 400,
    h: 150,
    scale: 1,
    rotation: 0,
    text: "Explore More",
    fontFamily: "Space Grotesk",
    fontSize: 64,
    color: "#FFFFFF",
    opacity: 0.5,
    blend: "overlay",
    imageUrl: null,
    keepAspect: true,
  });

  // refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeImageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  // pointer state for transforms
  const pointerRef = useRef<{
    mode: "none" | "drag" | "resize" | "rotate";
    startX: number;
    startY: number;
    startWm: WatermarkState | null;
    handle?: "tl" | "tr" | "bl" | "br" | "t" | "b" | "l" | "r";
    pointerId?: number | null;
  }>({ mode: "none", startX: 0, startY: 0, startWm: null });

  // load font
  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700;900&display=swap');`;
    document.head.appendChild(s);
    return () => s.remove();
  }, []);

  // add files handler
  const addFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const newImgs: UploadedImage[] = arr.map((f) => ({
      id: uid(),
      file: f,
      url: URL.createObjectURL(f),
      name: f.name,
      size: f.size,
    }));
    setImages((prev) => {
      const nxt = [...prev, ...newImgs];
      if (prev.length === 0) setActiveIndex(0);
      return nxt;
    });
  }, []);

  // cleanup URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((im) => im.file && URL.revokeObjectURL(im.url));
      if (wm.imageUrl?.startsWith("blob:")) URL.revokeObjectURL(wm.imageUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // when activeIndex or images change => load active image
  useEffect(() => {
    if (!images.length) {
      activeImageRef.current = null;
      const c = canvasRef.current;
      if (c) {
        const ctx = c.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, c.width, c.height);
        }
      }
      return;
    }
    const src = images[activeIndex].url;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      activeImageRef.current = img;
      // center watermark relative to image if first time
      drawToCanvas();
    };
    img.onerror = () => {
      activeImageRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, images]);

  // draw function
  const drawToCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = activeImageRef.current;
    if (!canvas || !img) return;
    const container = containerRef.current;
    // fit to container size while preserving aspect
    const maxW = container ? container.clientWidth - 24 : 1000;
    const maxH = container ? container.clientHeight - 24 : 800;
    let w = img.naturalWidth;
    let h = img.naturalHeight;
    const ratio = Math.min(1, maxW / w, maxH / h);
    w = Math.round(w * ratio);
    h = Math.round(h * ratio);

    // account for DPR for crispness
    const dpr = window.devicePixelRatio || 1;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // draw base image
    ctx.drawImage(img, 0, 0, w, h);

    // draw watermark according to wm state
    ctx.save();
    ctx.globalCompositeOperation = wm.blend;
    ctx.globalAlpha = wm.opacity;

    // compute transform center in px
    const centerX = wm.cx * w;
    const centerY = wm.cy * h;

    ctx.translate(centerX, centerY);
    ctx.rotate(wm.rotation);
    ctx.scale(wm.scale, wm.scale);

    if (wm.type === "text") {
      const fontPx = wm.fontSize;
      ctx.font = `bold ${fontPx}px "${wm.fontFamily}", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      // drop shadow for contrast
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 6;
      ctx.fillStyle = wm.color;
      ctx.fillText(wm.text, 0, 0);
      // measure text bounding box
      // we approximate height via fontPx and width using measureText
    } else if (wm.type === "image" && wm.imageUrl) {
      // draw watermark image centered; use wm.w/wm.h as size
      const imgW = wm.w;
      const imgH = wm.h;
      // attempt to draw cached logo image if loaded
      const logo = new Image();
      logo.crossOrigin = "anonymous";
      logo.src = wm.imageUrl;
      // synchronous draw may fail if not loaded; try to draw immediately if cached, else onload redraw
      if (logo.complete) {
        ctx.drawImage(logo, -imgW / 2, -imgH / 2, imgW, imgH);
      } else {
        logo.onload = () => {
          // redraw entire canvas after logo loads
          drawToCanvas();
        };
      }
    }

    ctx.restore();

    // draw UI overlay (handles) on top using separate pass with no blend/opacity
    // We'll draw handles in canvas coordinates overlaying at transformed corners
    const overlayCtx = canvas.getContext("2d");
    if (!overlayCtx) return;
    overlayCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // compute corners of watermark box (untransformed center 0,0 with w,h -> corners)
    const hw = (wm.w / 2) * wm.scale;
    const hh = (wm.h / 2) * wm.scale;

    // corners in local coords
    const corners = [
      { x: -hw, y: -hh }, // tl
      { x: hw, y: -hh }, // tr
      { x: hw, y: hh }, // br
      { x: -hw, y: hh }, // bl
    ];
    // rotate points and translate to canvas coords
    const rotated = corners.map((p) => {
      const x = p.x * Math.cos(wm.rotation) - p.y * Math.sin(wm.rotation) + centerX;
      const y = p.x * Math.sin(wm.rotation) + p.y * Math.cos(wm.rotation) + centerY;
      return { x, y };
    });

    // draw translucent guide box
    overlayCtx.save();
    overlayCtx.strokeStyle = "rgba(255,255,255,0.15)";
    overlayCtx.lineWidth = 1;
    overlayCtx.beginPath();
    overlayCtx.moveTo(rotated[0].x, rotated[0].y);
    for (let i = 1; i < rotated.length; i++) overlayCtx.lineTo(rotated[i].x, rotated[i].y);
    overlayCtx.closePath();
    overlayCtx.stroke();

    // draw handles (circles) at corners
    rotated.forEach((pt) => {
      overlayCtx.beginPath();
      overlayCtx.fillStyle = "#0ea5a4"; // teal-ish
      overlayCtx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
      overlayCtx.fill();
      overlayCtx.lineWidth = 2;
      overlayCtx.strokeStyle = "#0b1220";
      overlayCtx.stroke();
    });

    // rotate handle: top-middle outward
    const topMidLocal = { x: 0, y: -hh - 32 }; // 32px above
    const topMid = {
      x: topMidLocal.x * Math.cos(wm.rotation) - topMidLocal.y * Math.sin(wm.rotation) + centerX,
      y: topMidLocal.x * Math.sin(wm.rotation) + topMidLocal.y * Math.cos(wm.rotation) + centerY,
    };
    overlayCtx.beginPath();
    overlayCtx.fillStyle = "#f59e0b"; // amber
    overlayCtx.arc(topMid.x, topMid.y, 6, 0, Math.PI * 2);
    overlayCtx.fill();
    overlayCtx.strokeStyle = "#0b1220";
    overlayCtx.lineWidth = 2;
    overlayCtx.stroke();

    // small line connecting center top to rotate handle
    overlayCtx.beginPath();
    overlayCtx.strokeStyle = "rgba(255,255,255,0.12)";
    overlayCtx.lineWidth = 1;
    const topEdgeCenter = {
      x: (rotated[0].x + rotated[1].x) / 2,
      y: (rotated[0].y + rotated[1].y) / 2,
    };
    overlayCtx.moveTo(topEdgeCenter.x, topEdgeCenter.y);
    overlayCtx.lineTo(topMid.x, topMid.y);
    overlayCtx.stroke();

    overlayCtx.restore();
  }, [wm]);

  // redraw on any relevant change
  useEffect(() => {
    drawToCanvas();
  }, [wm, images, activeIndex, drawToCanvas]);

  // hit testing for pointer events (returns { hit: boolean, area: 'body'|'tl'|'tr'|'bl'|'br'|'rotate' })
  function hitTestCanvas(clientX: number, clientY: number) {
    const canvas = canvasRef.current;
    const img = activeImageRef.current;
    if (!canvas || !img) return { hit: false as const };
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    // compute center in px
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);
    const cx = wm.cx * w;
    const cy = wm.cy * h;
    const hw = (wm.w / 2) * wm.scale;
    const hh = (wm.h / 2) * wm.scale;

    // local coordinates relative to center and inverse rotate
    const lx = (x - cx) * Math.cos(-wm.rotation) - (y - cy) * Math.sin(-wm.rotation);
    const ly = (x - cx) * Math.sin(-wm.rotation) + (y - cy) * Math.cos(-wm.rotation);
    // check corners with a tolerance
    const tol = 10;

    // corners local coords:
    const tl = { x: -hw, y: -hh };
    const tr = { x: hw, y: -hh };
    const br = { x: hw, y: hh };
    const bl = { x: -hw, y: hh };

    if (Math.hypot(lx - tl.x, ly - tl.y) <= tol) return { hit: true, area: "tl" as const };
    if (Math.hypot(lx - tr.x, ly - tr.y) <= tol) return { hit: true, area: "tr" as const };
    if (Math.hypot(lx - br.x, ly - br.y) <= tol) return { hit: true, area: "br" as const };
    if (Math.hypot(lx - bl.x, ly - bl.y) <= tol) return { hit: true, area: "bl" as const };

    // rotate handle: top center local (0, -hh - 32)
    const rx = 0;
    const ry = -hh - 32;
    const rdist = Math.hypot(lx - rx, ly - ry);
    if (rdist <= tol + 6) return { hit: true, area: "rotate" as const };

    // inside body?
    if (lx >= -hw - tol && lx <= hw + tol && ly >= -hh - tol && ly <= hh + tol) return { hit: true, area: "body" as const };

    return { hit: false as const };
  }

  // pointer handlers: pointerdown on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!activeImageRef.current) return;
      const test = hitTestCanvas(e.clientX, e.clientY);
      if (!test.hit) return;
      (e.target as Element).setPointerCapture(e.pointerId);
      pointerRef.current.pointerId = e.pointerId;
      pointerRef.current.startX = e.clientX;
      pointerRef.current.startY = e.clientY;
      pointerRef.current.startWm = { ...wm };
      if (test.area === "body") {
        pointerRef.current.mode = "drag";
      } else if (test.area === "rotate") {
        pointerRef.current.mode = "rotate";
      } else {
        pointerRef.current.mode = "resize";
        pointerRef.current.handle = test.area;
      }
      e.preventDefault();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (pointerRef.current.mode === "none" || pointerRef.current.pointerId !== e.pointerId) return;
      const mode = pointerRef.current.mode;
      const start = pointerRef.current.startWm!;
      const dx = e.clientX - pointerRef.current.startX;
      const dy = e.clientY - pointerRef.current.startY;

      const canvas = canvasRef.current!;
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);

      if (mode === "drag") {
        // translate dx/dy rotated back to local coords
        const localDx = dx * Math.cos(-start.rotation) - dy * Math.sin(-start.rotation);
        const localDy = dx * Math.sin(-start.rotation) + dy * Math.cos(-start.rotation);
        const newCx = (start.cx * w + localDx) / w;
        const newCy = (start.cy * h + localDy) / h;
        setWm((prev) => ({ ...prev, cx: Math.max(0, Math.min(1, newCx)), cy: Math.max(0, Math.min(1, newCy)) }));
      } else if (mode === "rotate") {
        // compute center in client coords to measure angle delta
        const rect = canvas.getBoundingClientRect();
        const cxClient = rect.left + start.cx * w;
        const cyClient = rect.top + start.cy * h;
        const angle1 = Math.atan2(pointerRef.current.startY - cyClient, pointerRef.current.startX - cxClient);
        const angle2 = Math.atan2(e.clientY - cyClient, e.clientX - cxClient);
        const delta = angle2 - angle1;
        setWm((p) => ({ ...p, rotation: start.rotation + delta }));
      } else if (mode === "resize") {
        // resizing depends on handle; we'll project pointer onto rotated axes to compute new width/height
        const localDx = dx * Math.cos(-start.rotation) - dy * Math.sin(-start.rotation);
        const localDy = dx * Math.sin(-start.rotation) + dy * Math.cos(-start.rotation);

        let newW = start.w;
        let newH = start.h;
        const handle = pointerRef.current.handle!;
        // change width/height depending on which corner: tl (-,-) tr (+,-) br (+,+) bl (-,+)
        // we interpret localDx/localDy as how much to move that corner
        if (handle === "tr") {
          newW = Math.max(16, start.w + localDx);
          newH = start.keepAspect ? Math.max(16, (newW / start.w) * start.h) : Math.max(16, start.h - localDy);
        } else if (handle === "tl") {
          newW = Math.max(16, start.w - localDx);
          newH = start.keepAspect ? Math.max(16, (newW / start.w) * start.h) : Math.max(16, start.h - localDy);
          // when tl moves left, center shifts horizontally
        } else if (handle === "br") {
          newW = Math.max(16, start.w + localDx);
          newH = start.keepAspect ? Math.max(16, (newW / start.w) * start.h) : Math.max(16, start.h + localDy);
        } else if (handle === "bl") {
          newW = Math.max(16, start.w - localDx);
          newH = start.keepAspect ? Math.max(16, (newW / start.w) * start.h) : Math.max(16, start.h + localDy);
        }

        // Also update center so the resizing feels anchored at opposite corner.
        // Compute how much the center moves in local coords
        const dw = newW - start.w;
        const dh = newH - start.h;
        // depending on handle, center shifts +dw/2 or -dw/2 etc.
        let shiftLocalX = 0;
        let shiftLocalY = 0;
        if (handle === "tr") {
          shiftLocalX = dw / 2;
          shiftLocalY = -dh / 2;
        } else if (handle === "tl") {
          shiftLocalX = -dw / 2;
          shiftLocalY = -dh / 2;
        } else if (handle === "br") {
          shiftLocalX = dw / 2;
          shiftLocalY = dh / 2;
        } else if (handle === "bl") {
          shiftLocalX = -dw / 2;
          shiftLocalY = dh / 2;
        }
        // convert local shift to canvas-relative delta
        const shiftCanvasX = shiftLocalX * Math.cos(start.rotation) - shiftLocalY * Math.sin(start.rotation);
        const shiftCanvasY = shiftLocalX * Math.sin(start.rotation) + shiftLocalY * Math.cos(start.rotation);

        const newCx = (start.cx * w + shiftCanvasX) / w;
        const newCy = (start.cy * h + shiftCanvasY) / h;

        setWm((p) => ({ ...p, w: newW, h: newH, cx: Math.max(0, Math.min(1, newCx)), cy: Math.max(0, Math.min(1, newCy)) }));
      }
      e.preventDefault();
    };

    const onPointerUp = (e: PointerEvent) => {
      if (pointerRef.current.pointerId !== e.pointerId) return;
      pointerRef.current.mode = "none";
      pointerRef.current.pointerId = undefined;
      pointerRef.current.startWm = null;
      pointerRef.current.handle = undefined;
      (e.target as Element).releasePointerCapture?.(e.pointerId);
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [wm]);

  // download a processed image at original resolution for a single image
  async function downloadProcessed(img: UploadedImage) {
    const imageEl = new Image();
    imageEl.crossOrigin = "anonymous";
    imageEl.src = img.url;
    await new Promise<void>((res) => {
      imageEl.onload = () => res();
      imageEl.onerror = () => res();
    });

    // create offscreen canvas matching original size
    const off = document.createElement("canvas");
    off.width = imageEl.naturalWidth;
    off.height = imageEl.naturalHeight;
    const ctx = off.getContext("2d");
    if (!ctx) return;

    // draw image
    ctx.drawImage(imageEl, 0, 0, off.width, off.height);

    // apply watermark scaled to original resolution
    ctx.save();
    ctx.globalCompositeOperation = wm.blend;
    ctx.globalAlpha = wm.opacity;

    // compute center in px using relative cx/cy
    const centerX = wm.cx * off.width;
    const centerY = wm.cy * off.height;

    ctx.translate(centerX, centerY);
    ctx.rotate(wm.rotation);
    ctx.scale(wm.scale, wm.scale);

    if (wm.type === "text") {
      const fontPx = wm.fontSize;
      ctx.font = `bold ${fontPx}px "${wm.fontFamily}", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = wm.color;
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 6;
      ctx.fillText(wm.text, 0, 0);
    } else if (wm.type === "image" && wm.imageUrl) {
      // draw logo image
      const logo = new Image();
      logo.crossOrigin = "anonymous";
      logo.src = wm.imageUrl;
      await new Promise<void>((res) => {
        logo.onload = () => res();
        logo.onerror = () => res();
      });
      // compute draw size relative to offscreen (proportional to current w/h vs canvas)
      // We used wm.w/wm.h as px in the preview canvas scale; need to scale proportionally:
      // compute preview canvas pixel size (w,h)
      const canvas = canvasRef.current!;
      const previewW = canvas.width / (window.devicePixelRatio || 1);
      const previewH = canvas.height / (window.devicePixelRatio || 1);
      const scaleX = off.width / previewW;
      const scaleY = off.height / previewH;
      // final draw size:
      const drawW = wm.w * scaleX;
      const drawH = wm.h * scaleY;
      ctx.drawImage(logo, -drawW / 2, -drawH / 2, drawW, drawH);
    }

    ctx.restore();

    // export PNG
    const url = off.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `${img.name.replace(/\.[^/.]+$/, "")}_watermarked.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // apply to all images sequentially
  async function applyToAll() {
    for (const img of images) {
      // eslint-disable-next-line no-await-in-loop
      await downloadProcessed(img);
      // optional small pause so browser keeps up
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 150));
    }
  }

  // handle logo upload
  const onLogoSelected = (f: File | null) => {
    if (!f) return;
    const url = URL.createObjectURL(f);
    // load image to get aspect & default sizing
    const li = new Image();
    li.src = url;
    li.onload = () => {
      // set watermark to image type and size relative to canvas (we'll set w/h to be 25% of canvas width)
      const canvas = canvasRef.current;
      const previewW = canvas ? canvas.width / (window.devicePixelRatio || 1) : 800;
      const ratio = Math.min(0.25 * previewW, li.naturalWidth);
      const aspect = li.naturalWidth / li.naturalHeight;
      const h = ratio / aspect;
      setWm((p) => ({
        ...p,
        type: "image",
        imageUrl: url,
        w: ratio,
        h,
        keepAspect: true,
      }));
      drawToCanvas();
    };
  };

  // remove image
  const removeImage = (id: string) => {
    setImages((prev) => {
      const next = prev.filter((i) => i.id !== id);
      if (next.length === 0) setActiveIndex(0);
      else if (activeIndex >= next.length) setActiveIndex(next.length - 1);
      return next;
    });
  };

  // Drag & drop support for left panel
  useEffect(() => {
    const dropArea = document.getElementById("drop-area");
    if (!dropArea) return;
    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      dropArea.classList.add("dragover");
    };
    const onDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dropArea.classList.remove("dragover");
    };
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      dropArea.classList.remove("dragover");
      if (e.dataTransfer?.files) addFiles(e.dataTransfer.files);
    };
    dropArea.addEventListener("dragover", onDragOver);
    dropArea.addEventListener("dragleave", onDragLeave);
    dropArea.addEventListener("drop", onDrop);
    return () => {
      dropArea.removeEventListener("dragover", onDragOver);
      dropArea.removeEventListener("dragleave", onDragLeave);
      dropArea.removeEventListener("drop", onDrop);
    };
  }, [addFiles]);

  // small helper to trigger file input
  const onBrowseClick = () => fileInputRef.current?.click();
  const onLogoBrowse = () => logoInputRef.current?.click();

  return (
    <div>
      <main className="grow p-4 sm:p-6 mt-10 lg:p-10">
        <div className="flex flex-wrap justify-between gap-3 mb-8">
          <div className="flex min-w-72 flex-col gap-2">
            <FadeInText text="Add Watermark to Images" className="text-off-white text-4xl font-black leading-tight tracking-[-0.033em]">
            </FadeInText>
            <TextAnimate animation="fadeIn" by="word" className="text-secondary-text text-base font-normal leading-normal">
              Protect your images by adding a custom text or logo watermark.
            </TextAnimate>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* left */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            <div
              id="drop-area"
              className="flex group  hover:border-orange-500  cursor-pointer flex-col items-center gap-4 rounded-lg border-2 border-dashed border-border-gray px-6 py-10 text-center transition-all bg-slate-gray/50"
              onClick={() => onBrowseClick()}
              role="button"
            >
              <Upload size={50} className="group-hover:scale-110 transition-all" />
              <p className="text-off-white text-lg font-bold leading-tight tracking-[-0.015em]">Add images to add Watermark</p>
              <p className="text-secondary-text text-sm font-normal leading-normal max-w-xs">
                Drag & Drop or click to add more images for batch processing.
              </p>
              <p className="text-secondary-text text-xs font-normal leading-normal   max-w-xs">
                OR
              </p>
              <p className="text-secondary-text text-sm font-normal leading-normal max-w-xs">
                Upload single or multiple image.
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBrowseClick();
                }}
                className="mt-2 flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 darK:bg-black/10  border-2 hover:bg-gray-300/10 dark:border-white/10 border-black/10 hover:scale-105 active:scale-95 transition-all text-md font-bold "
              >
                Browse Files
              </button>

              <input
                ref={fileInputRef}
                style={{ display: "none" }}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => addFiles(e.target.files)}
              />
            </div>

            <div className="flex flex-col gap-3">
              {images.length === 0 ? (
                <div className="text-secondary-text text-sm">No images added yet.</div>
              ) : (
                images.map((img, idx) => (
                  <div
                    key={img.id}
                    className={`flex items-center gap-3 p-2 rounded-lg ${idx === activeIndex ? "bg-primary/20 p-2 rounded-lg border border-primary ring-2 ring-primary/50" : "bg-light-gray/20"
                      }`}
                  >
                    <img className="w-16 h-10 object-cover rounded cursor-pointer" src={img.url} alt={img.name} onClick={() => setActiveIndex(idx)} />
                    <div className="grow cursor-pointer" onClick={() => setActiveIndex(idx)}>
                      <p className="text-sm font-medium text-off-white truncate">{img.name}</p>
                      <p className="text-xs text-secondary-text">{formatBytes(img.size)}</p>
                    </div>
                    <button title="Remove" className="p-2 rounded-full hover:bg-light-gray/50 group cursor-pointer text-secondary-text hover:text-off-white " onClick={() => removeImage(img.id)}>
                      <X className="group-hover:text-red-700 transition-all" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Config */}
            <div className="flex flex-col gap-4 p-4 rounded-xl bg-slate-gray/50 border border-border-gray">
              <h2 className="text-off-white text-xl font-bold">2. Configure Your Watermark</h2>

              <div className="flex gap-2">
                <button
                  onClick={() => setWm((p) => ({ ...p, type: "text" }))}
                  className={`px-3 border cursor-pointer border-primary/20 py-1 rounded-sm text-sm font-semibold ${wm.type === "text" ? "bg-primary/20 text-off-white" : "text-primary/50 bg-transparent"}`}
                >
                  Text
                </button>
                <button
                  onClick={() => setWm((p) => ({ ...p, type: "image" }))}
                  className={`px-3 py-1 border border-primary/20 cursor-pointer rounded-sm text-sm font-semibold ${wm.type === "image" ? "bg-primary/20 text-off-white" : "text-primary/50 bg-transparent"}`}
                >
                  Logo
                </button>
              </div>

              {wm.type === "text" ? (
                <>
                  <label className="block text-sm text-secondary-text">Text</label>
                  <input title="Choose Font Family" className="w-full bg-light-gray border-border-gray text-off-white rounded-lg p-2" value={wm.text} onChange={(e) => setWm((p) => ({ ...p, text: e.target.value }))} />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-secondary-text">Font</label>
                      <div className="relative w-full">
                        <select
                          className=" border  mt-2 appearance-none w-full bg-white dark:bg-black p-2 pr-8 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
                          value={wm.fontFamily}
                          onChange={(e) => setWm((p) => ({ ...p, fontFamily: e.target.value }))}
                        >
                          <option>Space Grotesk</option>
                          <option>Arial</option>
                          <option>Times New Roman</option>
                          <option>Georgia</option>
                          <option>Verdana</option>
                        </select>
                        {/* Dropdown arrow */}
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>

                    </div>
                    <div>
                      <label className="block text-sm text-secondary-text">Color</label>
                      <div className="relative w-full">
                        {/* Color input box */}
                        <input
                          type="text"
                          className="w-full bg-light-gray p-2 pl-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                          value={wm.color}
                          onChange={(e) => setWm((p) => ({ ...p, color: e.target.value }))}
                        />
                        {/* Small color picker circle */}
                        <input
                          type="color"
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0 m-0 rounded-full border-none cursor-pointer"
                          value={wm.color}
                          onChange={(e) => setWm((p) => ({ ...p, color: e.target.value }))}
                        />
                      </div>

                    </div>
                  </div>

                  <label className="block text-sm text-secondary-text">Font size: <span className="text-off-white">{wm.fontSize}px</span></label>
                  <input type="range" min={8} max={200} value={wm.fontSize} onChange={(e) => setWm((p) => ({ ...p, fontSize: Number(e.target.value) }))} className="w-full" />
                </>
              ) : (
                <>
                  <label className="block text-sm text-secondary-text">Upload Logo</label>
                  <div className="flex gap-2">
                    <button onClick={() => onLogoBrowse()} className="mt-2 flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 darK:bg-black/10  border-2 hover:bg-gray-300/10 dark:border-white/10 border-black/10 active:scale-95 transition-all text-md font-bold ">Upload</button>
                    <div className="text-md  px-10 h-10 content-center rounded-lg text-secondary-text self-center">{wm.imageUrl ? "Logo attached" : "No logo"}</div>
                  </div>
                  <input title="Keep aspect" ref={logoInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => onLogoSelected(e.target.files?.[0] ?? null)} />
                  <div className="flex items-center gap-2 mt-2">
                    <label className="text-sm text-secondary-text cursor-pointer">Keep aspect</label>
                    <div
                      className={`w-10 h-5 rounded-full p-1 flex items-center cursor-pointer transition-colors duration-300 ${wm.keepAspect ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      onClick={() => setWm((p) => ({ ...p, keepAspect: !p.keepAspect }))}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${wm.keepAspect ? 'translate-x-5' : ''
                          }`}
                      ></div>
                    </div>
                  </div>

                </>
              )}

              <label className="block text-sm text-secondary-text mt-2">Opacity: <span className="text-off-white">{Math.round(wm.opacity * 100)}%</span></label>
              <input title="Choose Opacity" type="range" min={0} max={1} step={0.01} value={wm.opacity} onChange={(e) => setWm((p) => ({ ...p, opacity: Number(e.target.value) }))} />

              <label className="block text-sm text-secondary-text">Blend Mode</label>
              <div className="relative w-full">
                <select
                  title="Choose Blend Mode"
                  className=" border appearance-none w-full bg-white dark:bg-black p-2 pr-8 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={wm.blend}
                  onChange={(e) => setWm((p) => ({ ...p, blend: e.target.value as GlobalCompositeOperation }))}
                >
                  {blendModes.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                {/* Dropdown arrow */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>



              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    // reset transform to defaults
                    setWm((p) => ({ ...p, cx: 0.5, cy: 0.5, scale: 1, rotation: 0 }));
                  }}
                  className="px-3 py-2 active:scale-95 transition-all cursor-pointer border  dark:bg-white rounded-lg bg-light-gray text-black"
                >
                  Reset Transform
                </button>
                <button
                  onClick={() => {
                    // center watermark
                    setWm((p) => ({ ...p, cx: 0.5, cy: 0.5 }));
                  }}
                  className="px-3 py-2 active:scale-95 transition-all rounded-lg border cursor-pointer bg-black content-center flex gap-2 text-white"
                >
                  <AlignHorizontalSpaceAround /> Center
                </button>
              </div>
            </div>

            {/* download */}
            <div className="flex flex-col gap-4 p-4 rounded-xl bg-slate-gray/50 border border-border-gray ">
              <h2 className="text-off-white text-xl font-bold">3. Download</h2>
              <div className="flex flex-col gap-3 ">
                <button
                  onClick={() => {
                    if (!images[activeIndex]) {
                      toast('Add an Image first !')
                      return;
                    }
                    downloadProcessed(images[activeIndex]);
                  }}
                  className="flex cursor-pointer active:scale-95  gap-2 w-full items-center justify-center rounded-lg h-12 px-4 border dark:bg-white bg-black text-white dark:text-black font-bold"
                >
                  <Download />
                  Download Image
                </button>

                <button
                  onClick={() => {
                    if (!images.length) {
                      toast('Add an Image first!')
                      return;
                    }
                    applyToAll();
                  }}

                  className=" cursor-pointer active:scale-95 flex gap-2 w-full items-center justify-center rounded-lg h-12 px-4 dark:bg-black/10 border  text-off-white font-bold"
                >
                  <Layers />
                  Apply to All (download)
                </button>
              </div>
            </div>
          </div>

          {/* right preview */}
          <div className="lg:col-span-2 relative min-h-[400px] flex items-center justify-center bg-slate-gray/50 border border-border-gray rounded-xl p-4">
            <div className="w-full h-full relative flex items-center justify-center overflow-hidden" ref={containerRef}>
              <div
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              {images.length === 0 ? (
                <div className="z-10 text-secondary-text p-6">Preview will appear here after you upload an image.</div>
              ) : (
                <canvas ref={canvasRef} className="relative z-10 rounded-lg shadow-2xl" style={{ touchAction: "none" }} />
              )}

              {/* small visual overlay replicating watermark for accessibility (non-interactive) */}
              {images.length > 0 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-slate-gray/80 backdrop-blur-md rounded-full p-2 flex items-center gap-3 border border-border-gray shadow-md">
                  <button
                    className={`px-5 py-2 cursor-pointer rounded-full text-sm font-semibold shadow transition-all duration-300 ${activeTab === 'after'
                        ? 'bg-primary/20 text-off-white shadow-lg'
                        : 'bg-transparent text-secondary-text hover:text-off-white'
                      }`}
                    onClick={() => {
                      setActiveTab('after');
                      drawToCanvas();
                    }}
                  >
                    After
                  </button>
                  <button
                    className={`px-5 py-2 cursor-pointer rounded-full text-sm font-semibold shadow transition-all duration-300 ${activeTab === 'before'
                        ? 'bg-primary/20 text-off-white shadow-lg'
                        : 'bg-transparent text-secondary-text hover:text-off-white'
                      }`}
                    onClick={() => {
                      setActiveTab('before');
                      const canvas = canvasRef.current;
                      const img = activeImageRef.current;
                      if (!canvas || !img) return;
                      const ctx = canvas.getContext("2d");
                      if (!ctx) return;
                      const w = canvas.width / (window.devicePixelRatio || 1);
                      const h = canvas.height / (window.devicePixelRatio || 1);
                      ctx.setTransform(1, 0, 0, 1, 0, 0);
                      ctx.clearRect(0, 0, canvas.width, canvas.height);
                      ctx.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0);
                      ctx.drawImage(img, 0, 0, w, h);
                    }}
                  >
                    Before
                  </button>
                </div>

              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
