import React from 'react';
import {useTranslations} from "../contexts/LanguageContext.jsx";

const ConnectionTypeFilter = ({ expanded, toggleFilter, selectedWireless, updateFilters }) => {
    const t = useTranslations();

    const handleWirelessChange = (wirelessValue) => {
        if (selectedWireless === wirelessValue.toString()) {
            updateFilters('wireless', null);
        } else {
            updateFilters('wireless', wirelessValue.toString());
        }
    };

    return (
        <>
            <div
                className="flex justify-between items-center py-2 mt-2 cursor-pointer select-none"
                onClick={toggleFilter}
            >
                <span className="font-medium text-sm">{t.connectionType}</span>
                <i className={`border-solid border-black border-r-2 border-b-2 p-1 inline-block ${expanded ? 'rotate-[-135deg]' : 'rotate-45'} transition-transform`}></i>
            </div>
            {expanded && (
                <div className="flex flex-col gap-3 py-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            className="w-4 h-4 cursor-pointer"
                            checked={selectedWireless === 'true'}
                            onChange={() => handleWirelessChange(true)}
                        />
                        <span className="text-sm text-gray-800 flex-grow">{t.wireless}</span>
                        {/*<span className="text-xs text-gray-500 select-none">(12)</span>*/}
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            className="w-4 h-4 cursor-pointer"
                            checked={selectedWireless === 'false'}
                            onChange={() => handleWirelessChange(false)}
                        />
                        <span className="text-sm text-gray-800 flex-grow">{t.wired}</span>
                        {/*<span className="text-xs text-gray-500 select-none">(18)</span>*/}
                    </label>
                </div>
            )}
        </>
    );
};

export default ConnectionTypeFilter;