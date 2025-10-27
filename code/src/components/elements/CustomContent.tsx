import React from 'react'

interface CustomContentProps {
  text?: string
  isSmall?: boolean
}

const smallHeight = `w-5/6 sm:w-1/2 h-24 sm:h-16`
const largeHeight = `w-5/6 sm:w-1/2 h-84 sm:h-56`

const CustomContent: React.FC<CustomContentProps> = ({
  text = '',
  isSmall = true,
}) => {
  return (
    <div className={`${isSmall ? smallHeight : largeHeight} my-2`}>
      <p
        className={`w-full h-full whitespace-pre-wrap break-words p-2 sm:p-3 bg-amber-100 text-charcoal rounded-lg font-mono overflow-auto text-left text-sm sm:text-base md:text-lg`}
      >
        {text || ''}
      </p>
    </div>
  )
}

export default CustomContent
