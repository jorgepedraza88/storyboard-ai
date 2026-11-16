export interface Option {
  value: string
  label: string
  /** Short phrase injected into the image prompt */
  prompt: string
}

export const SHOT_TYPES: Option[] = [
  { value: 'ews', label: 'Extreme Wide', prompt: 'extreme wide establishing shot, subject tiny in a vast environment' },
  { value: 'ws', label: 'Wide', prompt: 'wide shot showing the full subject and surroundings' },
  { value: 'full', label: 'Full Shot', prompt: 'full shot framing the entire body head to toe' },
  { value: 'medium', label: 'Medium', prompt: 'medium shot framed from the waist up' },
  { value: 'mcu', label: 'Medium Close-Up', prompt: 'medium close-up framed from the chest up' },
  { value: 'cu', label: 'Close-Up', prompt: 'close-up shot filling the frame with the face' },
  { value: 'ecu', label: 'Extreme Close-Up', prompt: 'extreme close-up on a single detail, eyes or object' },
  { value: 'ots', label: 'Over-the-Shoulder', prompt: 'over-the-shoulder shot looking past a foreground figure' },
  { value: 'pov', label: 'POV', prompt: 'point-of-view shot as seen through the character eyes' },
  { value: 'two', label: 'Two Shot', prompt: 'two shot framing two subjects together' },
  { value: 'insert', label: 'Insert', prompt: 'insert shot isolating an important detail' },
]

export const CAMERA_ANGLES: Option[] = [
  { value: 'eye', label: 'Eye Level', prompt: 'eye-level camera angle' },
  { value: 'low', label: 'Low Angle', prompt: 'low camera angle looking up at the subject' },
  { value: 'high', label: 'High Angle', prompt: 'high camera angle looking down at the subject' },
  { value: 'birdseye', label: "Bird's Eye", prompt: "bird's-eye view looking straight down" },
  { value: 'worm', label: "Worm's Eye", prompt: "worm's-eye view looking straight up" },
  { value: 'dutch', label: 'Dutch Angle', prompt: 'canted dutch angle with a tilted horizon' },
  { value: 'over', label: 'Overhead', prompt: 'overhead top-down camera angle' },
]

export const CAMERA_MOVEMENTS: Option[] = [
  { value: 'static', label: 'Static', prompt: 'locked-off static camera' },
  { value: 'pan', label: 'Pan', prompt: 'horizontal panning camera movement' },
  { value: 'tilt', label: 'Tilt', prompt: 'vertical tilting camera movement' },
  { value: 'dolly', label: 'Dolly', prompt: 'dolly camera pushing in or pulling out' },
  { value: 'tracking', label: 'Tracking', prompt: 'tracking camera following the subject' },
  { value: 'crane', label: 'Crane', prompt: 'sweeping crane camera move' },
  { value: 'handheld', label: 'Handheld', prompt: 'handheld camera with organic motion' },
  { value: 'steadicam', label: 'Steadicam', prompt: 'smooth flowing steadicam move' },
  { value: 'zoom', label: 'Zoom', prompt: 'optical zoom on the subject' },
]

export const LENSES: Option[] = [
  { value: '14mm', label: '14mm', prompt: '14mm ultra-wide lens with strong perspective' },
  { value: '24mm', label: '24mm', prompt: '24mm wide-angle lens' },
  { value: '35mm', label: '35mm', prompt: '35mm lens with natural field of view' },
  { value: '50mm', label: '50mm', prompt: '50mm standard lens' },
  { value: '85mm', label: '85mm', prompt: '85mm portrait lens with shallow depth of field' },
  { value: '135mm', label: '135mm', prompt: '135mm telephoto lens with compressed background' },
  { value: '200mm', label: '200mm', prompt: '200mm long telephoto lens' },
]

function makeMap(options: Option[]) {
  return Object.fromEntries(options.map((o) => [o.value, o]))
}

export const OPTION_MAPS = {
  shotType: makeMap(SHOT_TYPES),
  cameraAngle: makeMap(CAMERA_ANGLES),
  cameraMovement: makeMap(CAMERA_MOVEMENTS),
  lens: makeMap(LENSES),
}

export function labelFor(kind: keyof typeof OPTION_MAPS, value: string | null | undefined) {
  if (!value) return OPTION_MAPS[kind][DEFAULTS[kind]]?.label ?? value
  return OPTION_MAPS[kind][value]?.label ?? value
}

export const DEFAULTS = {
  shotType: 'medium',
  cameraAngle: 'eye',
  cameraMovement: 'static',
  lens: '35mm',
} as const
