import React from 'react'

interface CustomContentProps {
  text?: string
  isSmall?: boolean
}

const smallHeight = `h-32 md:h-24 sm:h-16`
const largeHeight = `h-84 md:h-72 sm:h-56`

const CustomContent: React.FC<CustomContentProps> = ({
  text = '',
  isSmall = true,
}) => {
  return (
    <div
      className={`${isSmall ? smallHeight : largeHeight} w-5/6 md:w-1/2 my-2`}
    >
      <p
        className={`w-full h-full whitespace-pre-wrap break-words p-2 sm:p-3 bg-amber-100 text-charcoal rounded-lg font-mono overflow-auto text-left text-sm sm:text-base md:text-lg`}
      >
        {text || ''}
      </p>
    </div>
  )
}

export default CustomContent
