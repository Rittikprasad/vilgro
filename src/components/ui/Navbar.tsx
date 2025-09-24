import React from 'react'
import logo from "../../assets/logo.png"

/**
 * Reusable Navbar component for signup steps
 * Features brand gradient styling and proper spacing
 */
const Navbar: React.FC = () => {
    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between py-4 max-w-screen-xl mx-auto">
                {/* Logo */}
                <div className="flex items-center">
                    <img src={logo} alt="Vilgro" className="object-contain w-28" />
                </div>

                {/* Right Actions */}
                <div className="flex items-center space-x-2">
                    <button className="flex items-center px-3 py-2 text-md text-gray-600 hover:text-gray-800">

                        <div className="w-7 h-7 mr-2 rounded-full" style={{ background: 'linear-gradient(92deg, #46B753 0.02%, #E0DC32 100.02%)' }}>
                            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                        View Profile
                    </button>
                    <button className="px-6 py-2 text-sm text-white rounded-md" style={{ background: 'linear-gradient(92deg, #46B753 0.02%, #E0DC32 100.02%)' }}>
                        Log out
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Navbar