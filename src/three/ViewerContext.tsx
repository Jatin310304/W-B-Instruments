import { createContext, useContext, type MutableRefObject } from 'react'

export interface ViewerState {
  /** Eased 0 (assembled) → 1 (exploded); written every frame by the viewer. */
  explode: MutableRefObject<number>
  /** 0 = day lighting, 1 = night lighting, eased. */
  night: MutableRefObject<number>
  /** Time since this model appeared, for entrance and demonstration animations. */
  clock: MutableRefObject<number>
  selected: string | null
  hovered: string | null
  interactive: boolean
  showLabels: boolean
  /** Part number shown on labels, keyed by part id. */
  partIndex: Record<string, number>
  partNames: Record<string, string>
  select: (id: string | null) => void
  hover: (id: string | null) => void
}

export const ViewerContext = createContext<ViewerState | null>(null)

export function useViewer() {
  const v = useContext(ViewerContext)
  if (!v) throw new Error('useViewer must be used inside an InstrumentViewer')
  return v
}
