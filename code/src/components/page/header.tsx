import HamburgerMenu from '../elements/HamburgerMenu'
import Title from '../elements/title'

const navigateTo = (target: string) => {
  const t = (target || '').toLowerCase()
  switch (t) {
    case 'auth':
    case 'play':
      window.scrollTo({ top: 0, behavior: 'smooth' })
      break
    case 'howto':
      const el = document.getElementById('how-to-play')
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      break
    default:
      return
  }
}

const Header: React.FC = () => {
  return (
    <header className="relative text-center py-6">
      <div className="absolute right-4 top-4">
        <HamburgerMenu onNavigate={navigateTo} />
      </div>
      <Title title="The Story where you are the Hero" />
    </header>
  )
}

export default Header
