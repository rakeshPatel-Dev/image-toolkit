import { Mail, Facebook, Linkedin, Instagram } from "lucide-react";
import { TextAnimate } from "../components/ui/text-animate";

const Contact = () => {
  return (
    <main className="grow mt-8 p-4 sm:p-8 lg:p-12">
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <TextAnimate animation="fadeIn" by="word" className="text-4xl sm:text-5xl font-black text-black dark:text-white tracking-tight">
            Get in Touch
          </TextAnimate>
          <TextAnimate animation="fadeIn" by="word" className="text-gray-600 dark:text-[#9db0b9] max-w-xl mx-auto text-base">
            We'd love to hear from you! Fill out the form below or reach out using the contact details.
          </TextAnimate>
        </div>

        {/* Contact Form + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Form */}
          <div className="lg:col-span-2 bg-white dark:bg-[#0f0f0f]/20 border dark:border-white/10 border-black/15 backdrop-blur-2xl p-6 sm:p-8 rounded-xl shadow-md">
            <form className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <label className="flex flex-col" htmlFor="name">
                  <p className="text-md font-medium text-black dark:text-white pb-2">
                    Name
                  </p>
                  <input
                    id="name"
                    className="w-full rounded-md py-2 px-4 border border-gray-300 dark:border-white/20 bg-background-light text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#9db0b9] focus:ring focus:ring-orange-500 outline-none text-sm"
                    placeholder="Enter your name"
                  />
                </label>
                <label className="flex flex-col" htmlFor="email">
                  <p className="text-base font-medium text-black dark:text-white pb-2">
                    Email
                  </p>
                  <input
                    id="email"
                    type="email"
                    className="w-full rounded-md py-2 px-4 border border-gray-300 dark:border-white/20 bg-background-light text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#9db0b9] focus:ring focus:ring-orange-500 outline-none text-sm"
                    placeholder="Enter your email"
                  />
                </label>
              </div>

              <label className="flex flex-col" htmlFor="subject">
                <p className="text-base font-medium text-black dark:text-white pb-2">
                  Subject
                </p>
                <input
                  id="subject"
                  className="w-full rounded-md py-2 px-4 border border-gray-300 dark:border-white/20 bg-background-light text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#9db0b9] focus:ring focus:ring-orange-500 outline-none text-sm"
                  placeholder="Enter subject"
                />
              </label>

              <label className="flex flex-col" htmlFor="message">
                <p className="text-base font-medium text-black dark:text-white pb-2">
                  Message
                </p>
                <textarea
                  id="message"
                  className="w-full rounded-md py-2 px-4 border border-gray-300 dark:border-white/20 bg-background-light text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#9db0b9] focus:ring focus:ring-orange-500 outline-none text-sm resize-y max-h-40"
                  placeholder="Enter your message"
                />
              </label>

              <button
                type="submit"
                className="w-full sm:w-auto  border dark:border-white/10 border-black/20 bg-orange-600 hover:bg-orange-700 active:scale-95 cursor-pointer dark:text-white font-semibold px-8 py-3 rounded-lg transition-all"
              >
                Submit Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-10">
            <div>
              <h3 className="text-lg font-bold text-black dark:text-white mb-4">
                Contact Information
              </h3>
              <div className="flex flex-col gap-4 text-gray-600 dark:text-[#9db0b9]">
                <a
                  href="mailto:support@imagetoolkit.com"
                  className="flex text-sm items-center gap-3 hover:text-primary transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  support@imagetoolkit.com
                </a>
               
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-black dark:text-white mb-4">
                Follow Us
              </h3>
              <div className="flex items-center gap-5">
                <a
                  href="javascript:void(0)"
                  aria-label="Instagram"
                  title="Instagram"
                  className="hover:text-primary dark:hover:text-primary text-gray-600 dark:text-[#9db0b9] transition-colors"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a
                  href="javascript:void(0)"
                  aria-label="Facebook"
                  title="Facebook"
                  className="hover:text-primary dark:hover:text-primary text-gray-600 dark:text-[#9db0b9] transition-colors"
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a
                  href="javascript:void(0)"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                  className="hover:text-primary dark:hover:text-primary text-gray-600 dark:text-[#9db0b9] transition-colors"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;
