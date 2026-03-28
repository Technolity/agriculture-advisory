'use client'
import { ThumbsUp, ThumbsDown, Circle, Leaf, Shield, Clock, Info, ChevronRight } from 'lucide-react'

interface DiseaseResultProps {
  disease: string
  plant_identified?: string
  is_healthy?: boolean
  confidence: number
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'NONE'
  urgency?: 'immediate' | 'within_week' | 'routine' | 'none'
  symptoms?: string[]
  treatmentSteps?: string[]
  prevention_tips?: string[]
  additional_notes?: string
  onFeedback?: (positive: boolean) => void
}

const severityConfig = {
  HIGH:   { bg: 'var(--color-danger-light)',   text: 'var(--color-danger)',        label: 'High' },
  MEDIUM: { bg: 'var(--color-accent-light)',   text: 'var(--color-accent)',        label: 'Medium' },
  LOW:    { bg: 'var(--color-primary-pale)',   text: 'var(--color-primary)',       label: 'Low' },
  NONE:   { bg: 'var(--color-primary-pale)',   text: 'var(--color-primary-light)', label: 'None' },
}

const urgencyConfig = {
  immediate:   { label: 'Treat immediately',    color: 'var(--color-danger)' },
  within_week: { label: 'Treat within 7 days',  color: 'var(--color-accent)' },
  routine:     { label: 'Routine care',          color: 'var(--color-primary)' },
  none:        { label: 'No treatment needed',   color: 'var(--color-primary-light)' },
}

export default function DiseaseResult({
  disease,
  plant_identified,
  is_healthy = false,
  confidence,
  severity,
  urgency,
  symptoms = [],
  treatmentSteps = [],
  prevention_tips = [],
  additional_notes,
  onFeedback,
}: DiseaseResultProps) {
  const sev = severityConfig[severity ?? 'LOW']
  const urg = urgency ? urgencyConfig[urgency] : null
  const confidencePct = Math.round(confidence * 100)

  return (
    <div className="flex flex-col gap-3">
      {/* Plant ID + Health banner */}
      <div
        className="rounded-xl p-4 flex items-center gap-3"
        style={{ backgroundColor: is_healthy ? 'var(--color-primary-pale)' : 'var(--color-danger-light)' }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: is_healthy ? 'var(--color-primary)' : 'var(--color-danger)' }}
        >
          <Leaf size={20} color="white" />
        </div>
        <div className="flex-1 min-w-0">
          {plant_identified && plant_identified !== 'Unknown' && (
            <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--color-neutral-500)' }}>
              Identified: {plant_identified}
            </p>
          )}
          <p className="text-base font-bold truncate" style={{ color: is_healthy ? 'var(--color-primary)' : 'var(--color-danger)' }}>
            {disease}
          </p>
        </div>
        <div
          className="px-2.5 h-7 rounded-full flex items-center text-xs font-bold flex-shrink-0"
          style={{ backgroundColor: 'rgba(0,0,0,0.08)', color: is_healthy ? 'var(--color-primary)' : 'var(--color-danger)' }}
        >
          {confidencePct}%
        </div>
      </div>

      {/* Severity + Urgency row */}
      {(severity && severity !== 'NONE') || urg ? (
        <div className="flex gap-2">
          {severity && severity !== 'NONE' && (
            <div
              className="flex-1 rounded-xl p-3 flex flex-col gap-1"
              style={{ backgroundColor: 'var(--color-white)' }}
            >
              <span className="text-xs" style={{ color: 'var(--color-neutral-500)' }}>Severity</span>
              <span className="text-sm font-bold" style={{ color: sev.text }}>{sev.label}</span>
            </div>
          )}
          {urg && urgency !== 'none' && (
            <div
              className="flex-1 rounded-xl p-3 flex flex-col gap-1"
              style={{ backgroundColor: 'var(--color-white)' }}
            >
              <div className="flex items-center gap-1">
                <Clock size={10} style={{ color: 'var(--color-neutral-500)' }} />
                <span className="text-xs" style={{ color: 'var(--color-neutral-500)' }}>Urgency</span>
              </div>
              <span className="text-sm font-bold" style={{ color: urg.color }}>{urg.label}</span>
            </div>
          )}
        </div>
      ) : null}

      {/* Main card */}
      <div className="rounded-xl flex flex-col gap-4 p-4" style={{ backgroundColor: 'var(--color-white)' }}>

        {/* Symptoms */}
        {symptoms.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold tracking-wide" style={{ color: 'var(--color-neutral-500)', letterSpacing: '0.05em' }}>
              SYMPTOMS DETECTED
            </span>
            {symptoms.map((s, i) => (
              <div key={i} className="flex items-start gap-2">
                <Circle size={6} className="mt-1.5 flex-shrink-0" style={{ color: 'var(--color-danger)', fill: 'var(--color-danger)' }} />
                <span className="text-sm" style={{ color: 'var(--color-neutral-700)' }}>{s}</span>
              </div>
            ))}
          </div>
        )}

        {/* Treatment steps */}
        {treatmentSteps.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold tracking-wide" style={{ color: 'var(--color-neutral-500)', letterSpacing: '0.05em' }}>
              TREATMENT PLAN
            </span>
            {treatmentSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div
                  className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: 'var(--color-primary-pale)', color: 'var(--color-primary)' }}
                >
                  {i + 1}
                </div>
                <span className="text-sm" style={{ color: 'var(--color-neutral-700)' }}>{step}</span>
              </div>
            ))}
          </div>
        )}

        {/* Prevention tips */}
        {prevention_tips.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <Shield size={12} style={{ color: 'var(--color-primary)' }} />
              <span className="text-xs font-semibold tracking-wide" style={{ color: 'var(--color-neutral-500)', letterSpacing: '0.05em' }}>
                PREVENTION
              </span>
            </div>
            {prevention_tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <ChevronRight size={14} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                <span className="text-sm" style={{ color: 'var(--color-neutral-700)' }}>{tip}</span>
              </div>
            ))}
          </div>
        )}

        {/* Additional notes */}
        {additional_notes && (
          <div
            className="flex items-start gap-2.5 rounded-lg p-3"
            style={{ backgroundColor: 'var(--color-neutral-100)' }}
          >
            <Info size={14} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--color-neutral-500)' }} />
            <span className="text-xs" style={{ color: 'var(--color-neutral-600)' }}>{additional_notes}</span>
          </div>
        )}

        {/* Feedback */}
        <div className="flex items-center gap-3 pt-1 border-t" style={{ borderColor: 'var(--color-neutral-100)' }}>
          <span className="text-xs" style={{ color: 'var(--color-neutral-500)' }}>Was this accurate?</span>
          <button onClick={() => onFeedback?.(true)} className="p-1 hover:opacity-70 transition-opacity">
            <ThumbsUp size={18} style={{ color: 'var(--color-neutral-400)' }} />
          </button>
          <button onClick={() => onFeedback?.(false)} className="p-1 hover:opacity-70 transition-opacity">
            <ThumbsDown size={18} style={{ color: 'var(--color-neutral-400)' }} />
          </button>
        </div>
      </div>
    </div>
  )
}
