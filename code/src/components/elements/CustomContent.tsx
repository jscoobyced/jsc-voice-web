import React from 'react'

interface CustomContentProps {
  text?: string
  className?: string
}

const CustomContent: React.FC<CustomContentProps> = ({
  text = '',
  className = '',
}) => {
  return (
    <div className={`w-1/2 m-3 ${className}`}>
      <pre className="whitespace-pre-wrap bg-cyan-950 p-5 border-1 border-white rounded-lg font-mono overflow-auto text-left">
        {text || ''}
      </pre>
    </div>
  )
}

export default CustomContent
