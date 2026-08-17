import { Component } from 'react'

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

class WebglBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (this.state.failed) return this.props.fallback
    return this.props.children
  }
}

// Renders `children` (a Three.js <Canvas> scene) only when WebGL is
// available, and catches runtime failures so a driver/context error
// degrades to `fallback` instead of blanking the page.
function WebglGate({ children, fallback }) {
  if (!hasWebGL()) return fallback
  return <WebglBoundary fallback={fallback}>{children}</WebglBoundary>
}

export default WebglGate
