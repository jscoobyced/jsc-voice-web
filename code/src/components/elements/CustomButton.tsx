import React from 'react'

interface CustomButtonProps {
  children: React.ReactNode
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
}) => {
  const base =
    'px-6 py-3 m-5 bg-slate-300 text-gray-800 border-2 border-white rounded-xl font-bold hover:bg-slate-400 focus:outline-none focus:ring-2 focus:ring-white transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed'

  return (
    <button
      type={type}
      className={`${base} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default CustomButton
