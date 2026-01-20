'use client';

import { useState, useRef, useEffect } from 'react';
import { FlagIcon } from 'react-flag-kit';

// Common countries list
const COUNTRIES = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'SE', name: 'Sweden' },
    { code: 'NO', name: 'Norway' },
    { code: 'DK', name: 'Denmark' },
    { code: 'FI', name: 'Finland' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'BE', name: 'Belgium' },
    { code: 'AT', name: 'Austria' },
    { code: 'IE', name: 'Ireland' },
    { code: 'NZ', name: 'New Zealand' },
    { code: 'SG', name: 'Singapore' },
    { code: 'JP', name: 'Japan' },
    { code: 'KR', name: 'South Korea' },
    { code: 'CN', name: 'China' },
    { code: 'IN', name: 'India' },
    { code: 'BR', name: 'Brazil' },
    { code: 'MX', name: 'Mexico' },
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'SA', name: 'Saudi Arabia' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'ID', name: 'Indonesia' },
    { code: 'MY', name: 'Malaysia' },
    { code: 'TH', name: 'Thailand' },
    { code: 'VN', name: 'Vietnam' },
    { code: 'PH', name: 'Philippines' },
];

interface CountrySelectProps {
    value: string;
    onChange: (value: string) => void;
}

export default function CountrySelect({ value, onChange }: CountrySelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedCountry = COUNTRIES.find(c => c.code === value);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-[450] text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-left flex items-center"
            >
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                    {selectedCountry ? (
                        <FlagIcon code={selectedCountry.code as any} size={18} />
                    ) : (
                        <i className="ph-fill ph-flag text-slate-400 text-lg"></i>
                    )}
                </div>
                <span className={`block truncate ${!selectedCountry ? 'text-slate-500' : ''}`}>
                    {selectedCountry ? selectedCountry.name : 'Select Country'}
                </span>
                <i className="ph-bold ph-caret-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-1 w-full max-h-60 overflow-auto bg-white rounded-lg border border-slate-200 shadow-lg py-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                    {COUNTRIES.map((country) => (
                        <button
                            key={country.code}
                            type="button"
                            className={`w-full px-4 py-2 text-sm text-left flex items-center gap-3 hover:bg-slate-50 transition-colors ${
                                country.code === value ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-700'
                            }`}
                            onClick={() => {
                                onChange(country.code);
                                setIsOpen(false);
                            }}
                        >
                            <FlagIcon code={country.code as any} size={18} />
                            <span className="truncate">{country.name}</span>
                            {country.code === value && (
                                <i className="ph-bold ph-check ml-auto text-indigo-600"></i>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
