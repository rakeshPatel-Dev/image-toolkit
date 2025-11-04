"use client"

import { useState } from "react"
import { AlignVerticalSpaceBetween, ChevronDown, ArrowUpRight } from "lucide-react"
import { TextAnimate } from "@/components/ui/text-animate"

const CompressImage = () => {
  const [showSteps, setShowSteps] = useState(false)

  return (
    <section
       className="bg-gray-100 dark:bg-[#0f0f0f]/50 border border-[#0f0f0f0/80] p-6 rounded-xl"
      id="compress-image"
    >
      <div className="flex items-start gap-4">
        <AlignVerticalSpaceBetween className="text-gray-700 dark:text-gray-200 size-6" />
        <div className="flex-1">
          <TextAnimate animation="blurInUp" by="text" className="text-gray-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
            Compress Image
          </TextAnimate>
          <TextAnimate animation="blurInUp" by="word" className="text-gray-800 dark:text-gray-300 text-base font-normal leading-normal pb-4">
            Reduce image file size without significant quality loss for faster
            website loading and to save storage space. Our tool uses both lossy
            and lossless compression to give you control over the final output.
          </TextAnimate>

          {/* Toggle Button */}
          <button
            onClick={() => setShowSteps(!showSteps)}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 cursor-help hover:text-gray-400 transition-colors"
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
            <div className="mt-4 border-t border-gray-300 dark:border-gray-700 pt-4 transition-all duration-300 animate-fadeIn">
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
                  Adjust the compression level with the slider.
                </p>

                <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal py-2">
                  Step 3
                </p>
                <p className="text-gray-800 flex flow-row justify-between dark:text-white text-sm font-normal leading-normal py-2">
                  Click “Compress” and see the result.
                  <a href= "#" className= "flex flex-row group hover:text-orange-800 hover:underline  hover:-translate-x-1 hover:underline-offset-8 decoration-2 transition-all">Try Now <ArrowUpRight className="opacity-0 group-hover:opacity-100  group-hover:translate-x-1 transition-all"/></a>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default CompressImage
