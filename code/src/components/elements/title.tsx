import React from 'react'

interface TitleProps {
  title: string
}

const Title: React.FC<TitleProps> = (props: TitleProps) => {
  return (
    <h1 className="mt-8 mb-6 text-3xl sm:text-4xl font-bold text-center">
      {props.title}
    </h1>
  )
}

export default Title
