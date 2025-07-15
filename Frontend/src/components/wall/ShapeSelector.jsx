import { Square, Circle, Octagon, MoreHorizontal } from 'lucide-react'

function ShapeSelector({ shape, onChange }) {
  const shapes = [
    { key: 'square', label: 'Square', icon: Square },
    { key: 'circle', label: 'Circle', icon: Circle },
    { key: 'rounded', label: 'Rounded', icon: Octagon },
    { key: 'oval', label: 'Oval', icon: MoreHorizontal },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {shapes.map(s => {
        const IconComponent = s.icon;
        return (
          <button
            key={s.key}
            className={`group relative p-3 rounded-xl border-2 font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
              shape === s.key
                ? 'bg-gradient-to-r from-primary to-primary-dark text-white border-primary shadow-lg scale-105'
                : 'bg-white/60 backdrop-blur-sm text-primary-dark border-gray-200 hover:border-primary hover:bg-white/80 shadow-sm'
            }`}
            onClick={() => onChange(s.key)}
          >
            <div className="flex flex-col items-center gap-2">
              <IconComponent className={`w-5 h-5 ${
                shape === s.key ? 'text-white' : 'text-primary group-hover:text-primary-dark'
              }`} />
              <span className="text-xs font-semibold uppercase tracking-wide">
                {s.label}
              </span>
            </div>
            {shape === s.key && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-primary-dark/20 animate-pulse"></div>
            )}
          </button>
        );
      })}
    </div>
  )
}

export default ShapeSelector