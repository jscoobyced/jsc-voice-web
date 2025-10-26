import React, { useState } from 'react'
import MenuButton from './MenuButton'

interface HamburgerMenuProps {
  onNavigate?: (route: string) => void
  className?: string
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  onNavigate,
  className = '',
}) => {
  const [open, setOpen] = useState(false)
  const [signedIn, setSignedIn] = useState(false)

  const navigate = (route: string) => {
    setOpen(false)
    if (route === 'auth') {
      setSignedIn((s) => !s)
    }
    onNavigate?.(route)
  }

  return (
    <div className={`fixed top-5 right-5 text-left z-50 ${className}`}>
      <MenuButton
        role="button"
        onClick={() => setOpen((v) => !v)}
        className="w-auto p-2 bg-slate-300 text-gray-800 border-2 border-white rounded-xl focus:outline-none focus:ring-2 focus:ring-white shadow-sm"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </MenuButton>

      {open && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="origin-top-right absolute right-0 mt-2 w-44 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50"
        >
          <div className="py-1">
            <MenuButton role="menuitem" onClick={() => navigate('play')}>
              Play
            </MenuButton>

            <MenuButton role="menuitem" onClick={() => navigate('howto')}>
              How to use
            </MenuButton>

            <div className="border-t border-slate-500 my-1" />

            <MenuButton role="menuitem" onClick={() => navigate('auth')}>
              {signedIn ? 'Sign-off' : 'Sign-in'}
            </MenuButton>
          </div>
        </div>
      )}
    </div>
  )
}

export default HamburgerMenu
