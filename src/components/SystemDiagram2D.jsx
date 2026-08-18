import { useState } from 'react'

const ACCENT = '#d96c45'
const CONNECTOR_COLOR = '#b9b3a8'
const GROUP_BORDER = '#c9c6be'

const GROUP_Y = 30
const GROUP_H = 340
const GROUP_CENTER_Y = GROUP_Y + GROUP_H / 2

const GROUP_LAYOUT = {
  webui: { id: 'webui', label: 'Web UI', x: 16, w: 120 },
  node: { id: 'node', label: 'Node.js', x: 176, w: 168 },
  mongo: { id: 'mongo', label: 'MongoDB', x: 384, w: 100 },
}

const CONNECTORS = [
  { id: 'webui-node', from: 'webui', to: 'node', label: 'JSON' },
  { id: 'node-mongo', from: 'node', to: 'mongo', label: 'JSON' },
]

function LabelBox({ x, y, w, h, label, active, fontSize = 12 }) {
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={ACCENT} opacity={active ? 1 : 0.85} style={{ transition: 'opacity 0.2s ease' }} />
      <text
        x={x + w / 2}
        y={y + h / 2 + 4}
        textAnchor="middle"
        fontSize={fontSize}
        fontWeight="700"
        fill="#f4f2ed"
        style={{ pointerEvents: 'none' }}
      >
        {label}
      </text>
    </>
  )
}

function Cylinder({ cx, topY, rx, ry, bodyHeight, label, active }) {
  return (
    <>
      <ellipse cx={cx} cy={topY} rx={rx} ry={ry} fill={ACCENT} opacity={active ? 1 : 0.85} />
      <rect x={cx - rx} y={topY} width={rx * 2} height={bodyHeight} fill={ACCENT} opacity={active ? 1 : 0.85} />
      <ellipse cx={cx} cy={topY + bodyHeight} rx={rx} ry={ry} fill={ACCENT} opacity={active ? 1 : 0.85} />
      <text
        x={cx}
        y={topY + bodyHeight / 2 + 5}
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fill="#f4f2ed"
        style={{ pointerEvents: 'none' }}
      >
        {label}
      </text>
    </>
  )
}

function ArrowV({ id, x, y1, y2, color }) {
  return (
    <g>
      <marker id={`arrow-v-end-${id}`} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 z" fill={color} />
      </marker>
      <marker id={`arrow-v-start-${id}`} markerWidth="8" markerHeight="8" refX="2" refY="4" orient="auto-start-reverse">
        <path d="M0,0 L8,4 L0,8 z" fill={color} />
      </marker>
      <line
        x1={x}
        y1={y1}
        x2={x}
        y2={y2}
        stroke={color}
        strokeWidth={1.3}
        markerStart={`url(#arrow-v-start-${id})`}
        markerEnd={`url(#arrow-v-end-${id})`}
        style={{ transition: 'stroke 0.2s ease' }}
      />
    </g>
  )
}

function GroupShell({ layout, hovered, onEnter, onLeave, children }) {
  return (
    <g data-group={layout.id} onMouseEnter={onEnter} onMouseLeave={onLeave} style={{ cursor: 'pointer' }}>
      <rect
        x={layout.x}
        y={GROUP_Y}
        width={layout.w}
        height={GROUP_H}
        rx={26}
        fill="var(--surface)"
        stroke={hovered ? ACCENT : GROUP_BORDER}
        strokeWidth={hovered ? 2 : 1.5}
        style={{ transition: 'stroke 0.2s ease' }}
      />
      <text
        x={layout.x + 16}
        y={GROUP_Y + 26}
        fontSize="12"
        fontWeight="700"
        letterSpacing="0.04em"
        fill="var(--text)"
        style={{ pointerEvents: 'none', textTransform: 'uppercase' }}
      >
        {layout.label}
      </text>
      {children}
    </g>
  )
}

