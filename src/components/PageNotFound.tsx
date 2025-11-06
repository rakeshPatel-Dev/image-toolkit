import{ useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const PageNotFound = () => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const tools = [
    
    { name: "Convert", path: "/convert" },
    { name: "Compress", path: "/compress" },
    { name: "Upscale", path: "/upscale" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/${encodeURIComponent(query)}`);
      setShowSuggestions(false);
    } else {
      alert("Please enter something to search!");
    }
  };

  return (
    <div className="relative h-auto flex items-center justify-center px-4 bg-gradient-to-b from-white via-orange-50 to-white dark:from-gray-900 dark:via-gray-950 dark:to-black overflow-hidden">
      <main className="mt-10 mb-10 flex flex-col items-center text-center z-10 max-w-3xl w-full">
        {/* 404 Section */}
        <div className="flex items-center justify-center gap-2 md:gap-4">
          <span
            className="text-[10rem] md:text-[16rem] lg:text-[20rem] font-black text-orange-500 dark:text-orange-400 drop-shadow-lg animate-bounce"
            style={{ animationDelay: "0.2s" }}
          >
            4
          </span>
          <div
            className="relative w-28 h-28 md:w-44 md:h-44 lg:w-56 lg:h-56 animate-bounce"
            style={{ animationDelay: "0.3s" }}
          >
            <svg
              className="absolute inset-0 w-full h-full text-orange-500 dark:text-orange-400 drop-shadow-lg"
              fill="currentColor"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx={50} cy={50} r={48} stroke="white" strokeWidth={4} />
              <text
                className="text-[50px] font-bold"
                dominantBaseline="central"
                fill="white"
                textAnchor="middle"
                x="50%"
                y="53%"
              >
                0
              </text>
            </svg>
          </div>
          <span
            className="text-[10rem] md:text-[16rem] lg:text-[20rem] font-black text-orange-500 dark:text-orange-400 drop-shadow-lg animate-bounce"
            style={{ animationDelay: "0.4s" }}
          >
            4
          </span>
        </div>

        {/* Text Section */}
        <div className="flex flex-col gap-3 -mt-16">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 animate-slide-up">
            Houston, we have a missing page.
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto animate-fade-in">
            Looks like you've stumbled into a digital black hole. Don’t worry,
            let’s beam you back to the bright side.
          </p>
        </div>

        {/* Buttons & Search */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 w-full max-w-lg relative">
          <Link
            to="/"
            className="flex w-full sm:w-auto items-center justify-center rounded-full h-12 px-6 text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Beam me up, Homepage!
          </Link>

          <form
            onSubmit={handleSearch}
            className="w-full sm:flex-1 flex items-center bg-white dark:bg-gray-800 rounded-full shadow-md focus-within:ring-2 focus-within:ring-orange-400 transition-all border border-black/50 relative"
          >
            <button
              type="submit"
              className="flex items-center justify-center px-3 py-4 text-gray-500 dark:text-gray-300 hover:text-orange-500"
            >
              <Search size={20} />
            </button>
            <input
              type="text"
              className="flex-1 bg-transparent border-none focus:outline-none px-3 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Search for tools..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // small delay for click
            />

            {/* Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute bottom-14 left-0 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-20">
                {tools.map((tool, index) => (
                  <Link
                    key={index}
                    to={tool.path}
                    className="block text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-600/40 transition-all"
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            )}
          </form>
        </div>
      </main>

      {/* Orange Blur Backgrounds */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-orange-400/40 dark:bg-orange-600/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "0.5s", animationDuration: "5s" }}
        />
        <div
          className="absolute -top-1/4 -right-1/4 w-2/3 h-2/3 bg-orange-300/40 dark:bg-orange-700/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s", animationDuration: "5s" }}
        />
        <div
          className="absolute bottom-10 right-10 w-1/3 h-1/3 bg-orange-200/40 dark:bg-orange-800/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1.5s", animationDuration: "3" }}
        />
      </div>
    </div>
  );
};

export default PageNotFound;
