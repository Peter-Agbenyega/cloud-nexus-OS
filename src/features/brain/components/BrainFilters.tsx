import { brainCategories, type BrainCategory } from '../brain.types'

type BrainFiltersProps = {
  activeCategory: BrainCategory | 'All'
  onSelect: (category: BrainCategory | 'All') => void
}

export function BrainFilters({ activeCategory, onSelect }: BrainFiltersProps) {
  return (
    <div className="brain-filters" role="tablist" aria-label="Brain categories">
      {(['All', ...brainCategories] as const).map((category) => {
        const isActive = category === activeCategory

        return (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`brain-filter ${isActive ? 'is-active' : ''}`}
            onClick={() => onSelect(category)}
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}
