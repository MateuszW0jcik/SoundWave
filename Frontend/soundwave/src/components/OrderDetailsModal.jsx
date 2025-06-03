import React, {useState} from 'react';
import {X, ShoppingBag, MapPin} from 'lucide-react';
import {useTranslations} from "../contexts/LanguageContext.jsx";

const OrderDetailsModal = ({isOpen, onClose, orderDetails, loading}) => {
    const t = useTranslations();

    if (!isOpen) return null;

    const [clickedOnOverlay, setClickedOnOverlay] = useState(false);

    const handleMouseDown = (e) => {
        if (e.target === e.currentTarget) {
            setClickedOnOverlay(true);
        } else {
            setClickedOnOverlay(false);
        }
    };

    const handleMouseUp = (e) => {
        if (clickedOnOverlay && e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
             onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
            <div className="bg-white rounded-lg w-full max-w-2xl mx-4 shadow-2xl max-h-[90vh] flex flex-col">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">{t.orderDetails}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                        <X size={20} className="text-gray-600 cursor-pointer"/>
                    </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : orderDetails ? (
                        <div className="space-y-6">
                            {/* Delivery Address */}
                            <div>
                                <div className="flex items-center mb-3">
                                    <MapPin size={18} className="text-gray-600 mr-2"/>
                                    <h3 className="text-lg font-medium text-gray-900">{t.deliveryAddress}</h3>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-800">
                                        {orderDetails.street} {orderDetails.streetNumber}
                                    </p>
                                    <p className="text-gray-800">
                                        {orderDetails.postalCode} {orderDetails.city}
                                    </p>
                                    <p className="text-gray-800">{orderDetails.country}</p>
                                </div>
                            </div>

                            {/* Ordered Items */}
                            <div>
                                <div className="flex items-center mb-4">
                                    <ShoppingBag size={18} className="text-gray-600 mr-2"/>
                                    <h3 className="text-lg font-medium text-gray-900">{t.orderedItems}</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {orderDetails.orderedItemDTOs.map((item, index) => (
                                        <article
                                            key={index}
                                            className="w-full h-40 p-4 border border-gray-200 rounded-lg transition-all duration-300 flex flex-col cursor-pointer hover:transform hover:-translate-y-1 hover:shadow-lg"
                                        >
                                            {/*<img*/}
                                            {/* src={item.imageURL}*/}
                                            {/* alt={item.productName}*/}
                                            {/* className="w-full h-48 object-contain mb-2 select-none"*/}
                                            {/* loading="lazy"*/}
                                            {/* width="280"*/}
                                            {/* height="200"*/}
                                            {/*/>*/}
                                            <h3 className="font-bold text-black my-2 flex-grow overflow-hidden">
                                                {item.productName}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-3">{item.brandName}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold text-gray-900">
                                                  ${item.price.toFixed(2)}
                                                </span>
                                                <span className="text-sm text-gray-600">
                                                  {t.qty}: {item.quantity}
                                                </span>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500">
                            {t.noOrderDetails}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;