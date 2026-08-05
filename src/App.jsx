import { useMemo, useState } from 'react'
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  GripVertical,
  Lock,
  Sparkles,
  Trash2,
  Unlock,
} from 'lucide-react'

const BASE_WPM = 145
const STEPPER_LEVELS = [0, 1.1, 1.2, 1.35]

const createScene = (idx) => ({
  id: crypto.randomUUID(),
  title: `Scene ${idx + 1}`,
  narration:
    idx === 0
      ? 'Hook the audience in the first 5 seconds, then define the value of the video.'
      : '',
  onscreenGraphics: [
    { id: crypto.randomUUID(), label: 'B-roll overlay', done: false },
    { id: crypto.randomUUID(), label: 'Lower-third', done: false },
  ],
  references: ['https://youtube.com/example-reference'],
  timePaddingLevel: 1,
  versions: [],
})

const createScript = (name, status) => ({
  id: crypto.randomUUID(),
  name,
  status,
  scenes: [createScene(0), createScene(1), createScene(2)],
})

const initialScripts = [
  createScript('How to ship faster with AI', 'In progress'),
  createScript('Channel redesign launch', 'Backlog'),
  createScript('March recap + roadmap', 'Done'),
]

const estimateDuration = (scene) => {
  const words = scene.narration.trim().split(/\s+/).filter(Boolean).length
  const baseSeconds = Math.max(6, Math.round((words / BASE_WPM) * 60))
  return Math.round(baseSeconds * STEPPER_LEVELS[scene.timePaddingLevel])
}

