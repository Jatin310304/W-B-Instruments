import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

/**
 * Conceptual 3D instruments. None of these are manufacturer models: they are original procedural
 * illustrations of a typical instrument of each type, and the site labels them that way.
 * To swap in an accurate model, see docs/3D-ASSETS.md (a GLB per key, same part names).
 */
export type ModelKey =
  | 'pyrometer'
  | 'panel-meter'
  | 'loop-indicator'
  | 'blackbody'
  | 'dry-block'
  | 'handheld-humidity'
  | 'handheld-air'
  | 'handheld-sound'
  | 'handheld-light'
  | 'handheld-water'

export interface PartMeta {
  id: string
  name: string
  /** Plain-language function of the component. No specifications. */
  desc: string
}

export interface ModelProps {
  modelKey: ModelKey
  /** Verify demonstration: show a pyrometer checking the blackbody. */
  demo?: boolean
}

export interface ModelMeta {
  key: ModelKey
  name: string
  /** Typical instrument this illustrates. */
  represents: string
  parts: PartMeta[]
  explodable: boolean
  camera: { distance: number; target: [number, number, number]; fov?: number; explodedTarget?: [number, number, number] }
  /** Resting orientation of the model in the viewer (radians). */
  rotation: [number, number, number]
  Component: LazyExoticComponent<ComponentType<ModelProps>>
}

export const CONCEPT_NOTE =
  "Conceptual 3D illustration of a typical instrument of this type. It is not a model of a specific manufacturer's product, and the internal components shown are typical, not manufacturer-verified."

const Pyrometer = lazy(() => import('./Pyrometer'))
const PanelMeter = lazy(() => import('./PanelMeter'))
const LoopIndicator = lazy(() => import('./LoopIndicator'))
const Blackbody = lazy(() => import('./Blackbody'))
const DryBlock = lazy(() => import('./DryBlock'))
const Handheld = lazy(() => import('./Handheld'))

const handheld = (key: ModelKey, name: string, represents: string): ModelMeta => ({
  key,
  name,
  represents,
  parts: [],
  explodable: false,
  camera: { distance: 8.6, target: [0, 0.1, 0] },
  rotation: [0.08, -0.5, 0],
  Component: Handheld,
})

export const MODELS: Record<ModelKey, ModelMeta> = {
  pyrometer: {
    key: 'pyrometer',
    name: 'Fixed infrared pyrometer',
    represents: 'A fixed, non-contact infrared temperature sensor of the kind used in metals, glass and process plants.',
    explodable: true,
    camera: { distance: 9.4, target: [0, 0, 0], explodedTarget: [0, -0.35, 0] },
    rotation: [0.12, -0.95, 0],
    Component: Pyrometer,
    parts: [
      { id: 'optics', name: 'Optics', desc: 'Collects infrared energy from the target and focuses it onto the detector. The lens design sets the measuring distance and spot size, which differ from model to model.' },
      { id: 'bezel', name: 'Lens retainer', desc: 'Holds the optics in position and protects the edge of the lens.' },
      { id: 'sensor', name: 'Sensing element', desc: 'The infrared detector turns the focused radiation into a small electrical signal. The wavelength it works at is why metals, glass and plastics each need a suitably chosen pyrometer.' },
      { id: 'electronics', name: 'Signal processing', desc: "Amplifies the detector signal, corrects it for the target's emissivity and converts it into an output that displays and control systems can use." },
      { id: 'housing', name: 'Housing', desc: 'Protects the optics and electronics in an industrial environment. The threaded body lets the sensor be fixed to a bracket.' },
      { id: 'mounting', name: 'Mounting nuts', desc: 'Lock the housing in position on its bracket so the sensor stays aimed at the target.' },
      { id: 'connector', name: 'Connector & cable', desc: 'Brings power in and carries the measurement signal out to a display or control system.' },
    ],
  },
  'panel-meter': {
    key: 'panel-meter',
    name: 'Panel-mount digital indicator',
    represents: 'A digital panel meter that shows a live process reading on a control panel door.',
    explodable: true,
    camera: { distance: 9, target: [0, 0, -0.4] },
    rotation: [0.1, -0.6, 0],
    Component: PanelMeter,
    parts: [
      { id: 'bezel', name: 'Front bezel & keys', desc: 'The face seen on the control panel, with keys used to set the display up.' },
      { id: 'display', name: 'Display', desc: 'Shows the live reading taken from the sensor signal.' },
      { id: 'pcb', name: 'Measurement electronics', desc: 'Reads the process signal (mA, V or temperature), scales it for display and drives alarm relays or retransmission where those options are fitted.' },
      { id: 'case', name: 'Panel case', desc: 'Slides into a cut-out in the control panel door.' },
      { id: 'terminals', name: 'Rear terminals', desc: 'Where the sensor signal, power and any relay outputs are wired in.' },
      { id: 'clamps', name: 'Panel clamps', desc: 'Pull the meter tight against the back of the panel door.' },
    ],
  },
  'loop-indicator': {
    key: 'loop-indicator',
    name: 'Loop-powered field indicator',
    represents: 'A field display powered from the 4–20 mA loop it is reading.',
    explodable: true,
    camera: { distance: 8.4, target: [0, -0.1, 0] },
    rotation: [0.1, -0.55, 0],
    Component: LoopIndicator,
    parts: [
      { id: 'window', name: 'Window & bezel', desc: 'Seals the front of the housing and protects the display while keeping it readable.' },
      { id: 'display', name: 'Display', desc: 'Shows the reading taken from the 4–20 mA loop signal.' },
      { id: 'electronics', name: 'Loop-powered electronics', desc: 'Runs on the 4–20 mA loop itself, so no separate power supply is needed where the indicator is installed.' },
      { id: 'housing', name: 'Housing', desc: 'Protects the electronics where the indicator is installed in the plant.' },
      { id: 'entry', name: 'Cable entry', desc: 'Where the loop wiring enters the housing.' },
    ],
  },
  blackbody: {
    key: 'blackbody',
    name: 'Blackbody calibration source',
    represents: 'A reference furnace whose cavity is held at a known, steady temperature to check pyrometers and thermal cameras.',
    explodable: false,
    camera: { distance: 11, target: [0.3, 0.2, 0.6] },
    rotation: [0.1, -0.55, 0],
    Component: Blackbody,
    parts: [],
  },
  'dry-block': {
    key: 'dry-block',
    name: 'Dry block temperature calibrator',
    represents: 'A portable calibrator with a heated metal block that holds temperature probes at a reference temperature.',
    explodable: false,
    camera: { distance: 9, target: [0, 0.1, 0] },
    rotation: [0.18, -0.6, 0],
    Component: DryBlock,
    parts: [],
  },
  'handheld-humidity': handheld('handheld-humidity', 'Handheld meter with humidity probe', 'A portable thermo-hygrometer with a plug-in probe.'),
  'handheld-air': handheld('handheld-air', 'Handheld meter with air velocity probe', 'A portable air velocity meter with a telescopic probe.'),
  'handheld-sound': handheld('handheld-sound', 'Handheld sound level meter', 'A portable sound level meter with a microphone and windscreen.'),
  'handheld-light': handheld('handheld-light', 'Handheld meter with light sensor', 'A portable meter with a photometric sensor head.'),
  'handheld-water': handheld('handheld-water', 'Handheld meter with water quality electrode', 'A portable meter with an electrode for water quality measurements.'),
}
