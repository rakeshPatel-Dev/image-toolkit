import CompressImage from "./CompressImage"
import FileTransform from "./FileTransform"
import UpscaleImage from "./UpscaleImage"
import { TextAnimate } from "@/components/ui/text-animate"

const About = () => {
  return (
    <section
      id="about"
      className="w-full border-t border-gray-300 dark:border-gray-700 py-12 sm:px-40 sm:py-16 md:py-20 bg-white dark:bg-black transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col items-center">

        {/* Heading Section */}
        <div className="w-full text-center sm:text-left mb-12">
          <TextAnimate
            animation="fadeIn"
            by="word"
            className="text-gray-900 dark:text-white text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]"
          >
            About Our Image Toolkit
          </TextAnimate>

          <TextAnimate
            animation="fadeIn"
            by="word"
            className="text-gray-700 dark:text-gray-400 text-sm sm:text-base md:text-lg font-normal leading-relaxed max-w-2xl mx-auto sm:mx-0 mt-3"
          >
            Our mission is to provide simple, powerful, and free image optimization tools
            that help creators, designers, and developers work faster and smarter.
          </TextAnimate>
        </div>

        {/* Tools Section */}
        <div className="w-full space-y-12 sm:space-y-16 md:space-y-20">
          <FileTransform />
          <CompressImage />
          <UpscaleImage />
        </div>

      </div>
    </section>
  )
}

export default About
