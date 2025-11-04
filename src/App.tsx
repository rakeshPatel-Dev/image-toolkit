import About from "./components/pages/about/About"
import Hero from "./components/pages/Hero"
import Pricing from "./components/pages/Pricing"
import { ReviewMarquee } from "./components/pages/ReviewMarquee"
import { DotPattern } from "./components/ui/dot-pattern"
import AnimatedBasedVelocity from "./components/pages/AnimatedBasedVelocity"
import { cn } from "./lib/utils"
import Process from "./components/pages/Process"
import FaqSection from "./components/pages/FaqSection"
import Preloader from "./components/pages/Preloader"
import Contact from "./components/pages/Contact"
import Footer from "./components/pages/Footer"




const App = () => {
  return (
    <div className=" bg-white dark:bg-black">

      <DotPattern className={cn(
        "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)] h-screen text-orange-500 dark:text-orange-900 z-0 absolute "
      )} />
      <div className="relative z-1">
        <Preloader />
        <Hero />
        <AnimatedBasedVelocity />
        <Process />
        <About />
        <ReviewMarquee />
        <Pricing />
        <FaqSection />
        <Contact/>
        <Footer/>

      </div>
    </div>
  )
}

export default App
