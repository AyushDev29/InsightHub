declare module 'heat' {
  import * as L from 'leaflet'

  interface HeatLatLngPoint {
    0: number // lat
    1: number // lng
    2: number // intensity (0-1)
  }

  interface HeatmapOptions {
    radius?: number
    blur?: number
    maxZoom?: number
    gradient?: Record<number, string>
  }

  function heat(
    data: Array<[number, number, number]> | HeatLatLngPoint[],
    options?: HeatmapOptions
  ): L.Layer

  export default heat
}