const formatSeconds = (seconds) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function SceneCard({
  scene,
  index,
  updateScene,
  removeScene,
  recordingMode,
  isActive,
  setActive,
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: scene.id })

  const duration = estimateDuration(scene)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : 1,
  }

  return (
    <motion.article
      ref={setNodeRef}
      layout
      style={style}
      onClick={() => setActive(scene.id)}
      className={`relative w-[355px] shrink-0 rounded-2xl border border-slate-700/80 bg-slate-900/95 p-4 shadow-float transition ${
        isActive ? 'ring-2 ring-cyan-400/90' : 'hover:border-slate-500'
      } ${recordingMode && !isActive ? 'opacity-30 blur-[1px]' : ''}`}
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.18 } }}
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-cyan-300">{scene.title}</p>
          <p className="text-sm text-slate-300">~ {formatSeconds(duration)}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-lg border border-slate-700 bg-slate-800 p-1 text-slate-400 hover:text-white"
            {...attributes}
            {...listeners}
          >
            <GripVertical size={16} />
          </button>
          <button
            type="button"
            onClick={() => removeScene(scene.id)}
            className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-1 text-rose-300 hover:bg-rose-500/20"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <label className="mb-2 block text-xs uppercase tracking-wide text-slate-400">Narration</label>
      <textarea
        value={scene.narration}
        onChange={(e) => updateScene(scene.id, { narration: e.target.value })}
        className={`mb-4 min-h-28 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-slate-100 outline-none transition focus:border-cyan-400 ${
          recordingMode && isActive ? 'text-xl leading-relaxed' : 'text-sm'
        }`}
        placeholder="Write voice-over text..."
      />

      <div className="mb-4">
        <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">Onscreen graphics</p>
        <div className="space-y-2">
          {scene.onscreenGraphics.map((item) => (
            <button
              key={item.id}
              onClick={() =>
                updateScene(scene.id, {
                  onscreenGraphics: scene.onscreenGraphics.map((g) =>
                    g.id === item.id ? { ...g, done: !g.done } : g,
                  ),
                })
              }
              className="flex w-full items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-left text-sm text-slate-300 hover:border-slate-500"
            >
              <span
                className={`grid size-4 place-items-center rounded border ${
                  item.done
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : 'border-slate-500 text-transparent'
                }`}
              >
                <Check size={12} />
              </span>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <label className="mb-2 block text-xs uppercase tracking-wide text-slate-400">References</label>
      <input
        value={scene.references.join(', ')}
        onChange={(e) =>
          updateScene(scene.id, {
            references: e.target.value
              .split(',')
              .map((v) => v.trim())
              .filter(Boolean),
          })
        }
        className="mb-4 w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
        placeholder="https://..."
      />

      <div>
        <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">Timing buffer</p>
        <div className="grid grid-cols-4 overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
          {['Base', '+10%', '+20%', '+35%'].map((label, stepIdx) => (
            <button
              key={label}
              className={`px-2 py-1.5 text-xs transition ${
                scene.timePaddingLevel === stepIdx
                  ? 'bg-cyan-500 text-slate-950'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
              onClick={() => updateScene(scene.id, { timePaddingLevel: stepIdx })}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-violet-500/30 bg-violet-500/10 p-2 text-xs text-violet-100">
        <p className="mb-1 flex items-center gap-1 font-medium">
          <Sparkles size={13} /> AI Versions ({scene.versions.length})
        </p>
        <p className="text-violet-200/90">
          Ready for proofread/polish without overwriting original narration.
        </p>
      </div>
    </motion.article>
  )
}

export default function App() {
  const [scripts, setScripts] = useState(initialScripts)
  const [activeScriptId, setActiveScriptId] = useState(initialScripts[0].id)
  const [drawerOpen, setDrawerOpen] = useState(true)
  const [recordingMode, setRecordingMode] = useState(false)
  const [activeSceneId, setActiveSceneId] = useState(initialScripts[0].scenes[0].id)
  const [addPulse, setAddPulse] = useState({ x: 0, y: 0, show: false })

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const activeScript = useMemo(
    () => scripts.find((script) => script.id === activeScriptId) ?? scripts[0],
    [scripts, activeScriptId],
  )

  const updateActiveScript = (updater) => {
    setScripts((prev) => prev.map((s) => (s.id === activeScript.id ? updater(s) : s)))
  }

  const updateScene = (sceneId, patch) => {
    updateActiveScript((script) => ({
      ...script,
      scenes: script.scenes.map((scene) => (scene.id === sceneId ? { ...scene, ...patch } : scene)),
    }))
  }

  const addScene = (event) => {
    const x = event.clientX
    const y = event.clientY
    setAddPulse({ x, y, show: true })
    setTimeout(() => setAddPulse((prev) => ({ ...prev, show: false })), 420)

    updateActiveScript((script) => {
      const scene = createScene(script.scenes.length)
      setActiveSceneId(scene.id)
      return { ...script, scenes: [...script.scenes, scene] }
    })
  }

  const removeScene = (sceneId) => {
    updateActiveScript((script) => {
      const nextScenes = script.scenes.filter((scene) => scene.id !== sceneId)
      if (nextScenes.length) setActiveSceneId(nextScenes[0].id)
      return { ...script, scenes: nextScenes }
    })
  }

  const onDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    updateActiveScript((script) => {
      const oldIndex = script.scenes.findIndex((s) => s.id === active.id)
      const newIndex = script.scenes.findIndex((s) => s.id === over.id)
      return { ...script, scenes: arrayMove(script.scenes, oldIndex, newIndex) }
    })
  }

  const totalDuration = activeScript.scenes.reduce((sum, scene) => sum + estimateDuration(scene), 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/90 px-5 py-3 backdrop-blur">
        <div>
          <h1 className="text-lg font-semibold">YouTube Script Flow</h1>
          <p className="text-xs text-slate-400">Physical timeline UX + AI-ready scene versions</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRecordingMode((v) => !v)}
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
              recordingMode
                ? 'border-emerald-400/50 bg-emerald-500/20 text-emerald-100'
                : 'border-slate-700 bg-slate-800 text-slate-200'
            }`}
          >
            {recordingMode ? <Lock size={14} /> : <Unlock size={14} />}
            {recordingMode ? 'Recording mode ON' : 'Recording mode'}
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/50 bg-cyan-500/15 px-3 py-2 text-sm text-cyan-100 hover:bg-cyan-500/25"
            onClick={addScene}
          >
            <CirclePlus size={16} /> Add scene
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100"
            onClick={() => setDrawerOpen((v) => !v)}
          >
            Script drawer
            {drawerOpen ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>
      </header>

      <main className="relative flex h-[calc(100vh-64px)] overflow-hidden">
        <AnimatePresence>
          {drawerOpen && (
            <motion.aside
              initial={{ x: -360 }}
              animate={{ x: 0 }}
              exit={{ x: -360 }}
              transition={{ type: 'spring', damping: 14, stiffness: 160 }}
              className="z-20 w-[320px] shrink-0 border-r border-slate-800 bg-slate-950/90 p-4"
            >
              <h2 className="mb-3 text-sm font-semibold text-slate-200">Script drawer</h2>
              <div className="space-y-2">
                {scripts.map((script) => (
                  <button
                    key={script.id}
                    onClick={() => {
                      setActiveScriptId(script.id)
                      setActiveSceneId(script.scenes[0]?.id)
                    }}
                    className={`w-full rounded-xl border p-3 text-left ${
                      activeScriptId === script.id
                        ? 'border-cyan-400/60 bg-cyan-500/10'
                        : 'border-slate-800 bg-slate-900'
                    }`}
                  >
                    <p className="text-sm font-medium">{script.name}</p>
                    <p className="text-xs text-slate-400">Status: {script.status}</p>
                  </button>
                ))}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <section className="relative flex-1 overflow-auto p-5">
          <div className="mb-4 flex items-center justify-between text-sm text-slate-300">
            <p>
              Scenes: {activeScript.scenes.length} • Total duration: {formatSeconds(totalDuration)}
            </p>
            <p className="text-xs text-slate-400">Drag to reorder timeline columns.</p>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext
              items={activeScript.scenes.map((scene) => scene.id)}
              strategy={horizontalListSortingStrategy}
            >
              <motion.div layout className="flex min-w-max gap-4 pb-8">
                <AnimatePresence initial={false}>
                  {activeScript.scenes.map((scene, index) => (
                    <SceneCard
                      key={scene.id}
                      scene={scene}
                      index={index}
                      updateScene={updateScene}
                      removeScene={removeScene}
                      recordingMode={recordingMode}
                      isActive={activeSceneId === scene.id}
                      setActive={setActiveSceneId}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            </SortableContext>
          </DndContext>
        </section>

        {addPulse.show && (
          <motion.div
            initial={{ opacity: 0.8, scale: 0.7 }}
            animate={{ opacity: 0, scale: 2.2 }}
            transition={{ duration: 0.42 }}
            className="pointer-events-none absolute z-40 grid place-items-center rounded-full border border-cyan-300 bg-cyan-400/20"
            style={{ left: addPulse.x - 26, top: addPulse.y - 26, width: 52, height: 52 }}
          >
            <CirclePlus className="text-cyan-200" size={24} />
          </motion.div>
        )}
      </main>
    </div>
  )
}
