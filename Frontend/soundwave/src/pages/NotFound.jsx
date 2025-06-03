import { Link } from 'react-router-dom';
import { useTranslations } from '../contexts/LanguageContext';

const NotFound = () => {
    const t = useTranslations();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-gray-200">404</h1>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">{t.pageNotFound}</h2>
                <p className="text-gray-600 mb-8 max-w-md">
                    {t.notFoundMessage}
                </p>
                <Link
                    to="/"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 hover:scale-105 transform"
                >
                    {t.returnToHome}
                </Link>
            </div>
        </div>
    );
};

export default NotFound;