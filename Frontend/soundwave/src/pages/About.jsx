import React from 'react';
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import {Link} from "react-router-dom";
import aboutUsBanner from "../assets/banners/about_us.png";
import {useTranslations} from "../contexts/LanguageContext.jsx";

const About = () => {
    const t = useTranslations();

    return (
        <>
            <Header/>

            <section className="w-full max-w-7xl mx-auto px-4">
                <div className="flex items-center text-sm mb-5 mt-5 flex-wrap">
                    <Link to="/" className="text-gray-500 hover:text-gray-700">
                        {t.home} &gt;
                    </Link>
                    <span className="text-blue-500 font-bold ml-1">{t.aboutUs}</span>
                </div>

                <div className="flex flex-col items-center gap-8 mb-10">
                    <div className="w-full max-w-screen-xl px-5">
                        <img
                            className="w-full object-cover rounded-lg"
                            src={aboutUsBanner}
                            alt={t.aboutUsBannerAlt}
                        />
                    </div>

                    <div className="w-full max-w-6xl px-4 text-gray-700">
                        <p className="text-base leading-relaxed mb-6">
                            <span className="font-semibold text-gray-800">SoundWave</span> {t.aboutUsDescriptionPart1}
                            <span className="italic"> “Experience Sound Like Never Before,”</span> {t.aboutUsDescriptionPart2}
                        </p>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-8">{t.soundWaveMeaningTitle}</h3>
                        <p className="text-base leading-relaxed mb-6">
                            The name <span className="font-semibold">"SoundWave"</span> {t.soundWaveMeaningDescription}
                        </p>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-8">{t.impressiveFeaturesTitle}</h3>

                        <ul className="list-disc list-inside space-y-3 text-base leading-relaxed">
                            <li>
                                <span className="font-semibold">{t.feature1.split(':')[0]}:</span> {t.feature1.split(':')[1]}
                            </li>
                            <li>
                                <span className="font-semibold">{t.feature2.split(':')[0]}:</span> {t.feature2.split(':')[1]}
                            </li>
                            <li>
                                <span className="font-semibold">{t.feature3.split(':')[0]}:</span> {t.feature3.split(':')[1]}
                            </li>
                            <li>
                                <span className="font-semibold">{t.feature4.split(':')[0]}:</span> {t.feature4.split(':')[1]}
                            </li>
                            <li>
                                <span className="font-semibold">{t.feature5.split(':')[0]}:</span> {t.feature5.split(':')[1]}
                            </li>
                            <li>
                                <span className="font-semibold">{t.feature6.split(':')[0]}:</span> {t.feature6.split(':')[1]}
                            </li>
                        </ul>
                    </div>

                </div>
            </section>

            <Footer/>
        </>
    );
};

export default About;