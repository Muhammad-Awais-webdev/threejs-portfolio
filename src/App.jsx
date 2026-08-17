import { useLenis } from './useLenis'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Intro from './components/Intro'
import SelectedWork from './components/SelectedWork'
import Capabilities from './components/Capabilities'
import Stack from './components/Stack'
import Process from './components/Process'
import Systems from './components/Systems'
import ProjectArchive from './components/ProjectArchive'
import Experiments from './components/Experiments'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  useLenis()

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Intro />
        <SelectedWork />
        <Capabilities />
        <Stack />
        <Process />
        <Systems />
        <ProjectArchive />
        <Experiments />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
