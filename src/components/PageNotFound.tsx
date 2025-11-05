
const PageNotFound = () => {
  return (
    <div>
      <>
  <main className=" grow flex flex-col items-center justify-center text-center z-10 w-full px-4">
    <div className="flex flex-col items-center gap-6 max-w-3xl">
      <div className="flex items-center justify-center gap-2 md:gap-4">
        <span
          className="text-[10rem] md:text-[16rem] lg:text-[20rem] font-black text-primary drop-shadow-lg animate-number-fall"
          style={{ animationDelay: "0.2s" }}
        >
          4
        </span>
        <div
          className="relative w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 animate-number-float"
          style={{ animationDelay: "0.5s" }}
        >
          <svg
            className="absolute inset-0 w-full h-full text-primary drop-shadow-lg"
            fill="currentColor"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx={50} cy={50} r={48} stroke="white" strokeWidth={4} />
            <text
              className="text-[50px] font-black"
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
          className="text-[10rem] md:text-[16rem] lg:text-[20rem] font-black text-primary drop-shadow-lg animate-number-fall"
          style={{ animationDelay: "0.4s" }}
        >
          4
        </span>
      </div>
      <div
        className="flex flex-col gap-2 animate-float-light"
        style={{ animationDelay: "1.5s" }}
      >
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary">
          Houston, we have a missing page.
        </h1>
        <p className="text-base md:text-lg text-text-secondary max-w-xl">
          Looks like you've stumbled upon a pixelated black hole. Don't worry,
          we can navigate you back to the vibrant universe of our tools.
        </p>
      </div>
      <div
        className="mt-4 flex flex-col sm:flex-row items-center gap-3 w-full max-w-lg animate-float-light"
        style={{ animationDelay: "1.7s" }}
      >
        <a
          className="flex w-full sm:w-auto min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-6 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary-hover shadow-lg hover:shadow-xl transition-all duration-300"
          href="#"
        >
          <span className="truncate">Beam me up, Homepage!</span>
        </a>
        <div className="w-full sm:flex-1">
          <label className="flex flex-col h-12 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-full h-full shadow-md bg-white">
              <div className="text-text-secondary flex items-center justify-center pl-4">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-full text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 border-none bg-transparent h-full placeholder:text-text-secondary/60 px-4 text-base font-normal leading-normal"
                placeholder="Search for tools..."
                defaultValue=""
              />
            </div>
          </label>
        </div>
      </div>
    </div>
  </main>
  <div className="absolute inset-0 z-0 overflow-hidden">
    <div
      className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-orange-300/50 rounded-full blur-3xl opacity-50 animate-float-light"
      style={{ animationDelay: "0.5s", animationDuration: "8s" }}
    />
    <div
      className="absolute -top-1/4 -right-1/4 w-2/3 h-2/3 bg-orange-300/50 rounded-full blur-3xl opacity-50 animate-float-light"
      style={{ animationDelay: "1s", animationDuration: "10s" }}
    />
    <div
      className="absolute bottom-10 right-10 w-1/3 h-1/3 bg-orange-200/50 rounded-full blur-3xl opacity-60 animate-float-light"
      style={{ animationDelay: "1.5s", animationDuration: "12s" }}
    />
  </div>
</>

    </div>
  )
}

export default PageNotFound
