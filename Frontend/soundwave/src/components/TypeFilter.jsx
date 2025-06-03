import React from 'react';
import {useTranslations} from "../contexts/LanguageContext.jsx";

const TypeFilter = ({ expanded, toggleFilter, types, selectedTypeIds, updateFilters }) => {
    const t = useTranslations();

    // Handle type checkbox change
    const handleTypeChange = (typeId) => {
        const current = selectedTypeIds || [];
        let updated;

        if (current.includes(typeId)) {
            updated = current.filter(id => id !== typeId);
        } else {
            updated = [...current, typeId];
        }

        if (updated.length === 0) {
            updateFilters('typeId', null);
        } else {
            updateFilters('typeId', updated.join(','));
        }
    };

    return (
        <>
            <div
                className="flex justify-between items-center py-2 mt-2 cursor-pointer select-none"
                onClick={toggleFilter}
            >
                <span className="font-medium text-sm">{t.type}</span>
                <i className={`border-solid border-black border-r-2 border-b-2 p-1 inline-block ${expanded ? 'rotate-[-135deg]' : 'rotate-45'} transition-transform`}></i>
            </div>
            {expanded && (
                <div className="flex flex-col gap-3 py-2">
                    {types.map((type) => (
                        <label key={type.id} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4 cursor-pointer"
                                checked={selectedTypeIds.includes(type.id)}
                                onChange={() => handleTypeChange(type.id)}
                            />
                            <span className="text-sm text-gray-800 flex-grow">{type.name}</span>
                            {/*<span className="text-xs text-gray-500 select-none">({type.productCount || 0})</span>*/}
                        </label>
                    ))}
                </div>
            )}
        </>
    );
};

export default TypeFilter;