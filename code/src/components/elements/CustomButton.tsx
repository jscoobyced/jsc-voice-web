import React from 'react'
import { randomColorPerLetter as randomColorPerWord } from '../../service/coloredText'

interface CustomButtonProps {
  children: string
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
    'px-6 py-3 m-5 font-irish-grover text-4xl focus:outline-none transition ease-in-out duration-200 transform shadow-sm rounded-full hover:scale-105 bg-amber-100'

  return (
    <button
      type={type}
      className={`${base} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {randomColorPerWord(children)}
    </button>
  )
}

export default CustomButton
