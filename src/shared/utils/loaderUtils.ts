export function hideCanvasLoader() {
    const loader = document.getElementById('canvas-loader')
    if (loader) {
      loader.style.opacity = '0'
      setTimeout(() => {
        loader.style.display = 'none'
      }, 1000)
    }
  }
  