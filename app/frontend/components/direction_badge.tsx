const DIR_16_SHORT = [
  "N","NNE","NE","ENE","E","ESE","SE","SSE",
  "S","SSW","SW","WSW","W","WNW","NW","NNW"
]

const DIR_16_LONG = [
  "North","North-northeast","Northeast","East-northeast","East","East-southeast","Southeast","South-southeast",
  "South","South-southwest","Southwest","West-southwest","West","West-northwest","Northwest","North-northwest"
]

/** Normalize degrees and map to 16-point compass */
function degreesToCompass(
  degInput: number | string | null | undefined,
  opts:     { long?: boolean } = {}
) {
  const long = !!opts.long
  const n    = Number(degInput)

  if (!Number.isFinite(n)) return { label: null, degrees: null }

  // OSM convention: 0 = North, clockwise; keep as-is
  const degrees = ((n % 360) + 360) % 360
  const idx     = Math.round(degrees / 22.5) % 16

  return { label: long ? DIR_16_LONG[idx] : DIR_16_SHORT[idx], degrees }
}

type Props = { direction: number | string | null | undefined; size?: number }

export default function DirectionBadge({ direction, size = 24 }: Props) {
  const { label, degrees } = degreesToCompass(direction, { long: true })

  if (label == null || degrees == null) return null

  const s  = size
  const cx = s / 2
  const cy = s / 2

  return (
    <div className="inline-flex items-center gap-2">
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} aria-label={`Direction ${label}`} className="shrink-0 text-current">
        <g transform={`rotate(${degrees} ${cx} ${cy})`}>
          <polygon points={`${cx},2 ${cx - 5},${cy + 6} ${cx + 5},${cy + 6}`} className="fill-current" />
          <rect x={cx - 1} y={cy + 6} width="2" height={s - (cy + 8)} rx="1" className="fill-current"/>
        </g>
        <circle cx={cx} cy={cy} r={s/2 - 1} fill="none" stroke="currentColor" opacity="0.25" />
      </svg>
      <span style={{ whiteSpace: "nowrap" }}>
        {label} ({Math.round(degrees)}°)
      </span>
    </div>
  );
}
