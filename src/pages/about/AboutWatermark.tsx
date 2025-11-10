"use client"

import { useState } from "react"
import { Droplet, ChevronDown, ArrowUpRight } from "lucide-react"
import { TextAnimate } from "@/components/ui/text-animate"
import { Link } from "react-router-dom"

const AddWatermark = () => {
  const [showSteps, setShowSteps] = useState(false)

  return (
    <section
      className="bg-gray-100 dark:bg-[#0f0f0f]/50 border border-[#0f0f0f0/80] p-6 rounded-xl"
      id="add-watermark"
    >
      <div className="flex items-start gap-4">
        <Droplet  className="text-gray-700 dark:text-gray-200 size-6" />
        <div className="flex-1">
          <TextAnimate animation="fadeIn" by="word" className="text-gray-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
            Add Watermark
          </TextAnimate>
          <TextAnimate animation="fadeIn" by="word" className="text-gray-800 dark:text-gray-300 text-base font-normal leading-normal pb-4">
            Protect your images by adding custom watermarks. You can place text or logos anywhere on your images, ensuring your content remains uniquely yours.
          </TextAnimate>

          {/* Toggle Button */}
          <button
            onClick={() => setShowSteps(!showSteps)}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 cursor-help hover:text-gray-400 transition-colors"
          >
            {showSteps ? "Hide Steps" : "Show Steps"}
            <ChevronDown
              className={`size-4 transition-transform ${showSteps ? "rotate-180" : ""}`}
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
                  Upload the image you want to watermark.
                </p>

                <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal py-2">
                  Step 2
                </p>
                <p className="text-gray-800 dark:text-white text-sm font-normal leading-normal py-2">
                  Choose your watermark type: text or logo.
                </p>

                <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal py-2">
                  Step 3
                </p>
                <p className="text-gray-800 flex flex-row justify-between dark:text-white text-sm font-normal leading-normal py-2">
                  Adjust the position, size, and transparency, then click “Apply” to add the watermark.
                  <Link to="/watermark" className="flex flex-row group hover:text-orange-800 hover:underline hover:-translate-x-1 hover:underline-offset-8 decoration-2 transition-all">
                    Try Now <ArrowUpRight className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"/>
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

export default AddWatermark
