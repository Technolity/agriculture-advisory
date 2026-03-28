'use client'
import { ThumbsUp, ThumbsDown, Circle } from 'lucide-react'

interface DiseaseResultProps {
  disease: string
  confidence: number
  severity?: 'LOW' | 'MEDIUM' | 'HIGH'
  symptoms?: string[]
  treatmentSteps?: string[]
  onFeedback?: (positive: boolean) => void
}

const severityColors: Record<string, { bg: string; text: string }> = {
  HIGH: { bg: 'var(--color-danger-light)', text: 'var(--color-danger)' },
  MEDIUM: { bg: 'var(--color-accent-light)', text: 'var(--color-accent)' },
  LOW: { bg: 'var(--color-primary-pale)', text: 'var(--color-primary)' },
}

export default function DiseaseResult({
  disease,
  confidence,
  severity = 'HIGH',
  symptoms = ['Dark brown spots on leaves', 'White mold on undersides', 'Rapid leaf wilting'],
  treatmentSteps = ['Remove all affected leaves immediately', 'Apply copper-based fungicide', 'Re-inspect after 3 days'],
  onFeedback,
}: DiseaseResultProps) {
  const sev = severityColors[severity] || severityColors.HIGH

  return (
    <div
      className="rounded-xl flex flex-col gap-4 p-4"
      style={{ backgroundColor: 'var(--color-white)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold" style={{ color: 'var(--color-danger)' }}>{disease}</span>
        <div
          className="flex items-center px-2.5 h-6 rounded-full text-xs font-semibold"
          style={{ backgroundColor: 'var(--color-primary-pale)', color: 'var(--color-primary)' }}
        >
          {Math.round(confidence * 100)}% Confident
        </div>
      </div>

      {/* Severity */}
      <div className="flex items-center gap-2">
        <span className="text-sm" style={{ color: 'var(--color-neutral-500)' }}>Severity</span>
        <div
          className="flex items-center px-2.5 h-6 rounded-full text-xs font-bold"
          style={{ backgroundColor: sev.bg, color: sev.text }}
        >
          {severity}
        </div>
      </div>

      {/* Symptoms */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold tracking-wide" style={{ color: 'var(--color-neutral-500)', letterSpacing: '0.05em' }}>
          SYMPTOMS DETECTED
        </span>
        {symptoms.map((s) => (
          <div key={s} className="flex items-center gap-2">
            <Circle size={6} style={{ color: 'var(--color-neutral-400)', fill: 'var(--color-neutral-400)' }} />
            <span className="text-sm" style={{ color: 'var(--color-neutral-700)' }}>{s}</span>
          </div>
        ))}
      </div>

      {/* Treatment */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold tracking-wide" style={{ color: 'var(--color-neutral-500)', letterSpacing: '0.05em' }}>
          TREATMENT PLAN
        </span>
        {treatmentSteps.map((step, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div
              className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: 'var(--color-primary-pale)', color: 'var(--color-primary)' }}
            >
              {i + 1}
            </div>
            <span className="text-sm" style={{ color: 'var(--color-neutral-700)' }}>{step}</span>
          </div>
        ))}
      </div>

      {/* Feedback */}
      <div className="flex items-center gap-3">
        <span className="text-xs" style={{ color: 'var(--color-neutral-500)' }}>Was this accurate?</span>
        <button onClick={() => onFeedback?.(true)} className="p-1 hover:opacity-70">
          <ThumbsUp size={20} style={{ color: 'var(--color-neutral-400)' }} />
        </button>
        <button onClick={() => onFeedback?.(false)} className="p-1 hover:opacity-70">
          <ThumbsDown size={20} style={{ color: 'var(--color-neutral-400)' }} />
        </button>
        <button
          className="ml-auto text-xs font-medium"
          style={{ color: 'var(--color-primary)' }}
        >
          Report incorrect
        </button>
      </div>
    </div>
  )
}
