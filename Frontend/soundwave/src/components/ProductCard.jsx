import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import productService from "../services/productService.js";
import {useTranslations} from "../contexts/LanguageContext.jsx";


const ProductCard = ({product, onAddToCart}) => {
    const [imageURL, setImageURL] = useState(null);
    const t = useTranslations();

    useEffect(() => {
        let url = null;

        const fetchImage = async () => {
            try {
                const imageBlob = await productService.getProductImage(product.id);
                url = URL.createObjectURL(imageBlob);
                setImageURL(url);

                return () => URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Error fetching product image:', error);
            }
        };

        if (product?.id) {
            fetchImage();
        }
        return () => {
            if (url) {
                URL.revokeObjectURL(url);
            }
        };
    }, [product.id]);

    const handleAddToCart = (e) => {
        e.stopPropagation();
        onAddToCart(product.id);
    };

    return (
        <article
            className="w-full h-93 p-4 border border-gray-200 rounded-lg transition-all duration-300 flex flex-col cursor-pointer hover:transform hover:-translate-y-1 hover:shadow-lg"
        >
            <Link to={`/products/view/?id=${product.id}`}>
                <img
                    src={imageURL || `https://dummyimage.com/280x200/ffffff/000000.png&text=${t.loading}`}
                    alt={product.name}
                    className="w-full h-48 object-contain mb-2 select-none"
                    loading="lazy"
                    width="280"
                    height="200"
                />
                <h3 className="font-bold text-black my-2 flex-grow overflow-hidden"
                    style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        height: '48px'
                    }}>
                    {product.name}
                </h3>
                <div className="font-bold text-black mb-2">
                    ${product.price.toFixed(2)}
                </div>
            </Link>
            <button
                className="w-full text-white border-none py-2 px-4 rounded cursor-pointer transition-colors duration-300"
                style={{backgroundColor: '#333'}}
                onClick={handleAddToCart}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#000'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#333'}
            >
                {t.addToCart}
            </button>
        </article>
    );
};

export default ProductCard;