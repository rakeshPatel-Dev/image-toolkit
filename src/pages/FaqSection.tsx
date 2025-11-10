"use client";

import { useState, useRef } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { TextAnimate } from "../components/ui/text-animate";
import { ProgressiveBlur } from "../components/ui/progressive-blur";
import { Link } from "react-router-dom";

interface FaqItem {
    q: string;
    a: string;
}

const faqData: FaqItem[] = [
  // 🌐 GENERAL QUESTIONS (20)
  { q: "What is Image Toolkit?", a: "Image Toolkit is an all-in-one online platform to edit, compress, resize, crop, watermark, and remove backgrounds from your images instantly." },
  { q: "Is Image Toolkit free to use?", a: "Yes, basic tools are free. Pro and Business plans unlock premium features like batch processing and higher limits." },
  { q: "How does Image Toolkit process images?", a: "All operations are performed securely in the cloud using optimized AI and compression algorithms." },
  { q: "Do I need to create an account?", a: "No account is needed for free tools, but you can sign up to save progress, history, and get faster performance." },
  { q: "Is my uploaded image safe?", a: "Yes, your files are encrypted and automatically deleted after processing to ensure privacy." },
  { q: "Can I edit multiple images at once?", a: "Yes, Pro users can batch process multiple images simultaneously." },
  { q: "How fast is the image processing?", a: "Most tasks complete within seconds depending on image size and internet speed." },
  { q: "Do you support all image formats?", a: "Yes, major formats like JPG, PNG, WEBP, GIF, and TIFF are supported." },
  { q: "Can I use Image Toolkit on mobile?", a: "Yes, our website is mobile-friendly and works perfectly on all devices." },
  { q: "What’s the difference between free and Pro plans?", a: "Pro offers higher upload limits, faster processing, batch features, and no ads." },
  { q: "How can I contact customer support?", a: "You can reach our support team anytime via the Contact Us page or live chat." },
  { q: "Do you offer refunds?", a: "Yes, refunds are available within 7 days of purchase if you experience technical issues." },
  { q: "Are my edits stored permanently?", a: "No, images are deleted automatically after download for privacy and storage safety." },
  { q: "Can I preview edits before downloading?", a: "Yes, you can preview your image changes in real time before saving." },
  { q: "Do you provide tutorials or guides?", a: "Yes, we have a help section with tutorials, FAQs, and short video guides." },
  { q: "Is there a desktop version?", a: "Currently, it’s web-based, but a desktop version is in development." },
  { q: "Do you collect user data?", a: "Only minimal information like email and usage logs is stored securely for service improvement." },
  { q: "Can I leave a review?", a: "Absolutely, you can share your feedback and reviews on our homepage or app store listing." },
  { q: "How often are new tools added?", a: "New features are added monthly based on user requests and feedback." },
  { q: "What payment methods are supported for Pro?", a: "We accept all major cards, PayPal, and local digital wallets depending on your region." },

  // 🖋️ ADD WATERMARK (10)
  { q: "How do I add a watermark to my image?", a: "Upload your image, choose text or logo watermark, adjust position, opacity, and apply instantly." },
  { q: "Can I use my own logo as a watermark?", a: "Yes, you can upload your logo in PNG or WEBP format to use as a custom watermark." },
  { q: "Can I control watermark transparency?", a: "Absolutely, you can adjust the opacity slider to make your watermark more or less visible." },
  { q: "Is there an option to change watermark position?", a: "Yes, choose from preset positions or manually drag and place it anywhere on the image." },
  { q: "Can I add multiple watermarks to one image?", a: "Yes, you can add multiple text or logo watermarks before exporting." },
  { q: "Does adding a watermark reduce image quality?", a: "No, the watermark is applied smartly without reducing the original image quality." },
  { q: "Can I change watermark color and font?", a: "Yes, you can customize font style, size, and color easily." },
  { q: "Is watermark placement available for batch images?", a: "Yes, Pro users can apply the same watermark to multiple images at once." },
  { q: "Can I remove or edit the watermark after applying?", a: "You can edit before downloading, but once exported, it can’t be removed." },
  { q: "Which image formats support watermarking?", a: "All popular formats like JPG, PNG, WEBP, and GIF are supported." },

  // 📏 RESIZE IMAGE (10)
  { q: "How do I resize my image?", a: "Upload your image, set new width and height manually or choose a preset ratio." },
  { q: "Can I maintain aspect ratio while resizing?", a: "Yes, you can lock the aspect ratio to avoid image distortion." },
  { q: "Does resizing reduce image quality?", a: "No, resizing uses smart scaling to maintain maximum visual quality." },
  { q: "Can I resize multiple images at once?", a: "Yes, batch resizing is supported in Pro and Business plans." },
  { q: "Can I resize by percentage instead of pixels?", a: "Yes, you can choose between pixel dimensions or percentage scale." },
  { q: "Is there a preview before resizing?", a: "Yes, you can preview the resized image before downloading." },
  { q: "Can I resize images for social media platforms?", a: "Yes, choose from preset sizes for Instagram, Facebook, YouTube, and more." },
  { q: "What file types are supported for resizing?", a: "JPEG, PNG, WEBP, and GIF are supported for resizing." },
  { q: "Can I resize without cropping?", a: "Yes, resizing only adjusts dimensions without cutting any part of the image." },
  { q: "Can I restore original size after resizing?", a: "You can reset the image to its original size before downloading." },

  // ✂️ CROP IMAGE (10)
  { q: "How do I crop an image?", a: "Upload your image, select the crop tool, adjust the frame, and apply changes." },
  { q: "Can I crop using aspect ratios?", a: "Yes, choose preset aspect ratios like 1:1, 16:9, or custom ratios." },
  { q: "Can I move the crop area freely?", a: "Yes, you can drag and adjust the crop box anywhere on the image." },
  { q: "Does cropping reduce image quality?", a: "No, cropping keeps the same resolution for the selected portion." },
  { q: "Can I undo or reset crop changes?", a: "Yes, you can undo or reset before finalizing your crop." },
  { q: "Can I crop multiple images at once?", a: "Batch cropping is available for premium users." },
  { q: "Is circular or custom-shaped cropping available?", a: "Yes, you can crop in rectangular or circular shapes." },
  { q: "Can I preview before final cropping?", a: "Yes, preview your cropped output before downloading." },
  { q: "Which formats support cropping?", a: "JPEG, PNG, WEBP, and GIF files can all be cropped easily." },
  { q: "Can I crop images for profile or ID photo sizes?", a: "Yes, you can use pre-defined dimensions for passport or profile photos." },

  // 🧼 REMOVE BACKGROUND (10)
  { q: "How do I remove the background from an image?", a: "Upload your image and our AI automatically detects and removes the background." },
  { q: "Does it work on complex backgrounds?", a: "Yes, our AI handles complex and detailed backgrounds efficiently." },
  { q: "Can I fine-tune the edges after background removal?", a: "Yes, you can refine edges using the smoothness or brush tools." },
  { q: "Can I choose a new background color?", a: "Yes, you can replace the background with any solid color or transparent option." },
  { q: "Is background removal available for product photos?", a: "Yes, it’s perfect for e-commerce product and portrait images." },
  { q: "Can I upload multiple images for background removal?", a: "Yes, batch background removal is supported for Pro and Business users." },
  { q: "Will the output support transparency?", a: "Yes, the final image is exported as a transparent PNG or WEBP file." },
  { q: "Does it work with hair or detailed edges?", a: "Yes, the AI detects fine details like hair strands and keeps them natural." },
  { q: "Can I restore the original background later?", a: "You can preview both versions, but once exported, the background is permanently removed." },
  { q: "What file formats support background removal?", a: "JPEG, PNG, and WEBP formats are supported for this feature." },

  // 🗜️ COMPRESS IMAGE SIZE (10)
  { q: "How do I compress an image?", a: "Upload your image, choose compression level, and download a smaller version instantly." },
  { q: "What’s the difference between lossy and lossless compression?", a: "Lossy compression reduces file size more but may slightly reduce quality, while lossless keeps full quality." },
  { q: "Can I choose the output quality?", a: "Yes, you can adjust the compression percentage manually for full control." },
  { q: "Does compression affect resolution?", a: "No, resolution stays the same; only redundant data is reduced." },
  { q: "Can I compress multiple images together?", a: "Yes, Pro users can compress multiple images in one go." },
  { q: "How much file size can I reduce?", a: "Typically, compression can reduce file size by 50–90% depending on the image type." },
  { q: "Can I preview the image before and after compression?", a: "Yes, our tool provides side-by-side before and after previews." },
  { q: "Which image types can be compressed?", a: "JPG, PNG, WEBP, and TIFF images can be compressed effectively." },
  { q: "Will it remove image metadata?", a: "Yes, metadata like camera info is removed to help reduce file size." },
  { q: "Is compression safe for printing?", a: "Yes, as long as you keep the quality above 80%, print quality remains excellent." },

//   Convert file type
  { q: "How do I convert my image to another format?", a: "Upload your image, choose the output format like JPG, PNG, or WEBP, and click convert." },
  { q: "Which image formats are supported for conversion?", a: "We support JPG, PNG, WEBP, GIF, BMP, TIFF, and more." },
  { q: "Does image quality change after conversion?", a: "No, our converter preserves original quality unless you choose a lower-quality format intentionally." },
  { q: "Can I convert multiple images at once?", a: "Yes, batch conversion is available in the Pro and Business plans." },
  { q: "Can I convert animated GIFs or WEBP files?", a: "Yes, animations remain intact when converting between supported formats." },
  { q: "Is there a size limit for conversions?", a: "Free users can convert images up to 10MB. Pro users get higher limits." },
  { q: "Can I preview the image before downloading?", a: "Yes, you can view the converted image before saving it." },
  { q: "Does conversion remove metadata?", a: "Yes, metadata such as camera info or GPS data is removed for better privacy and smaller file size." },
  { q: "Can I convert images for web optimization?", a: "Yes, converting to WEBP or AVIF gives you smaller, web-friendly files without losing quality." },
  { q: "Is the conversion done online or offline?", a: "All conversions are processed online securely and deleted automatically after completion." },
  
  //   test
  { q: "No More Data, Scroll Up!", a: "Its for Testing" },

];


const FaqSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [search, setSearch] = useState<string>("");
    const [showAll, setShowAll] = useState(false);
    const faqRefs = useRef<Array<HTMLDivElement | null>>([]);

    const toggleIndex = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
        setTimeout(() => {
            faqRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
    };

    const filteredFaqs = faqData.filter(
        (item) =>
            item.q.toLowerCase().includes(search.toLowerCase()) ||
            item.a.toLowerCase().includes(search.toLowerCase())
    );

    const visibleFaqs = showAll ? filteredFaqs : filteredFaqs.slice(0, 5);

    const highlightText = (text: string) => {
        if (!search) return text;
        const regex = new RegExp(`(${search})`, "gi");
        const parts = text.split(regex); // renamed from children.split
        return parts.map((part, i) =>
            regex.test(part) ? (
                <span key={i} className="bg-yellow-200 text-black px-1 rounded">
                    {part}
                </span>
            ) : (
                part
            )
        );
    };

    return (
        <main className="grow  pt-16 md:pt-24 pb-16 px-4 md:px-8 lg:px-20">
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-8">
                <TextAnimate animation="fadeIn" by="word" className="text-[#0f0f0f] dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
                    How can we help?
                </TextAnimate>
                <TextAnimate animation="fadeIn" by="word" className="text-gray-600 dark:text-gray-400 text-base md:text-lg mt-3 max-w-2xl">
                    Find answers to common questions about our image toolkit, features, and billing.
                </TextAnimate>
            </div>

            {/* Search */}
            <div className="max-w-2xl mx-auto mb-8">
                <input
                    type="text"
                    placeholder="Search questions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-black/10 border-black/50 dark:bg-[#0f0f0f]/50 text-[#0f0f0f] dark:text-white placeholder-gray-500 rounded-xl px-4 py-3 border dark:border-white/10 focus:outline-none focus:ring focus:ring-orange-800 focus:ring-opacity-50 transition"
                />
            </div>

            {/* FAQs */}
            <div className="relative pb-10">
                <div className=" faq-container max-w-4xl mx-auto  overflow-auto h-120  pt-16">
                <ProgressiveBlur height="10%" position="bottom" className="  mb-6" />
                    <div className=" flex flex-col gap-3">
                        {visibleFaqs.map((item, index) => {
                            const isOpen = openIndex === index;
                            return (
                                <div
                                    key={index}
                                    ref={(el) => (faqRefs.current[index] = el)}
                                    className="flex flex-col rounded-xl bg-[#1E1E1E] dark:bg-[#0f0f0f]/80 px-4 border border-white/10 dark:text-white transition-all duration-300 hover:border-orange-500 hover:shadow-2xl hover:shadow-orange-800/20"
                                >
                                    <div
                                        className="flex justify-between items-center cursor-pointer py-4"
                                        onClick={() => toggleIndex(index)}
                                    >
                                        <p className="text-base font-medium text-white">
                                            {highlightText(item.q)}
                                        </p>
                                        <ChevronDown
                                            className={`text-white transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                                        />
                                    </div>
                                    <div
                                        className={`overflow-hidden text-gray-400 text-sm font-normal transition-all duration-300 ${isOpen ? "max-h-96 py-2" : "max-h-0"
                                            }`}
                                    >
                                        <p>{highlightText(item.a)}</p>
                                    </div>
                                </div>
                            );
                        })}

                        {filteredFaqs.length === 0 && (
                            <p className="text-gray-400 text-center mt-4">No results found.</p>
                        )}

                        
                        <ProgressiveBlur height="10%" position="top" className=" mb-10" />
                    </div>
                </div>
                {/* Show More / Show Less Button */}
                {filteredFaqs.length > 5 && (
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="absolute bottom-0 right-40 mt-4 flex flex-row cursor-pointer group hover:text-orange-600 hover:underline hover:underline-offset-8 decoration-2 text-gray-500 font-semibold text-sm hover:scale-105 hover:-translate-x-1 active:scale-95 self-end transition-all"
                        >
                        {showAll ? "Show Less..." : "Show More..."}
                        <ArrowUpRight className="group-hover:translate-x-1 text-orange-800 opacity-0 group-hover:opacity-100 transition-all ml-1" />
                    </button>
                )}
            </div>

            {/* Contact Support */}
            <div className="relative mt-4 text-center">
                <TextAnimate animation="fadeIn" by="word" className="text-2xl font-bold text-[#0f0f0f] dark:text-white">Can't find your answer?</TextAnimate>
                <TextAnimate animation="fadeIn" by="word" className="text-gray-500 mt-2">Our support team is here to help you.</TextAnimate>
                <Link to="/contact" className="mt-6 flex min-w-[84px] max-w-[480px] mx-auto items-center justify-center h-12 px-6 rounded-lg hover:bg-orange-700 active:scale-95 bg-orange-600 cursor-pointer text-white text-base font-bold tracking-[0.015em] transition-all hover:scale-105">
                    Contact Support
                </Link>
            </div>
        </main>
    );
};

export default FaqSection;
