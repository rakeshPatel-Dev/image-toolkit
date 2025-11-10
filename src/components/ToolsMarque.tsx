import { cn } from "@/lib/utils"
import { Marquee } from "./ui/marquee"
import { Link } from "react-router-dom";

import Convert from "/Convert.webp";
import Compress from "/Compress.webp";
import Resize from "/Resize.webp";
import Crop from "/Crop.webp";
import Watermark from "/Watermark.webp";
import RemoveBg from "/RemoveBg.webp";
import { BorderBeam } from "./ui/border-beam";


const toolsData = [
  {
    name: "File Type Converter",
    username: "/convert",
    body: "Convert PNG, JPG, WEBP, and more into any other format easily.",
    img: Convert,
  },
  {
    name: "Size Compresser",
    username: "/compress",
    body: "Compress images to smaller sizes while keeping high quality.",
    img: Compress,
  },
  {
    name: "Add Watermark",
    username: "/watermark",
    body: "Add text or logo watermarks to protect your photos instantly.",
    img: Watermark,
  },
  {
    name: "Image Resizer",
    username: "/resize",
    body: "Resize images to any width or height with perfect accuracy.",
    img: Resize,
  },
  {
    name: "Crop Image",
    username: "/crop",
    body: "Crop images freely or to fixed ratios with clean precision.",
    img: Crop,
  },
  {
    name: "Background Remover",
    username: "/bgremove",
    body: "Remove or replace image backgrounds automatically in one click.",
    img: RemoveBg,
  },
];


const firstRow = toolsData

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string
  name: string
  username: string
  body: string
}) => {
  return (
    <Link to={username.startsWith("/") ? username : `/${username}`}
      className={cn(
        "relative h-full flex flex-col w-58 sm:w-64 cursor-pointer overflow-hidden rounded-xl border p-6",
        // light styles
        "border-gray-950/60 bg-black/20 hover:bg-black/40 transition-all",
        // dark styles
        "dark:border-gray-50/10 dark:bg-[#0f0f0f]/30 dark:hover:bg-[#0f0f0f]/60"
      )}
    >
      <div className="flex flex-col items-center gap-6 px-2">
        <div className="w-26 h-26 rounded-full dark:bg-white p-2">
          <img src={img} className=" w-full h-full object-cover" alt={`${name} image`} />
        </div>

        <div className="flex flex-col">
          <figcaption className="text-lg font-bold dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm dark:text-white/50">{body}</blockquote>
    </Link>
  )
}

export function Tools() {
  return (
    <>
      <div className="relative flex max-w-8xl w-80 sm:w-xl md:w-2xl lg:w-4xl xl:w-6xl flex-col items-center justify-center overflow-hidden">
        <Marquee pauseOnHover className="[--duration:5s]">
          {firstRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
      <BorderBeam  colorFrom = "#ff8c00"
  colorTo = "#ffffff  "/>
        </Marquee>

        <div className="from-white dark:from-black pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r "></div>
        <div className=" from-white dark:from-black pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-linear-to-l"></div>
      </div>
    </>
  )
}
