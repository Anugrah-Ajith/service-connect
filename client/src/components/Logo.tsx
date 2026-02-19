import React from 'react';

interface LogoProps {
    className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-8 w-8" }) => {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" className="text-primary-600" fill="white" />
            <path
                d="M35 35 L65 35 L65 45 L45 45 L45 55 L65 55 L65 65 L35 65 L35 55 L55 55 L55 45 L35 45 Z"
                fill="currentColor"
                className="text-primary-600"
            />
            <circle cx="70" cy="30" r="10" fill="currentColor" className="text-primary-500" />
        </svg>
    );
};

export const LogoText: React.FC = () => (
    <div className="flex items-center gap-2">
        <Logo className="h-10 w-10 text-primary-600" />
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
            Service Connect
        </span>
    </div>
);
