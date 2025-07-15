import { Square, Crown, TreePine, Wrench } from 'lucide-react'

const frames = [
  { key: 'none', label: 'None', icon: Square },
  { key: 'gold', label: 'Gold', icon: Crown },
  { key: 'wood', label: 'Wood', icon: TreePine },
  { key: 'metal', label: 'Metal', icon: Wrench },
]

function FrameSelector({ frame, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {frames.map(f => {
        const IconComponent = f.icon;
        return (
          <button
            key={f.key}
            className={`group relative p-3 rounded-xl border-2 font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
              frame === f.key
                ? 'bg-gradient-to-r from-primary to-primary-dark text-white border-primary shadow-lg scale-105'
                : 'bg-white/60 backdrop-blur-sm text-primary-dark border-gray-200 hover:border-primary hover:bg-white/80 shadow-sm'
            }`}
            onClick={() => onChange(f.key)}
          >
            <div className="flex flex-col items-center gap-2">
              <IconComponent className={`w-5 h-5 ${
                frame === f.key ? 'text-white' : getFrameIconColor(f.key)
              }`} />
              <span className="text-xs font-semibold uppercase tracking-wide">
                {f.label}
              </span>
            </div>
            {frame === f.key && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-primary-dark/20 animate-pulse"></div>
            )}
          </button>
        );
      })}
    </div>
  )
}

function getFrameIconColor(frameKey) {
  switch (frameKey) {
    case 'gold': return 'text-yellow-500 group-hover:text-yellow-600';
    case 'wood': return 'text-amber-600 group-hover:text-amber-700';
    case 'metal': return 'text-gray-500 group-hover:text-gray-600';
    default: return 'text-primary group-hover:text-primary-dark';
  }
}

export default FrameSelector