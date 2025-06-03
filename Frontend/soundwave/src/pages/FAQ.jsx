import React from 'react';
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import faqBanner from "../assets/banners/FAQ.png";
import {Link} from "react-router-dom";
import {useTranslations} from "../contexts/LanguageContext.jsx"; // Adjust the path as needed

const Faq = () => {
    const t = useTranslations(); // Initialize useTranslations hook

    // The faqData is now directly accessed from the translation file
    const faqData = t.faqData;

    return (
        <>
            <Header/>

            <section className="w-full max-w-7xl mx-auto px-4">
                <div className="flex items-center text-sm mb-5 mt-5 flex-wrap">
                    <Link to="/" className="text-gray-500 hover:text-gray-700">
                        {t.home} &gt;
                    </Link>
                    <span className="text-blue-500 font-bold ml-1">{t.faq}</span>
                </div>

                <div className="flex flex-col items-center gap-8 mb-10">
                    <div className="w-full max-w-screen-xl px-5">
                        <img
                            className="w-full object-cover rounded-lg"
                            src={faqBanner}
                            alt={t.faqBannerAlt}
                        />
                    </div>

                    <div className="w-full max-w-3xl px-4">
                        {faqData.map((faq, index) => (
                            <div
                                key={index} // Use index as key since faq.id is no longer available directly
                                className={`pb-5 mb-8 ${index < faqData.length - 1 ? 'border-b border-gray-200' : ''}`}
                            >
                                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 leading-snug text-center">
                                    {faq.question}
                                </h3>
                                <p className="text-sm md:text-base text-gray-600 leading-relaxed text-center">
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer/>
        </>
    );
};

export default Faq;