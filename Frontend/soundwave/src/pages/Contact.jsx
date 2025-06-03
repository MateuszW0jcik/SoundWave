import React, {useEffect, useState} from 'react';
import {MapPin, PhoneCall, Mail} from "lucide-react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import {Link, useNavigate} from "react-router-dom";
import messageService from "../services/messageService.js";
import {useAuth} from "../contexts/AuthContext.jsx";
import {useTranslations} from "../contexts/LanguageContext.jsx"; // Adjust the path as needed

const Contact = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const t = useTranslations(); // Initialize useTranslations hook

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/account/contact', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!message.trim()) {
            setSubmitStatus({ type: 'error', message: t.messageIsRequired });
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            await messageService.createMessage({
                content: message.trim(),
                name: name.trim(),
                email: email.trim()
            });

            setSubmitStatus({ type: 'success', message: t.messageSentSuccessfully });
            setMessage('');
        } catch (error) {
            console.log(error);
            setSubmitStatus({ type: 'error', message: error.errors.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
        // Clear status when user starts typing
        if (submitStatus) {
            setSubmitStatus(null);
        }
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
        // Clear status when user starts typing
        if (submitStatus) {
            setSubmitStatus(null);
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        // Clear status when user starts typing
        if (submitStatus) {
            setSubmitStatus(null);
        }
    };

    return (
        <>
            <Header/>

            <section className="w-full max-w-7xl mx-auto px-4 font-sans">
                {/* Breadcrumb */}
                <div className="flex items-center text-sm mb-5 mt-5 flex-wrap">
                    <Link to="/" className="text-gray-500 hover:text-gray-700">
                        {t.home} &gt;
                    </Link>
                    <span className="text-blue-500 font-bold ml-1">{t.contactUs}</span>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center m-10">
                    <div className="flex flex-col items-center gap-3">
                        <MapPin className="w-10 h-10 text-blue-600"/>
                        <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-1">{t.office}</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">123 Main Street,<br/>Anytown, USA</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                        <Mail className="w-10 h-10 text-blue-600"/>
                        <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-1">{t.emailModal}</h4>
                            <p className="text-sm text-gray-600">contact@SoundWave.com</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                        <PhoneCall className="w-10 h-10 text-blue-600"/>
                        <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-1">{t.phone}</h4>
                            <p className="text-sm text-gray-600">34 377 00 00</p>
                        </div>
                    </div>
                </div>

                {/* Message + Form Side by Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl p-5 mx-auto items-start">
                    {/* Left side: description */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{t.messageUs}</h3>
                        <p className="text-sm text-gray-600">
                            {t.messageUsDescription}
                        </p>
                    </div>

                    {/* Right side: full form */}
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <div className="flex flex-col">
                            <label htmlFor="name" className="text-xs text-gray-600 mb-1">{t.yourName}</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={name}
                                onChange={handleNameChange}
                                required
                                className="p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="email" className="text-xs text-gray-600 mb-1">{t.email}</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                required
                                className="p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="message" className="text-xs text-gray-600 mb-2">{t.message}</label>
                            <textarea
                                id="message"
                                name="message"
                                rows="5"
                                maxLength="1000"
                                required
                                value={message}
                                onChange={handleMessageChange}
                                placeholder={t.enterYourMessageHere}
                                disabled={isSubmitting}
                                className={`p-3 border border-gray-300 rounded mb-2 text-sm resize-none min-h-48 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    message.trim() ? 'border-l-4 border-l-blue-500' : ''
                                }`}
                            />
                            <div className="mt-1 text-xs text-gray-500">
                                {message.length}/1000 {t.characters}
                            </div>
                        </div>

                        {submitStatus && (
                            <div className={`p-3 rounded text-sm ${
                                submitStatus.type === 'success'
                                    ? 'bg-green-100 text-green-700 border border-green-300'
                                    : 'bg-red-100 text-red-700 border border-red-300'
                            }`}>
                                {submitStatus.message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting || !message.trim()}
                            className={`bg-blue-600 text-white border-none py-2.5 px-5 rounded cursor-pointer text-sm transition-transform duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                                isSubmitting ? 'opacity-50' : ''
                            }`}
                        >
                            {isSubmitting ? t.sending : t.submit}
                        </button>
                    </form>
                </div>
            </section>

            <Footer/>
        </>
    );
};

export default Contact;