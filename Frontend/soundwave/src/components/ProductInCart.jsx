import React, {useEffect, useState} from 'react';
import {Trash2} from 'lucide-react';
import {Link} from 'react-router-dom';
import productService from "../services/productService.js";

const ProductInCart = ({shoppingCartItem, onRemove}) => {
    const [imageURL, setImageURL] = useState(null);
    useEffect(() => {
        let url = null;

        const fetchImage = async () => {
            try {
                const imageBlob = await productService.getProductImage(shoppingCartItem.product.id);
                url = URL.createObjectURL(imageBlob);
                setImageURL(url);

                return () => URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Error fetching product image:', error);
            }
        };

        if (shoppingCartItem?.product.id) {
            fetchImage();
        }
        return () => {
            if (url) {
                URL.revokeObjectURL(url);
            }
        };
    }, [shoppingCartItem?.product.id]);

    return (
        <div
            className="relative flex p-4 border border-gray-200 rounded-lg transition-all duration-300 mb-2.5 cursor-pointer hover:transform hover:-translate-y-1 hover:shadow-lg">
            <Link to={`/products/view/?id=${shoppingCartItem?.product.id}`}
                  className="flex items-center flex-grow">
                <img
                    src={imageURL || 'https://dummyimage.com/130x130/ffffff/000000.png&text=Loading...'}
                    alt={shoppingCartItem?.product.name}
                    className="w-32 h-32 object-contain bg-transparent mr-4 select-none"
                />
                <div className="flex-1">
                    <p className="font-semibold text-sm">{shoppingCartItem?.product.name}</p>
                    <p className="text-sm text-gray-600">Qty: {shoppingCartItem?.quantity}</p>
                    <p className="text-sm font-medium">${shoppingCartItem?.product.price.toFixed(2)}</p>
                </div>
            </Link>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                }}
                className="absolute bottom-2 right-2 p-2 hover:scale-105 transition-transform bg-none border-none rounded cursor-pointer">
                <Trash2 className="w-5 h-5 text-red-500"/>
            </button>
        </div>
    );
};

export default ProductInCart;