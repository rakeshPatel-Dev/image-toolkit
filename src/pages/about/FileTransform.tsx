"use client"

import { useState } from "react"
import { ArrowLeftRight, ChevronDown, ArrowUpRight } from "lucide-react"
import { TextAnimate } from "@/components/ui/text-animate"
import { h2, p } from "motion/react-client"
import { Link } from "react-router-dom"

const FileTransform = () => {
  const [showSteps, setShowSteps] = useState(false)

  return (
    <section
      className="bg-gray-100 dark:bg-[#0f0f0f]/50 border border-[#0f0f0f0/80] p-6 rounded-xl"
      id="change-file-type"
    >
      <div className="flex items-start gap-4">
        <ArrowLeftRight className="text-gray-700 dark:text-gray-200 size-6" />
        <div className="flex-1">
          <TextAnimate animation="fadeIn" by="word" as={h2} className="text-gray-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
            Change File Type
          </TextAnimate>
          <TextAnimate animation="fadeIn" by="word" as={p} className="text-gray-800 dark:text-gray-300 text-base font-normal leading-normal pb-4">
            Convert images between formats like JPG, PNG, and WebP. Our tool
            re-encodes image data to seamlessly switch between formats. Use PNG
            for images requiring transparency, JPG for high-quality photos, and
            WebP for efficient web use.
          </TextAnimate>

          {/* Toggle Button */}
          <button
            onClick={() => setShowSteps(!showSteps)}
            className="flex items-center gap-2 text-sm text-gray-500 cursor-help hover:text-gray-400 transition-colors"
          >
            {showSteps ? "Hide Steps" : "Show Steps"}
            <ChevronDown
              className={`size-4 transition-transform ${
                showSteps ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Steps Section */}
       

{showSteps && (
  <div className="mt-4 border-t border-gray-300 dark:border-gray-700 pt-4">
    <div className="grid grid-cols-[auto_1fr] gap-x-4">
      <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal py-2">
        Step 1
      </p>
      <p className="text-gray-800 dark:text-white text-sm font-normal leading-normal py-2">
        Upload your image.
      </p>

      <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal py-2">
        Step 2
      </p>
      <p className="text-gray-800 dark:text-white text-sm font-normal leading-normal py-2">
        Select the desired output format.
      </p>

      <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal py-2">
        Step 3
      </p>
      <p className="text-gray-800 flex flex-row justify-between dark:text-white text-sm font-normal leading-normal py-2">
        Click “Convert” and download your new image.
        <Link
          to="/convert"
          className="flex items-center gap-1 group text-orange-600 hover:text-orange-800 hover:underline hover:underline-offset-8 decoration-2 transition-all"
        >
          Try Now
          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </Link>
      </p>
    </div>
  </div>
)}

        </div>
      </div>
    </section>
  )
}

export default FileTransform
