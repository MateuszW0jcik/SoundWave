import React from 'react';
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import {Link} from "react-router-dom";
import {useTranslations} from "../contexts/LanguageContext.jsx";

const OurPromises = () => {
    const t = useTranslations();

    const promisesData = [
        {
            title: t.promise1Title,
            description: t.promise1Description
        },
        {
            title: t.promise2Title,
            description: t.promise2Description
        },
        {
            title: t.promise3Title,
            description: t.promise3Description
        },
        {
            title: t.promise4Title,
            description: t.promise4Description
        },
        {
            title: t.promise5Title,
            description: t.promise5Description
        },
    ];

    return (
        <>
            <Header/>

            <section className="w-full max-w-7xl mx-auto px-4 font-sans">
                {/* Breadcrumb */}
                <div className="flex items-center text-sm mb-5 mt-5 flex-wrap">
                    <Link to="/" className="text-gray-500 hover:text-gray-700">
                        {t.home} &gt;
                    </Link>
                    <span className="text-blue-500 font-bold ml-1">{t.ourPromises}</span>
                </div>

                {/* Content Section */}
                <div className="flex flex-col items-center gap-8 mb-10 text-gray-700">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-4">
                        {t.ourPromisesTitle}
                    </h1>
                    <p className="text-base leading-relaxed max-w-3xl text-center mb-6">
                        {t.ourPromisesDescription}
                    </p>

                    <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
                        {promisesData.map((promise, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    {promise.title}
                                </h3>
                                <p className="text-base leading-relaxed">
                                    {promise.description}
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

export default OurPromises;