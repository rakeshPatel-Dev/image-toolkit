import { Routes, Route, useLocation } from "react-router-dom";
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
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/process" element={<Process />} />
          <Route path="/reviews" element={<ReviewMarquee />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FaqSection />} />
          <Route path="/convert" element={<Convert />} />
          <Route path="/Compress" element={<Compress />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </AnimatePresence>

      {!hideLayout && <Footer />}
    </div>
  );
};

export default App;
