'use client'

interface LanguageSelectorProps {
  selected: 'en' | 'ur' | 'pa'
  onChange: (lang: 'en' | 'ur' | 'pa') => void
}

const languages = [
  { code: 'en' as const, label: 'English' },
  { code: 'ur' as const, label: 'اردو' },
  { code: 'pa' as const, label: 'ਪੰਜਾਬੀ' },
]

export default function LanguageSelector({ selected, onChange }: LanguageSelectorProps) {
  return (
    <div className="flex gap-2 rounded-xl p-1" style={{ backgroundColor: 'var(--color-neutral-100)' }}>
      {languages.map((lang) => {
        const isActive = selected === lang.code
        return (
          <button
            key={lang.code}
            onClick={() => onChange(lang.code)}
            className="flex-1 h-11 rounded-lg text-sm font-semibold transition-all"
            style={{
              backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-white)',
              color: isActive ? 'var(--color-white)' : 'var(--color-neutral-700)',
              border: isActive ? 'none' : '1px solid var(--color-neutral-200)',
            }}
          >
            {lang.label}
          </button>
        )
      })}
    </div>
  )
}
