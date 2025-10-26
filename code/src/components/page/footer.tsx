const Footer: React.FC = () => {
  const date = new Date().getFullYear()
  return (
    <footer className="bottom-0 w-full text-center mt-5 mb-3 text-sm text-gray-400">
      © JScoobyCed - {date}
    </footer>
  )
}

export default Footer
