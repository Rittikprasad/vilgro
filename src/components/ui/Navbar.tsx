import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import logo from "../../assets/logo.png"
import { logoutUser } from '../../features/auth/authThunks'
import type { RootState } from '../../app/store'

/**
 * Dynamic Navbar component for authenticated users
 * Features user info display and logout functionality
 */
const Navbar: React.FC = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user, isLoading } = useSelector((state: RootState) => state.auth)

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser() as any)
            // Redirect to login page after successful logout
            navigate('/login')
        } catch (error) {
            console.error('Logout error:', error)
            // Even if logout fails, redirect to login
            navigate('/login')
        }
    }

    const handleProfileClick = () => {
        // TODO: Navigate to profile page when implemented
        console.log('Profile clicked')
    }

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between py-4 max-w-screen-xl mx-auto px-4">
                {/* Logo */}
                <div className="flex items-center">
                    <img src={logo} alt="Vilgro" className="object-contain w-28" />
                </div>

                {/* Right Actions */}
                <div className="flex items-center space-x-2">
                    {/* User Profile Button */}
                    <button
                        onClick={handleProfileClick}
                        className="flex items-center px-3 py-2 text-md text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <div className="w-7 h-7 mr-2 rounded-full" style={{ background: 'linear-gradient(92deg, #46B753 0.02%, #E0DC32 100.02%)' }}>
                            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="hidden sm:inline">
                            {user?.first_name && user?.last_name
                                ? `${user.first_name} ${user.last_name}`.trim()
                                : user?.email || 'View Profile'
                            }
                        </span>
                        <span className="sm:hidden">Profile</span>
                    </button>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        disabled={isLoading}
                        className="px-6 py-2 text-sm text-black rounded-md transition-opacity hover:opacity-90 disabled:opacity-50"
                        style={{ background: 'linear-gradient(92deg, #46B753 0.02%, #E0DC32 100.02%)' }}
                    >
                        {isLoading ? 'Logging out...' : 'Log out'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Navbar