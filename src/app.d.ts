type PropaTweenTarget = string | Element | Element[] | HTMLCollection | null | undefined

export interface PropaAnimationStep {
  target?: PropaTweenTarget
  time?: number | string
  label?: string
  set?: Record<string, unknown>
  from?: Record<string, unknown> | boolean | null
  to?: Record<string, unknown> | null
  animType?: 'to' | 'from' | 'fromTo'
  create?: Record<string, unknown> | null
  scrollTrigger?: Record<string, unknown>
  [key: string]: unknown
}

export interface PropaEchoOptions {
  propaLetter?: string | null
  isoMetric?: boolean
  scaleAdjust?: boolean
  faceColor?: string
  faceOutline?: string | boolean
  strokeOutline?: string | boolean
  outline?: boolean
  angle?: number
  rotateX?: number
  rotateY?: number
  rotateZ?: number
  transparency?: number
  spreading?: 'none' | 'linear' | 'expand' | 'squared' | 'reversedLinear' | 'reversedExpand' | 'reversedSquared'
  color?: string
  kerning?: number
  lineSpacing?: number
  fontSize?: number
  title?: string
}

export interface PropaCentricContext {
  path: string
  pathId: string
  units: string
  radius: number
  pathElement?: SVGPathElement | null
}

export interface PropaTitleContext {
  title: string
  propagandaWrapper: HTMLDivElement | null
}

export interface PropaSharedState {
  intersection: Record<string, unknown>
  typographicScrollProgress: number
}

declare global {
  interface Array<T> {
    propagandaShuffle(): T[]
  }
}

export {}