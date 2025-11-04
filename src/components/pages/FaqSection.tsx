"use client";

import { useState, useRef } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { TextAnimate } from "../ui/text-animate";
import { ProgressiveBlur } from "../ui/progressive-blur";

interface FaqItem {
    q: string;
    a: string;
}

const faqData: FaqItem[] = [
    { q: "What file types are supported for conversion?", a: "We support JPEG, PNG, WEBP, GIF, TIFF, and more. We update formats regularly." },
    { q: "How does image compression work?", a: "Our algorithm reduces file size by analyzing redundant data and applying optimal lossy or lossless compression." },
    { q: "Can I edit images before conversion?", a: "Yes, basic edits like cropping, resizing, and format changes are supported before conversion." },
    { q: "Is there a limit on file size?", a: "Free plan allows up to 10MB, Pro and Business have higher limits depending on plan." },
    { q: "Can I use the toolkit offline?", a: "No, our toolkit works online to leverage AI processing and cloud storage." },
    { q: "Are images watermarked?", a: "No, images are returned without watermarks for all plans." },
    { q: "Do I need an account to use the free plan?", a: "Yes, a free account is required to save progress and access free features." },
    { q: "How fast is the processing?", a: "Processing depends on file size; small images take a few seconds, larger files may take longer." },
    { q: "Are animated GIFs supported?", a: "Yes, you can compress and convert GIFs without losing animation frames." },
    { q: "Can I revert changes after compression?", a: "No, always download a copy before compressing as original data cannot be restored." },
    { q: "What features are available in the free plan?", a: "Limited conversions, basic compression, standard upscaling." },
    { q: "Does Pro plan support batch processing?", a: "Yes, Pro plan includes batch processing for multiple images at once." },
    { q: "Can I use AI-powered upscaling?", a: "Yes, AI upscaling is available in Pro and Business plans." },
    { q: "Is there API access for developers?", a: "API access is available for Business plan to integrate with your apps." },
    { q: "Can I track my conversion history?", a: "Yes, all plans allow you to see your conversion history in your account dashboard." },
    { q: "Are there advanced compression settings?", a: "Yes, Pro and Business plans have adjustable compression levels for fine control." },
    { q: "Can I preview images before downloading?", a: "Yes, preview is available for all plans before final download." },
    { q: "Is there a mobile-friendly interface?", a: "Absolutely, our toolkit is fully responsive on all devices." },
    { q: "Can I rename files during download?", a: "Yes, renaming files before download is supported." },
    { q: "Do features differ for yearly vs monthly billing?", a: "Features are the same; yearly billing provides a discount on the price." },
    {q: "Scroll Up! No card below", a: "test"}
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
                <TextAnimate animation="blurInUp" by="text" className="text-[#0f0f0f] dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
                    How can we help?
                </TextAnimate>
                <TextAnimate animation="blurInUp" by="word" className="text-gray-600 dark:text-gray-400 text-base md:text-lg mt-3 max-w-2xl">
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
            <div className="mt-4 text-center">
                <TextAnimate animation="blurInUp" by="text" className="text-2xl font-bold text-[#0f0f0f] dark:text-white">Can't find your answer?</TextAnimate>
                <TextAnimate animation="blurInUp" by="word" className="text-gray-500 mt-2">Our support team is here to help you.</TextAnimate>
                <button className="mt-6 flex min-w-[84px] max-w-[480px] mx-auto items-center justify-center h-12 px-6 rounded-lg hover:bg-orange-700 active:scale-95 bg-orange-600 cursor-pointer text-white text-base font-bold tracking-[0.015em] transition-all hover:scale-105">
                    Contact Support
                </button>
            </div>
        </main>
    );
};

export default FaqSection;
