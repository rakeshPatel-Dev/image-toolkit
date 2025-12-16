import { Link } from "react-router-dom";
import { InteractiveHoverButton } from "../components/ui/interactive-hover-button";
import ComingSoon from "../components/ComingSoon";
import { TextAnimate } from "../components/ui/text-animate";
import DotPatternBackground from "../components/DotPatternBg"
import FadeInText from "@/components/ui/FadeInText";
// import { Link } from "react-router-dom";
import { Tools } from "@/components/ToolsMarque";
import { Crop } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen mt-4 max-w-6xl mx-auto  text-gray-800 dark:text-gray-100 flex flex-col transition-colors duration-300">
      {/* Header */}
      <div className="relative z-0">
        <DotPatternBackground />
      </div>
      {/* Hero Section */}
      <main className="relative z-1 grow flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-2">
          <ComingSoon text="Crop image added" icon={<Crop />} />
        </div>

        <FadeInText text="Your All-in-One Image Toolkit" className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 dark:text-white transition-colors duration-300">

        </FadeInText>
        <TextAnimate animation="fadeIn" by="word" className="text-gray-600 dark:text-gray-400 mb-10 max-w-md transition-colors duration-300">
          Convert, compress, resize and crop and more for  your images instantly with modern AI tools.
        </TextAnimate>
        <Link to="/tools">

          <InteractiveHoverButton className="text-xl px-6 py-3">Get Started</InteractiveHoverButton>
        </Link>

        {/* Cards */}
        <div className="mt-16 max-w-6xl mx-auto">
          <Tools />
        </div>
      </main>
    </div>
  );
};

export default Home;
