const COLORS = [
  'text-red-500',
  'text-red-800',
  'text-blue-500',
  'text-green-500',
  'text-purple-500',
  'text-pink-500',
  'text-indigo-500',
  'text-orange-500',
  'text-orange-800',
  'text-purple-800',
  'text-pink-800',
  'text-cyan-500',
  'text-lime-500',
]

const randomColorPerWord = (text: string) => {
  const colors = [...COLORS]
  const getNextColor = () => {
    const index = Math.floor(Math.random() * colors.length)
    return colors.splice(index, 1)[0]
  }
  return (
    <>
      {text.split(' ').map((word) => (
        <span className={getNextColor()} key={Math.random()}>
          {word}{' '}
        </span>
      ))}
    </>
  )
}
export { randomColorPerWord as randomColorPerLetter }
