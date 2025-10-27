import AudioRecorder from './components/page/audioRecorder'
import Footer from './components/page/footer'
import Header from './components/page/header'

const App = () => (
  <div className="flex flex-col min-h-screen bg-gradient-to-br from-pink-400 via-yellow-300 to-blue-300 text-indigo-900">
    <Header></Header>
    <AudioRecorder></AudioRecorder>
    <Footer></Footer>
  </div>
)
export default App
