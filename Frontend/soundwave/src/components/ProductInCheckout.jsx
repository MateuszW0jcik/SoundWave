import React, {useState, useEffect} from 'react';
import productService from "../services/productService.js";

const ProductInCheckout = ({
                               item,
                               loading
                           }) => {
    const [imageURL, setImageURL] = useState(null);

    useEffect(() => {
        let url = null;

        const fetchImage = async () => {
            try {
                const imageBlob = await productService.getProductImage(item.product.id);
                url = URL.createObjectURL(imageBlob);
                setImageURL(url);

                return () => URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Error fetching product image:', error);
            }
        };

        if (item?.product.id) {
            fetchImage();
        }

        return () => {
            if (url) {
                URL.revokeObjectURL(url);
            }
        };
    }, [item?.product.id]);

    return (
        <div
            className={`relative flex items-center justify-between p-4 rounded-lg border border-gray-200 mb-3 transition-all`}
        >
            <div className="flex items-center w-full">
                <div className="relative mr-16">
                    <img
                        src={imageURL || 'https://dummyimage.com/130x130/ffffff/000000.png&text=Loading...'}
                        alt="Product image"
                        className="w-24 h-24 object-contain bg-transparent select-none mx-4"
                    />
                    {loading && (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col justify-between w-full">
                    <p className="text-base font-bold m-0 mb-4">{item?.product.name}</p>
                    <div className="flex justify-between items-center w-full">
                        <p className="text-sm m-0">Qty: {item?.quantity}</p>
                        <p className="text-sm m-0">${item?.product.price.toFixed(2)}</p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ProductInCheckout;