function Connector({ connector, active }) {
  const from = GROUP_LAYOUT[connector.from]
  const to = GROUP_LAYOUT[connector.to]
  const x1 = from.x + from.w
  const x2 = to.x
  const y = GROUP_CENTER_Y
  const pathId = `connector-path-${connector.id}`
  const color = active ? ACCENT : CONNECTOR_COLOR
  const tagW = 44
  const tagH = 24
  const tagX = (x1 + x2) / 2 - tagW / 2
  const tagY = y - tagH / 2

  return (
    <g style={{ transition: 'all 0.2s ease' }}>
      <marker id={`arrow-end-${connector.id}`} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 z" fill={color} />
      </marker>
      <marker id={`arrow-start-${connector.id}`} markerWidth="8" markerHeight="8" refX="2" refY="4" orient="auto-start-reverse">
        <path d="M0,0 L8,4 L0,8 z" fill={color} />
      </marker>
      <path
        id={pathId}
        d={`M ${x1} ${y} L ${x2} ${y}`}
        fill="none"
        stroke={color}
        strokeWidth={active ? 2 : 1.5}
        markerStart={`url(#arrow-start-${connector.id})`}
        markerEnd={`url(#arrow-end-${connector.id})`}
        style={{ transition: 'stroke 0.2s ease, stroke-width 0.2s ease' }}
      />
      {[0, 1].map((i) => (
        <circle key={i} r={active ? 2.6 : 2.2} fill={ACCENT} opacity={active ? 1 : 0.45}>
          <animateMotion dur="2.2s" repeatCount="indefinite" begin={`-${i * 1.1}s`}>
            <mpath href={`#${pathId}`} />
          </animateMotion>
        </circle>
      ))}
      <rect
        x={tagX}
        y={tagY}
        width={tagW}
        height={tagH}
        rx={12}
        fill="var(--bg)"
        stroke={color}
        strokeWidth={1.2}
        style={{ transition: 'stroke 0.2s ease' }}
      />
      <text
        x={tagX + tagW / 2}
        y={tagY + tagH / 2 + 4}
        textAnchor="middle"
        fontSize="10"
        fontWeight="700"
        letterSpacing="0.03em"
        fill={color}
        style={{ transition: 'fill 0.2s ease', pointerEvents: 'none' }}
      >
        {connector.label}
      </text>
    </g>
  )
}

function SystemDiagram2D() {
  const [hoveredId, setHoveredId] = useState(null)

  const connectorActive = (connector) => hoveredId === connector.from || hoveredId === connector.to
  const arrowColor = (id) => (hoveredId === id ? ACCENT : GROUP_BORDER)
  const enter = (id) => setHoveredId(id)
  const leave = (id) => setHoveredId((current) => (current === id ? null : current))

  const webui = GROUP_LAYOUT.webui
  const webuiCenterX = webui.x + webui.w / 2
  const webuiBoxW = 88

  const node = GROUP_LAYOUT.node
  const restX = node.x + 12
  const expressX = node.x + 84
  const expressCenterX = expressX + 38

  const mongo = GROUP_LAYOUT.mongo
  const mongoCenterX = mongo.x + mongo.w / 2

  return (
    <svg
      className="system-diagram"
      viewBox="0 0 500 400"
      role="img"
      aria-label="Diagram showing a Web UI (View, Controller, Model) exchanging JSON with a Node.js backend (REST, Express.js, mongojs), which exchanges JSON with a MongoDB database (REST, DB)"
    >
      {CONNECTORS.map((connector) => (
        <Connector key={connector.id} connector={connector} active={connectorActive(connector)} />
      ))}

      <GroupShell layout={webui} hovered={hoveredId === 'webui'} onEnter={() => enter('webui')} onLeave={() => leave('webui')}>
        <LabelBox x={webuiCenterX - webuiBoxW / 2} y={92} w={webuiBoxW} h={56} label="View" active={hoveredId === 'webui'} />
        <ArrowV id="view-controller" x={webuiCenterX} y1={148} y2={172} color={arrowColor('webui')} />
        <LabelBox x={webuiCenterX - webuiBoxW / 2} y={172} w={webuiBoxW} h={56} label="Controller" active={hoveredId === 'webui'} />
        <ArrowV id="controller-model" x={webuiCenterX} y1={228} y2={252} color={arrowColor('webui')} />
        <LabelBox x={webuiCenterX - webuiBoxW / 2} y={252} w={webuiBoxW} h={56} label="Model" active={hoveredId === 'webui'} />
      </GroupShell>

      <GroupShell layout={node} hovered={hoveredId === 'node'} onEnter={() => enter('node')} onLeave={() => leave('node')}>
        <LabelBox x={restX} y={90} w={60} h={60} label="REST" active={hoveredId === 'node'} />
        <LabelBox x={expressX} y={90} w={76} h={140} label="Express.js" active={hoveredId === 'node'} fontSize={11} />
        <ArrowV id="express-mongojs" x={expressCenterX} y1={230} y2={250} color={arrowColor('node')} />
        <LabelBox x={expressX} y={250} w={76} h={60} label="mongojs" active={hoveredId === 'node'} />
      </GroupShell>

      <GroupShell layout={mongo} hovered={hoveredId === 'mongo'} onEnter={() => enter('mongo')} onLeave={() => leave('mongo')}>
        <LabelBox x={mongoCenterX - 35} y={100} w={70} h={50} label="REST" active={hoveredId === 'mongo'} />
        <ArrowV id="rest-db" x={mongoCenterX} y1={150} y2={182} color={arrowColor('mongo')} />
        <Cylinder cx={mongoCenterX} topY={192} rx={38} ry={10} bodyHeight={90} label="DB" active={hoveredId === 'mongo'} />
      </GroupShell>
    </svg>
  )
}

export default SystemDiagram2D
