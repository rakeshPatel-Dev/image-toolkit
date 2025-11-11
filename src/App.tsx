import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Header from "./components/header";
import Footer from "./components/Footer";
import Preloader from "./components/Preloader";
import PageNotFound from "./components/PageNotFound";

import Hero from "./pages/Hero";
import About from "./pages/about/About";
import Pricing from "./pages/Pricing";
import { ReviewMarquee } from "./pages/ReviewMarquee";
import AnimatedBasedVelocity from "./components/AnimatedBasedVelocity";
import Process from "./pages/Process";
import FaqSection from "./pages/FaqSection";
import Contact from "./pages/Contact";
import Convert from "./pages/Convert";
import { useReTriggerAnimation } from "./hooks/useReTriggerAnimation";
import { AnimatePresence } from "framer-motion";
import Compress from "./pages/Compress";
import Resize  from "./pages/Resize";
import AllTools from "./pages/AllTools";
import AboutTools from "./pages/AboutTools";
import Watermark from "./pages/Watermark";
import CropImage from "./pages/CropImage";

const Home = () => (
  <>
    <Preloader />
    <Hero />
    <AnimatedBasedVelocity />
    <Process />
    <About />
    <ReviewMarquee />
    <Pricing />
    <FaqSection />
    <Contact />
  </>
);

const App = () => {
  const location = useLocation();
  useReTriggerAnimation();

  // ✅ Define routes that should NOT show header/footer
  const noLayoutRoutes = ["/404"];

  const hideLayout = noLayoutRoutes.includes(location.pathname);

  return (
    <div className="bg-white dark:bg-black">
      {!hideLayout && <Header />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/exploreTools" element={<AboutTools />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/process" element={<Process />} />
          <Route path="/reviews" element={<ReviewMarquee />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FaqSection />} />
          <Route path="/convert" element={<Convert />} />
          <Route path="/Compress" element={<Compress />} />
          <Route path="/resize" element={<Resize  />} />
          <Route path="/crop" element={<CropImage  />} />
          <Route path="/watermark" element={<Watermark  />} />
          <Route path="/Tools" element={<AllTools />} />
          {/* <Route path="/addwatermark" element={<AddWatermark />} /> */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </AnimatePresence>

      {!hideLayout && <Footer />}
        <Toaster position="top-center" toastOptions={{ duration: 2500 }} />
    </div>
  );
};

export default App;
