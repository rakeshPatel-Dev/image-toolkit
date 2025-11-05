import { ToolCase, Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full dark:bg-[#0f0f0f]/50 bg-white text-black dark:text-[#E0E0E0] py-12 px-6 sm:px-16 lg:px-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-10">
          {/* Brand */}
          <div className="md:col-span-3 flex items-start">
            <a className="flex items-center gap-2 text-primary font-semibold" href="#">
              <ToolCase className="w-6 h-6" />
              <span className="text-xl font-bold">ImageToolkit</span>
            </a>
          </div>

          {/* Links */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {/* Toolkit */}
            <div>
              <h3 className="font-bold text-black dark:text-white mb-4">Toolkit</h3>
              <ul className="space-y-3">
                {[
                  { name: "Convert", path: "/convert" },
                  { name: "Compress", path: "/compress" },
                  { name: "Upscale", path: "/upscale" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className="text-[#555] hover:text-orange-600 transition-all hover:underline hover:underline-offset-6 decoration-[1.5px]"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>


            {/* Company */}
            <div>
              <h3 className="font-bold text-black dark:text-white mb-4">Company</h3>
              <ul className="space-y-3">
                {["About Us", "Contact", "Blog"].map((item) => (
                  <li key={item}>
                    <a
                      href="javascript:void(0)"
                      className="text-[#555]  hover:text-orange-600 transition-all hover:underline hover:underline-offset-6 decoration-[1.5px]"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-bold text-black dark:text-white mb-4">Legal</h3>
              <ul className="space-y-3">
                {["Privacy Policy", "Terms of Service"].map((item) => (
                  <li key={item}>
                    <a
                      href="javascript:void(0)"
                      className="text-[#555]  hover:text-orange-600 transition-all hover:underline hover:underline-offset-6 decoration-[1.5px]"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* More from developer */}
            <div>
              <h3 className="font-bold text-black dark:text-white mb-4 ">More from Developer</h3>
              <ul className="space-y-3">
                {["PhotoLab App", "Call Reminder App"].map((item) => (
                  <li key={item}>
                    <a
                      href="javascript:void(0)"
                      className="text-[#555]  hover:text-orange-600 transition-all hover:underline hover:underline-offset-6 decoration-[1.5px]"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social Icons */}
          <div className="md:col-span-3 flex md:justify-end items-start">
            <div className="flex items-center space-x-5">
              <a
                href="#"
                aria-label="Twitter"
                className="hover:text-primary transition-transform transform hover:scale-110"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="#"
                aria-label="GitHub"
                className="hover:text-primary transition-transform transform hover:scale-110"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="hover:text-primary transition-transform transform hover:scale-110"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#333333]/50 pt-6 flex flex-col sm:flex-row sm:justify-between items-center text-sm text-[#888888] gap-4">
          <p>© {new Date().getFullYear()} ImageToolkit. All Rights Reserved.</p>
          <p>
            Designed & Developed by{" "}
            <a
              href="rakeshthedev.netlify.app" target="_blank"
              className="text-primary font-medium hover:underline transition-colors"
            >
              Rakesh Patel
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
