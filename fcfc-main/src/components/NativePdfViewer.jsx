import { useState, useEffect, useRef, useCallback } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader } from 'lucide-react'

// Set worker source to matching version
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

export default function NativePdfViewer({ url, title, onLoaded }) {
  const [pdfDoc, setPdfDoc] = useState(null)
  const [pageNum, setPageNum] = useState(1)
  const [numPages, setNumPages] = useState(0)
  const [scale, setScale] = useState(1.0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [rendering, setRendering] = useState(false)

  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const renderTaskRef = useRef(null)
  const touchStartRef = useRef(null)

  // Load PDF Document
  useEffect(() => {
    let isCancelled = false
    setLoading(true)
    setError(null)
    setPageNum(1)

    const loadingTask = pdfjsLib.getDocument({
      url,
      withCredentials: false,
    })

    loadingTask.promise
      .then((doc) => {
        if (!isCancelled) {
          setPdfDoc(doc)
          setNumPages(doc.numPages)
          setLoading(false)
          if (onLoaded) onLoaded()
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.error('PDF load error:', err)
          setError('Failed to load PDF document. Please try again.')
          setLoading(false)
          if (onLoaded) onLoaded()
        }
      })

    return () => {
      isCancelled = true
      if (loadingTask && loadingTask.destroy) {
        loadingTask.destroy()
      }
    }
  }, [url, onLoaded])

  // Render current page to Canvas
  const renderPage = useCallback(async (num, doc, currentScale) => {
    if (!doc || !canvasRef.current) return
    setRendering(true)

    try {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel()
      }

      const page = await doc.getPage(num)
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      // Measure exact container width for responsive auto-fit
      const containerWidth = containerRef.current
        ? containerRef.current.clientWidth - 16
        : Math.min(window.innerWidth - 24, 880)
      
      const unscaledViewport = page.getViewport({ scale: 1.0 })
      const fitRatio = (containerWidth / unscaledViewport.width) * currentScale
      const viewport = page.getViewport({ scale: fitRatio })

      // Handle HiDPI screens (Retina)
      const outputScale = window.devicePixelRatio || 1
      canvas.width = Math.floor(viewport.width * outputScale)
      canvas.height = Math.floor(viewport.height * outputScale)
      canvas.style.width = Math.floor(viewport.width) + 'px'
      canvas.style.height = Math.floor(viewport.height) + 'px'

      ctx.save()
      ctx.scale(outputScale, outputScale)

      const renderContext = {
        canvasContext: ctx,
        viewport,
      }

      const task = page.render(renderContext)
      renderTaskRef.current = task
      await task.promise
    } catch (err) {
      if (err?.name !== 'RenderingCancelledException') {
        console.error('Page render error:', err)
      }
    } finally {
      setRendering(false)
    }
  }, [])

  useEffect(() => {
    if (pdfDoc && pageNum) {
      renderPage(pageNum, pdfDoc, scale)
    }
  }, [pdfDoc, pageNum, scale, renderPage])

  // Resize handler to re-fit canvas when orientation changes or window resizes
  useEffect(() => {
    const handleResize = () => {
      if (pdfDoc && pageNum) {
        renderPage(pageNum, pdfDoc, scale)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [pdfDoc, pageNum, scale, renderPage])

  const prevPage = useCallback(() => {
    if (pageNum > 1) {
      setPageNum((p) => p - 1)
      if (containerRef.current) containerRef.current.scrollTop = 0
    }
  }, [pageNum])

  const nextPage = useCallback(() => {
    if (pageNum < numPages) {
      setPageNum((p) => p + 1)
      if (containerRef.current) containerRef.current.scrollTop = 0
    }
  }, [pageNum, numPages])

  // Touch Swipe Gesture for Mobile (Swipe left = Next slide, Swipe right = Prev slide)
  const handleTouchStart = (e) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    }
  }

  const handleTouchEnd = (e) => {
    if (!touchStartRef.current) return
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y
    touchStartRef.current = null

    // If horizontal swipe is dominant and > 50px
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        nextPage()
      } else {
        prevPage()
      }
    }
  }

  const zoomIn = () => setScale((s) => Math.min(2.5, +(s + 0.15).toFixed(2)))
  const zoomOut = () => setScale((s) => Math.max(0.6, +(s - 0.15).toFixed(2)))

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        position: 'relative',
        background: '#0a101f',
        overflow: 'hidden',
      }}
    >
      {/* Top Mobile Pagination Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          background: 'rgba(255, 255, 255, 0.06)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#fff',
          fontSize: 13,
          fontWeight: 600,
          flexShrink: 0,
          gap: 6,
          flexWrap: 'nowrap',
        }}
      >
        {/* Page navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
          <button
            type="button"
            onClick={prevPage}
            disabled={pageNum <= 1 || loading}
            aria-label="Previous Page"
            style={{
              padding: '7px 11px',
              borderRadius: 8,
              background: pageNum <= 1 ? 'rgba(255,255,255,0.05)' : 'rgba(74,144,217,0.3)',
              border: 'none',
              color: pageNum <= 1 ? 'rgba(255,255,255,0.25)' : '#fff',
              cursor: pageNum <= 1 ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 12,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            <ChevronLeft size={16} /> <span className="hide-xs">Prev</span>
          </button>

          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.95)', whiteSpace: 'nowrap' }}>
            <strong style={{ color: '#4A90D9' }}>{pageNum}</strong> / {numPages || '…'}
          </span>

          <button
            type="button"
            onClick={nextPage}
            disabled={pageNum >= numPages || loading}
            aria-label="Next Page"
            style={{
              padding: '7px 11px',
              borderRadius: 8,
              background: pageNum >= numPages ? 'rgba(255,255,255,0.05)' : 'rgba(74,144,217,0.3)',
              border: 'none',
              color: pageNum >= numPages ? 'rgba(255,255,255,0.25)' : '#fff',
              cursor: pageNum >= numPages ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 12,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            <span className="hide-xs">Next</span> <ChevronRight size={16} />
          </button>
        </div>

        {/* Zoom controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <button
            type="button"
            onClick={zoomOut}
            disabled={scale <= 0.6}
            aria-label="Zoom Out"
            style={{
              padding: 7,
              borderRadius: 8,
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <ZoomOut size={15} />
          </button>

          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', minWidth: 36, textAlign: 'center' }}>
            {Math.round(scale * 100)}%
          </span>

          <button
            type="button"
            onClick={zoomIn}
            disabled={scale >= 2.5}
            aria-label="Zoom In"
            style={{
              padding: 7,
              borderRadius: 8,
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <ZoomIn size={15} />
          </button>
        </div>
      </div>

      {/* Scrollable Viewport & Canvas with Mobile Touch Gestures */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-x pan-y',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '12px 8px',
          position: 'relative',
        }}
      >
        {loading && (
          <div
            style={{
              position: 'absolute',
              top: '40%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              color: 'rgba(255,255,255,0.85)',
              fontSize: 14,
            }}
          >
            <Loader size={26} className="adm-spin" />
            <span>Loading presentation slides…</span>
          </div>
        )}

        {error && (
          <div
            style={{
              color: '#e74c3c',
              padding: 20,
              textAlign: 'center',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}

        <canvas
          ref={canvasRef}
          style={{
            display: loading || error ? 'none' : 'block',
            boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
            borderRadius: 6,
            background: '#fff',
            maxWidth: scale <= 1.0 ? '100%' : 'none',
          }}
        />
      </div>

      {/* Mobile Swipe Hint */}
      {!loading && !error && numPages > 1 && (
        <div
          style={{
            textAlign: 'center',
            padding: '5px 8px',
            fontSize: 11,
            color: 'rgba(255,255,255,0.5)',
            background: 'rgba(0,0,0,0.3)',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            flexShrink: 0,
          }}
        >
          Swipe left/right or use Prev/Next buttons to change slides
        </div>
      )}
    </div>
  )
}
