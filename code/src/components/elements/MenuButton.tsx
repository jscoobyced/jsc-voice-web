import React from 'react'

interface MenuButtonProps {
  children: React.ReactNode
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>
  disabled?: boolean
  className?: string
  role?: string
  type?: 'button' | 'submit' | 'reset'
}

const MenuButton: React.FC<MenuButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = '',
  role,
  type = 'button',
}) => {
  const base =
    'w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

  return (
    <button
      type={type}
      role={role}
      className={`${base} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default MenuButton
