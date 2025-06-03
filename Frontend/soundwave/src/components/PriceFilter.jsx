import { useState, useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import {useTranslations} from "../contexts/LanguageContext.jsx";

const PriceFilter = ({ expanded, toggleFilter, minPrice, maxPrice, priceRange, updateFilters }) => {
    const [localPriceRange, setLocalPriceRange] = useState([minPrice, maxPrice]);
    const t = useTranslations();

    useEffect(() => {
        setLocalPriceRange([minPrice, maxPrice]);
    }, [minPrice, maxPrice]);

    const handleRangeChange = (values) => {
        setLocalPriceRange(values);
    };

    const applyPriceFilter = () => {
        updateFilters(localPriceRange[0].toString(), localPriceRange[1].toString());
    };

    return (
        <>
            <div
                className="flex justify-between items-center py-2 mt-2 cursor-pointer select-none"
                onClick={toggleFilter}
            >
                <span className="font-medium text-sm">{t.price}</span>
                <i className={`border-solid border-black border-r-2 border-b-2 p-1 inline-block ${expanded ? 'rotate-[-135deg]' : 'rotate-45'} transition-transform`}></i>
            </div>
            {expanded && (
                <div>
                    <div className="flex gap-2 mb-4">
                        <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder={t.min}
                            value={localPriceRange[0]}
                            onChange={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                setLocalPriceRange([value, localPriceRange[1]]);
                            }}
                            onBlur={applyPriceFilter}
                        />
                        <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            placeholder={t.max}
                            value={localPriceRange[1]}
                            onChange={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                setLocalPriceRange([localPriceRange[0], value]);
                            }}
                            onBlur={applyPriceFilter}
                        />
                    </div>
                    <div className="py-4 px-1">
                        <Slider
                            range
                            min={priceRange.min}
                            max={priceRange.max}
                            value={localPriceRange}
                            onChange={handleRangeChange}
                            onAfterChange={applyPriceFilter}
                            trackStyle={[{ backgroundColor: '#3b82f6' }]}
                            railStyle={{ backgroundColor: '#e5e7eb', height: 4 }}
                            handleStyle={[
                                {
                                    backgroundColor: 'white',
                                    borderColor: '#ccc',
                                    height: 20,
                                    width: 20,
                                    marginTop: -8,
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                                },
                                {
                                    backgroundColor: 'white',
                                    borderColor: '#ccc',
                                    height: 20,
                                    width: 20,
                                    marginTop: -8,
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                                }
                            ]}
                            pushable={10}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default PriceFilter;