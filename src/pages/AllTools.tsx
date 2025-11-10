
import Convert from "/Convert.webp";
import Compress from "/Compress.webp";
import Resize from "/Resize.webp";
import Crop from "/Crop.webp";
import Watermark from "/Watermark.webp";
import RemoveBg from "/RemoveBg.webp";
import { Link } from "react-router-dom";

const AllTools = () => {
  return (
    <div className="min-h-screen max-w-4xl mx-auto bg-white dark:bg-black transition-colors duration-300 mt-14">
      <main className="grow">
        {/* Heading Section */}
        <div className="flex flex-wrap justify-center gap-3 p-4 py-8 text-center">
          <div className="flex w-full flex-col items-center gap-3">
            <h1 className="text-gray-900 dark:text-white text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
              Select a Tool
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg font-normal leading-normal max-w-xl">
              Powerful image editing, simplified.
            </p>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 wrap sm:gap-6 p-10 sm:p-6 md:px-10">
          {[
            {
              icon: Convert,
              title: "Change File Type",
              desc: "Change the file type of your image.",
              path: "/convert",
            },
            {
              icon: Compress,
              title: "Compress Size",
              desc: "Reduce the file size of your image.",
              path: "/compress",
            },
            {
              icon: Resize,
              title: "Resize",
              desc: "Change the dimensions of your image.",
              path: "/resize",
            },
            {
              icon: Crop,
              title: "Crop",
              desc: "Cut out a portion of your image.",
              path: "/crop",
            },

            {
              icon: RemoveBg,
              title: "BG Remover",
              desc: "Erase the background of your image.",
              path: "/removebg",
            },
            {
              icon: Watermark,
              title: "Watermark",
              desc: "Add a custom watermark to your image.",
              path: "/watermark",
            },

          ].map((tool, i) => (
            <Link to={tool.path}
              key={i}
              className="flex items-center min-w-54 min-h-54 flex-col gap-3 rounded-xl border border-black/20 dark:border-white/10 
              bg-white/10 dark:bg-[#0f0f0f]/80 p-4 sm:p-5 transition-all duration-300 ease-in-out 
              hover:-translate-y-1 hover:shadow-2xl  
              hover:shadow-orange-500/50 hover:border-black/80 hover:bg-black/5 dark:hover:border-white/30 group"
             >
              <div className="dark:border-white/20 h-14 w-14 bg-white rounded-full p-2">
                <img
                  src={tool.icon}
                  alt={tool.title}
                  className="w-full group-hover:scale-120 transition-all h-full object-cover"
                />
              </div>
              <div className="flex items-center flex-col gap-1 text-center sm:text-left">
                <h2 className="text-gray-900 dark:text-white text-sm sm:text-xl font-bold leading-tight">
                  {tool.title}
                </h2>
                <p className="text-gray-600 text-center dark:text-gray-400 text-xs sm:text-sm font-normal leading-normal">
                  {tool.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AllTools;
