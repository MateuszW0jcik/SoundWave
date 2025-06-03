import React from 'react';
import {useTranslations} from "../contexts/LanguageContext.jsx";

const BrandFilter = ({ expanded, toggleFilter, brands, selectedBrandIds, updateFilters }) => {
    const t = useTranslations();

    const handleBrandChange = (brandId) => {
        const current = selectedBrandIds || [];
        let updated;

        if (current.includes(brandId)) {
            updated = current.filter(id => id !== brandId);
        } else {
            updated = [...current, brandId];
        }

        if (updated.length === 0) {
            updateFilters('brandId', null);
        } else {
            updateFilters('brandId', updated.join(','));
        }
    };

    return (
        <>
            <div
                className="flex justify-between items-center py-2 mt-2 cursor-pointer select-none"
                onClick={toggleFilter}
            >
                <span className="font-medium text-sm">{t.brand}</span>
                <i className={`border-solid border-black border-r-2 border-b-2 p-1 inline-block ${expanded ? 'rotate-[-135deg]' : 'rotate-45'} transition-transform`}></i>
            </div>
            {expanded && (
                <div className="flex flex-col gap-3 py-2">
                    {brands.map((brand) => (
                        <label key={brand.id} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4 cursor-pointer"
                                checked={selectedBrandIds.includes(brand.id)}
                                onChange={() => handleBrandChange(brand.id)}
                            />
                            <span className="text-sm text-gray-800 flex-grow">{brand.name}</span>
                            {/*<span className="text-xs text-gray-500 select-none">({brand.productCount || 0})</span>*/}
                        </label>
                    ))}
                </div>
            )}
        </>
    );
};

export default BrandFilter;