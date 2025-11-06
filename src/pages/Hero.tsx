import {
  ArrowLeftRight,
  AlignVerticalSpaceBetween,
  ImageUpscale,
} from "lucide-react";
import { BorderBeam } from "../components/ui/border-beam";
import { InteractiveHoverButton } from "../components/ui/interactive-hover-button";
import ComingSoon from "../components/ComingSoon";
import { TextAnimate } from "../components/ui/text-animate";
import DotPatternBackground from "../components/DotPatternBg"
import FadeInText from "@/components/ui/FadeInText";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen  text-gray-800 dark:text-gray-100 flex flex-col transition-colors duration-300">
      {/* Header */}
      <div className="relative z-0">
      <DotPatternBackground/>
      </div>
      {/* Hero Section */}
      <main className="relative z-1 grow flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-2">
        <ComingSoon/>
        </div>

        <FadeInText text="Your All-in-One Image Toolkit"  className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 dark:text-white transition-colors duration-300">
          
        </FadeInText>
        <TextAnimate animation="fadeIn" by="word" className="text-gray-600 dark:text-gray-400 mb-10 max-w-md transition-colors duration-300">
          Convert, compress, and upscale your images instantly with modern AI tools.
        </TextAnimate>
        <InteractiveHoverButton>Get Started</InteractiveHoverButton>

        {/* Cards */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl">
          {/* Card 1 */}
          <Link to='/convert' className="cursor-pointer group bg-white/50 dark:bg-[#0f0f0f]/50 border border-gray-200 dark:border-[#0f0f0f] hover:bg-gray-100 dark:hover:bg-[#0f0f0f]/80 transition-all p-8 rounded-2xl text-center hover:scale-[1.02] duration-200 relative overflow-hidden">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-blue-500 dark:bg-[#0047ab] group-hover:rotate-15 group-hover:scale-110 transition-all rounded-full">
              <ArrowLeftRight size={28} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Change File Type
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Convert between JPG, PNG, WEBP, and more seamlessly.
            </p>
            <BorderBeam
              duration={4}
              size={300}
              reverse
              className="from-transparent via-blue-500 dark:via-[#0047ab] to-transparent"
            />
          </Link>

          {/* Card 2 */}
          <Link to='/Compress' className="cursor-pointer group bg-white/50 dark:bg-[#0f0f0f]/50 border border-gray-200 dark:border-[#0f0f0f] hover:bg-gray-100 dark:hover:bg-[#0f0f0f]/80 transition-all p-8 rounded-2xl text-center hover:scale-[1.02] duration-200 relative overflow-hidden">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-green-500 dark:bg-[#004225] group-hover:rotate-15 group-hover:scale-110 transition-all rounded-full">
              <AlignVerticalSpaceBetween size={28} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Compress Image
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Shrink image size without losing quality using smart compression.
            </p>
            <BorderBeam
              duration={4}
              size={300}
              reverse
              className="from-transparent via-green-500 dark:via-[#004225] to-transparent"
            />
          </Link>

          {/* Card 3 */}
          <div className="cursor-pointer group bg-white/50 dark:bg-[#0f0f0f]/50 border border-gray-200 dark:border-[#0f0f0f] hover:bg-gray-100 dark:hover:bg-[#0f0f0f]/80 transition-all p-8 rounded-2xl text-center hover:scale-[1.02] duration-200 relative overflow-hidden">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-orange-500/20 dark:bg-orange-600/20 group-hover:rotate-15 group-hover:scale-110 transition-all rounded-full">
              <ImageUpscale size={28} className="text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Upscale Image
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Improve image resolution with AI-based enhancement tools.
            </p>
            <BorderBeam
              duration={4}
              size={300}
              reverse
              className="from-transparent via-orange-500 dark:via-orange-900 to-transparent"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      {/* <footer className="border-t border-gray-200 dark:border-gray-800 text-center py-6 text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">
        © {new Date().getFullYear()} Image Toolkit. All rights reserved.
      </footer> */}
    </div>
  );
};

export default Home;
