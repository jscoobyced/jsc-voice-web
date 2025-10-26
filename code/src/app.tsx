import AudioRecorder from './components/page/audioRecorder'
import Footer from './components/page/footer'
import Header from './components/page/header'
import HowToPlay from './components/page/howToPlay'

const App = () => (
  <div className="flex flex-col min-h-screen bg-gradient-to-b from-cyan-900 via-blue-900 to-purple-900 text-white">
    <Header></Header>
    <AudioRecorder></AudioRecorder>
    <HowToPlay></HowToPlay>
    <Footer></Footer>
  </div>
)
export default App
