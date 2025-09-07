const Footer: React.FC = () => {
  const date = new Date().getFullYear()
  return (
    <footer className="fixed bottom-0 w-full text-center py-2">
      © JScoobyCed - {date}
    </footer>
  )
}

export default Footer
