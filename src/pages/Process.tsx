import { TextAnimate } from '../components/ui/text-animate'

const Process = () => {
  return (
    <div className="relative w-full overflow-hidden px-4 sm:px-8 md:px-16 lg:px-40">
      <div className="absolute inset-0 z-0">
        <div className="absolute -left-32 -top-32 h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-primary/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center py-16 sm:py-24">
        <div className="flex w-full flex-col items-center gap-16">
          
          {/* Title */}
          <div className="flex flex-col items-center text-center">
            <TextAnimate
              animation="fadeIn"
              by="word"
              className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tighter text-[#0f0f0f] dark:text-white"
            >
              Transform Your Images Seamlessly
            </TextAnimate>

            <TextAnimate
              animation="fadeIn"
              by="word"
              className="mt-4 max-w-2xl text-base sm:text-lg text-gray-600 dark:text-white/50"
            >
              Our intuitive toolkit simplifies image optimization. Follow these
              dynamic steps to perfect your images in seconds.
            </TextAnimate>
          </div>

          {/* Steps */}
          <div className="relative w-full">
            {/* Vertical connecting line */}
            <div className="absolute left-1/2 top-14 hidden md:block h-[calc(100%-7rem)] w-1 -translate-x-1/2 bg-linear-to-b from-primary/30 via-primary/10 to-transparent" />

            <ol className="grid w-full grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
              
              {/* Step 1 */}
              <li className="group relative flex flex-col items-center gap-6 text-center md:items-start md:text-left">
                <div className="flex items-center gap-6 md:w-full">
                  <div className="relative z-10 flex h-28 w-28 shrink-0 items-center justify-center rounded-full border border-border bg-card shadow-xl shadow-black/20 transition-all duration-300 group-hover:scale-105 group-hover:border-primary/50 group-hover:shadow-orange-500/20">
                    <div className="absolute inset-0 animate-gradient-move rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent bg-size-[200%_200%] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <svg
                      className="h-12 w-12 text-zinc-400 transition-colors duration-300 group-hover:text-primary"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                    </svg>
                  </div>

                  {/* Hover beam line */}
                  <div className="absolute -top-14 left-1/2 hidden sm:block h-1 w-40 md:w-full -translate-x-1/2 scale-x-0 transform-gpu bg-linear-to-r from-transparent via-orange-400/50 to-transparent transition-transform duration-500 group-hover:scale-x-100" />

                  <div className="hidden grow border-t border-dashed border-border md:block" />
                </div>

                <div className="flex flex-col gap-2">
                  <TextAnimate animation="fadeIn" by="word" className="text-xl font-bold text-black/90 dark:text-white">
                    1. Upload Your Image
                  </TextAnimate>
                  <TextAnimate animation="fadeIn" by="word" className="text-gray-600 dark:text-white/50">
                    Simply drag and drop or select an image from your device to begin the transformation.
                  </TextAnimate>
                </div>
              </li>

              {/* Step 2 */}
              <li className="group relative flex flex-col items-center gap-6 text-center md:items-start md:text-left">
                <div className="flex items-center gap-6 md:w-full">
                  <div className="hidden grow border-t border-dashed border-border-dark md:block" />
                  <div className="relative z-10 flex h-28 w-28 shrink-0 items-center justify-center rounded-full border border-border bg-card shadow-xl shadow-black/20 transition-all duration-300 group-hover:scale-105 group-hover:border-primary/50 group-hover:shadow-orange-500/20">
                    <div className="absolute inset-0 animate-gradient-move rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent bg-size-[200%_200%] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <svg
                      className="h-12 w-12 text-zinc-400 transition-colors duration-300 group-hover:text-primary"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z" />
                      <polyline points="12 12 15 15 18 12" />
                      <line x1={12} x2={12} y1={17} y2={22} />
                      <line x1={7} x2={17} y1={12} y2={12} />
                    </svg>
                  </div>

                  {/* Hover beam line */}
                  <div className="absolute -top-14 left-1/2 hidden sm:block h-1 w-40 md:w-full -translate-x-1/2 scale-x-0 transform-gpu bg-linear-to-r from-transparent via-orange-400/50 to-transparent transition-transform duration-500 group-hover:scale-x-100" />

                  <div className="hidden grow border-t border-dashed border-border md:block" />
                </div>

                <div className="flex flex-col items-center gap-2">
                  <TextAnimate animation="fadeIn" by="word" className="text-xl font-bold text-black/90 dark:text-white">
                    2. Process Your Image
                  </TextAnimate>
                  <TextAnimate animation="fadeIn" by="word" className="text-center text-gray-600 dark:text-white/50">
                    Choose to convert, compress, or upscale. Our AI toolkit automatically works its magic.
                  </TextAnimate>
                </div>
              </li>

              {/* Step 3 */}
              <li className="group relative flex flex-col items-center gap-6 text-center md:items-start md:text-left">
                <div className="flex items-center gap-6 md:w-full">
                  <div className="hidden grow border-t border-dashed border-border-dark md:block" />
                  <div className="relative z-10 flex h-28 w-28 shrink-0 items-center justify-center rounded-full border border-border bg-card shadow-xl shadow-black/20 transition-all duration-300 group-hover:scale-105 group-hover:border-primary/50 group-hover:shadow-orange-500/20">
                    <div className="absolute inset-0 animate-gradient-move rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent bg-size-[200%_200%] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <svg
                      className="h-12 w-12 text-zinc-400 transition-colors duration-300 group-hover:text-primary"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1={12} x2={12} y1={15} y2={3} />
                    </svg>
                  </div>

                  {/* Hover beam line */}
                  <div className="absolute -top-14 left-1/2 hidden sm:block h-1 w-40 md:w-full -translate-x-1/2 scale-x-0 transform-gpu bg-linear-to-r from-transparent via-orange-400/50 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
                </div>

                <div className="flex flex-col sm:items-end gap-2">
                  <TextAnimate animation="fadeIn" by="word" className="text-xl font-bold text-black/90 dark:text-white">
                    3. Download Your File
                  </TextAnimate>
                  <TextAnimate animation="fadeIn" by="word" className="sm:text-right text-gray-600 dark:text-white/50">
                    Preview your Compressd image and download it instantly in your desired format.
                  </TextAnimate>
                </div>
              </li>

            </ol>
          </div>

          {/* Button */}
          <div className="flex pt-8">
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-8 dark:bg-primary-dark bg-[#0f0f0f]/10 text-black/80 border border-black/30 dark:text-white text-base font-bold leading-normal tracking-wide shadow-lg shadow-orange-600/30 transition-all duration-300 hover:scale-105 hover:shadow-orange-600/40 focus:outline-none focus:ring-3 focus:ring-orange-800/50">
              <span className="truncate">Get Started Now</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Process
