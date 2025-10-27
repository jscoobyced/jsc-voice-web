const Footer: React.FC = () => {
  const date = new Date().getFullYear()
  return (
    <>
      <footer className="mb-2 left-0 w-full text-center text-sm text-gray-600 z-10">
        © JScoobyCed - {date}
      </footer>
    </>
  )
}

export default Footer
