import React, {useState} from 'react';
import messageService from "../../services/messageService.js";
import {useTranslations} from "../../contexts/LanguageContext.jsx";

const AccountContact = () => {
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const t = useTranslations();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!message.trim()) {
            setSubmitStatus({ type: 'error', message: t.messageRequired });
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            await messageService.createMessage({ content: message.trim() });

            setSubmitStatus({ type: 'success', message: t.messageSentSuccessfully });
            setMessage('');
        } catch (error) {
            console.log(error);
            setSubmitStatus({ type: 'error', message: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
        if (submitStatus) {
            setSubmitStatus(null);
        }
    };

    return (
        <div className="w-full max-w-6xl p-5 font-sans">
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{t.contactUs}</h3>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-5" onSubmit={handleSubmit}>
                <div className="mb-5 w-full max-w-md flex flex-col">
                    <div className="mb-8">
                        <p className="text-sm text-gray-600 m-0">
                            {t.contactUsDescription}
                        </p>
                    </div>
                </div>

                <div className="mb-5 w-full max-w-md flex flex-col">
                    <label className="text-xs text-gray-600 mb-2" htmlFor="message">
                        {t.message}
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        rows="5"
                        maxLength="1000"
                        required
                        value={message}
                        onChange={handleMessageChange}
                        className={`p-3 border border-gray-300 rounded mb-4 text-sm resize-none min-h-48 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            message.trim() ? 'border-l-4 border-l-blue-500' : ''
                        }`}
                        placeholder={t.messagePlaceholder}
                        disabled={isSubmitting}
                    />

                    {submitStatus && (
                        <div className={`mb-4 p-3 rounded text-sm ${
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

                    <div className="mt-2 text-xs text-gray-500">
                        {message.length}/1000 {t.characters}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AccountContact;