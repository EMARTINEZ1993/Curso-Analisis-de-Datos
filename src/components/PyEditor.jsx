import { useEffect, useRef, useState, useCallback } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { python } from '@codemirror/lang-python'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorState } from '@codemirror/state'
import { keymap } from '@codemirror/view'
import { indentWithTab } from '@codemirror/commands'
import { C } from '../utils/theme.js'
import { usePyodide } from '../hooks/usePyodide.js'

const darkTheme = EditorView.theme({
  '&': { background: '#090b13', borderRadius: '0 0 10px 10px' },
  '.cm-content': { padding: '12px 0', caretColor: '#818cf8' },
  '.cm-line': { padding: '0 16px' },
  '.cm-gutters': { background: '#07090f', border: 'none', color: '#334155' },
  '.cm-activeLineGutter': { background: '#6366f115' },
  '.cm-activeLine': { background: '#6366f108' },
  '.cm-selectionBackground, ::selection': { background: '#6366f133 !important' },
  '.cm-cursor': { borderLeftColor: '#818cf8' },
})

export default function PyEditor({
  defaultCode = '',
  onRun,           // optional custom validator (returns {ok, msg})
  showOutput = true,
  height = '160px',
  hint = null,
  attempts: externalAttempts = null,
  onAttempt = null,
}) {
  const editorRef    = useRef(null)
  const viewRef      = useRef(null)
  const startTimeRef = useRef(null)
  const [output, setOutput]       = useState(null)
  const [running, setRunning]     = useState(false)
  const [attempts, setAttempts]   = useState(0)
  const [showHint, setShowHint]   = useState(false)
  const [hintLevel, setHintLevel] = useState(0)
  const [chartB64, setChartB64]   = useState(null)

  const { loading: pyLoading, ready: pyReady, init: pyInit, runCode } = usePyodide()

  // Build editor on mount
  useEffect(() => {
    if (!editorRef.current) return
    const state = EditorState.create({
      doc: defaultCode,
      extensions: [
        basicSetup,
        python(),
        oneDark,
        darkTheme,
        keymap.of([indentWithTab]),
        EditorView.lineWrapping,
      ],
    })
    const view = new EditorView({ state, parent: editorRef.current })
    viewRef.current = view
    startTimeRef.current = Date.now()
    return () => view.destroy()
  }, []) // Only on mount – don't reset on defaultCode change

  // Reset editor when defaultCode changes (exercise switch)
  const prevCode = useRef(defaultCode)
  useEffect(() => {
    if (prevCode.current === defaultCode) return
    prevCode.current = defaultCode
    if (viewRef.current) {
      viewRef.current.dispatch({
        changes: { from: 0, to: viewRef.current.state.doc.length, insert: defaultCode }
      })
    }
    setOutput(null)
    setAttempts(0)
    setShowHint(false)
    setHintLevel(0)
    setChartB64(null)
    startTimeRef.current = Date.now()
  }, [defaultCode])

  const getCode = () => viewRef.current?.state.doc.toString() || ''

  const handleRun = useCallback(async () => {
    const code = getCode()
    setRunning(true)
    setChartB64(null)

    const attemptCount = attempts + 1
    setAttempts(attemptCount)
    if (onAttempt) onAttempt(attemptCount)

    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)

    try {
      if (onRun) {
        // Custom validator mode (exercise)
        let pyResult = null
        if (pyReady) {
          pyResult = await runCode(code)
          if (pyResult.chartB64) setChartB64(pyResult.chartB64)
        }
        const validResult = onRun(code, pyResult)
        setOutput({ ...validResult, elapsed, attemptCount })
      } else {
        // Free-run mode (demo block)
        await pyInit()
        const result = await runCode(code)
        setChartB64(result.chartB64)
        setOutput({
          ok: result.ok,
          msg: result.output || (result.ok ? '(sin output)' : 'Error al ejecutar'),
          elapsed,
          attemptCount,
        })
      }
    } catch (e) {
      setOutput({ ok: false, msg: e.message, elapsed, attemptCount })
    } finally {
      setRunning(false)
    }
  }, [attempts, onRun, pyReady, pyInit, runCode, onAttempt])

  const hintLevels = hint ? (Array.isArray(hint) ? hint : [hint]) : []
  const showSolution = externalAttempts !== null
    ? externalAttempts >= 3
    : attempts >= 3

  return (
    <div style={{ marginBottom: 16 }}>
      {/* ── EDITOR CHROME ── */}
      <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${C.border}` }}>
        {/* Title bar */}
        <div style={{ background: '#0a0b14', padding: '8px 14px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {['#ff5f57','#ffbd2e','#28ca41'].map((c,i) =>
              <div key={i} style={{ width:10, height:10, borderRadius:'50%', background:c }}/>)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize:11, color:'#a78bfa', fontFamily:'var(--mono)' }}>
              {onRun ? '✏️ ejercicio.py' : '▶ demo.py'}
            </span>
            {attempts > 0 && (
              <span style={{ fontSize:11, color: attempts >= 3 ? C.red : C.muted,
                fontWeight:700, background: C.border, borderRadius:6, padding:'2px 8px' }}>
                Intento {attempts}
              </span>
            )}
          </div>
        </div>

        {/* CodeMirror mount point */}
        <div ref={editorRef} style={{ maxHeight: height, overflowY:'auto' }} />

        {/* Run button */}
        <button
          onClick={handleRun}
          disabled={running}
          style={{
            width: '100%', padding: 12, border: 'none',
            background: running ? C.border
              : onRun ? `linear-gradient(90deg,${C.green},#15803d)`
              : `linear-gradient(90deg,${C.teal},#0d9488)`,
            color: 'white', cursor: running ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font)', fontWeight: 900, fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 0.2s',
          }}>
          {running
            ? <><span className="spinning">⚙️</span> {pyLoading ? 'Iniciando Python…' : 'Ejecutando…'}</>
            : onRun ? '▶  Ejecutar código' : '▶  Ejecutar y ver resultado'
          }
        </button>
      </div>

      {/* ── HINTS ── */}
      {hint && !output?.ok && (
        <div style={{ marginTop: 8 }}>
          {!showHint ? (
            <button onClick={() => setShowHint(true)} className="btn btn-ghost"
              style={{ fontSize:13, padding:'6px 14px' }}>
              💡 Ver pista {hintLevels.length > 1 ? `(1/${hintLevels.length})` : ''}
            </button>
          ) : (
            <div style={{ background:'#1e293b', borderRadius:10,
              padding:'12px 16px', fontSize:13, color:C.dim }}>
              <div style={{ fontWeight:800, color:C.yellow, marginBottom:4 }}>
                💡 Pista {hintLevel + 1}
                {hintLevel < hintLevels.length - 1 && (
                  <button onClick={() => setHintLevel(h => Math.min(h+1, hintLevels.length-1))}
                    style={{ marginLeft:12, background:'none', border:'none',
                      color:C.purple, cursor:'pointer', fontWeight:800, fontSize:12 }}>
                    Siguiente pista →
                  </button>
                )}
              </div>
              {hintLevels[hintLevel]}
            </div>
          )}
        </div>
      )}

      {/* ── SOLUTION REVEAL ── */}
      {showSolution && onRun && !output?.ok && (
        <details style={{ marginTop: 8 }}>
          <summary style={{ cursor:'pointer', fontSize:13, color:C.red,
            fontWeight:800, padding:'6px 0', userSelect:'none' }}>
            🔓 Ver solución (después de 3 intentos)
          </summary>
        </details>
      )}

      {/* ── OUTPUT ── */}
      {showOutput && output && (
        <div style={{
          borderRadius: 12, padding: 16, marginTop: 10,
          background: output.ok ? `${C.green}11` : `${C.red}11`,
          border: `2px solid ${output.ok ? C.green : C.red}`,
          animation: output.ok ? 'fadeIn 0.3s' : 'shake 0.4s',
        }}>
          <div style={{ fontWeight:800, fontSize:14, marginBottom:8,
            color: output.ok ? C.green : C.red,
            display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span>{output.ok ? '✅ ¡Correcto!' : '❌ Revisa tu código'}</span>
            {output.elapsed !== undefined && (
              <span style={{ fontSize:11, color:C.muted, fontWeight:600 }}>
                {output.elapsed}s
              </span>
            )}
          </div>
          <pre style={{ fontFamily:'var(--mono)', fontSize:12,
            color: C.dim, whiteSpace:'pre-wrap', margin:0 }}>
            {output.msg}
          </pre>
          {/* Chart output */}
          {chartB64 && (
            <div style={{ marginTop:12 }}>
              <div style={{ fontSize:11, color:C.orange, fontWeight:800,
                marginBottom:8, fontFamily:'var(--mono)' }}>// GRÁFICO GENERADO</div>
              <img src={`data:image/png;base64,${chartB64}`}
                alt="chart" style={{ width:'100%', borderRadius:8, border:`1px solid ${C.border}` }} />
            </div>
          )}
        </div>
      )}

      {/* Chart from free-run */}
      {!onRun && chartB64 && !output && (
        <div style={{ marginTop:10, borderRadius:12, overflow:'hidden',
          border:`1px solid ${C.border}` }}>
          <img src={`data:image/png;base64,${chartB64}`}
            alt="chart" style={{ width:'100%' }} />
        </div>
      )}
    </div>
  )
}
