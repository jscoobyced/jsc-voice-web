import React from 'react'

interface TitleProps {
  title: string
}

const Title: React.FC<TitleProps> = (props: TitleProps) => {
  return <h1>{props.title}</h1>
}

export default Title
