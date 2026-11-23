import { lazy, Suspense } from 'react'
import type { InstrumentViewerProps } from './InstrumentViewer'

const Viewer = lazy(() => import('./InstrumentViewer'))

/** Loads three.js and the viewer only when a page needs it; the poster shows meanwhile. */
export function LazyViewer(props: InstrumentViewerProps) {
  return (
    <Suspense fallback={<div className={props.className} style={{ position: 'relative' }}>{props.poster}</div>}>
      <Viewer {...props} />
    </Suspense>
  )
}
