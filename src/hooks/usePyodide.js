import { useState, useRef, useCallback } from 'react'

let pyodideInstance = null
let loadingPromise = null

async function getPyodide() {
  if (pyodideInstance) return pyodideInstance
  if (loadingPromise) return loadingPromise

  loadingPromise = (async () => {
    // Load Pyodide from CDN
    if (!window.loadPyodide) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js'
        script.onload = resolve
        script.onerror = reject
        document.head.appendChild(script)
      })
    }
    const py = await window.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/',
      stdout: () => {},
      stderr: () => {},
    })
    // Pre-install micropip and pandas
    await py.loadPackage(['pandas', 'numpy', 'matplotlib'])
    pyodideInstance = py
    loadingPromise = null
    return py
  })()

  return loadingPromise
}

export function usePyodide() {
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [initError, setInitError] = useState(null)
  const initRef = useRef(false)

  const init = useCallback(async () => {
    if (initRef.current) return
    initRef.current = true
    setLoading(true)
    try {
      await getPyodide()
      setReady(true)
    } catch (e) {
      setInitError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const runCode = useCallback(async (code) => {
    try {
      const py = await getPyodide()
      // Capture stdout
      let output = ''
      py.setStdout({ batched: (s) => { output += s + '\n' } })
      py.setStderr({ batched: (s) => { output += '⚠️ ' + s + '\n' } })

      // Redirect matplotlib to not open windows
      const setup = `
import sys, io
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
plt.close('all')
`
      await py.runPythonAsync(setup)
      await py.runPythonAsync(code)

      // Check if a matplotlib figure was created and get it as base64
      let chartB64 = null
      try {
        const figCheck = await py.runPythonAsync(`
import matplotlib.pyplot as plt
import io, base64
figs = [plt.figure(i) for i in plt.get_fignums()]
if figs:
    buf = io.BytesIO()
    figs[-1].savefig(buf, format='png', dpi=120, bbox_inches='tight',
                     facecolor='#070910', edgecolor='none')
    buf.seek(0)
    base64.b64encode(buf.read()).decode('utf-8')
else:
    ''
`)
        chartB64 = figCheck || null
        // Close all figures to free memory
        await py.runPythonAsync('import matplotlib.pyplot as plt; plt.close("all")')
      } catch {}

      return { ok: true, output: output.trim(), chartB64 }
    } catch (e) {
      // Extract meaningful error
      const lines = e.message.split('\n')
      const msg = lines.filter(l => l.includes('Error') || l.includes('error')).pop() || e.message
      return { ok: false, output: msg, chartB64: null }
    }
  }, [])

  return { loading, ready, initError, init, runCode }
}
