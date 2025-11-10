import { useEffect, useState } from "react";
import { Rocket } from "lucide-react"; // you can replace with your logo/icon

const Preloader = () => {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((old) => {
        const next = old + Math.random() * 10; // smooth randomness
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoaded(true), 300); // short fade delay
          return 100;
        }
        return next;
      });
    }, 200);
  }, []);

  if (loaded) return null;

  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-linear-to-b from-[#0f0f0f] to-black dark:from-[#0f0f0f] dark:to-gray-900 text-white transition-all duration-500">
      <div className="flex items-center gap-3 mb-6">
        <Rocket className="w-8 h-8 text-blue-400 animate-bounce" />
        <h1 className="text-2xl font-bold tracking-wide">Image Toolkit</h1>
      </div>

      <p className="text-sm text-gray-400 mb-3">
        Optimizing Workspace... {Math.floor(progress)}%
      </p>

      <div className="relative w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="absolute h-full bg-linear-to-r from-blue-500 via-cyan-400 to-purple-500 transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default Preloader;
