'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CloudUpload, Camera, X } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import DiseaseResult from '@/components/DiseaseResult'
import api from '@/lib/axios'
import { DetectionResult } from '@/types'
import Image from 'next/image'

export default function DetectPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<DetectionResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) router.push('/login')
  }, [isAuthenticated, router])

  const handleFile = (f: File) => {
    setFile(f)
    setResult(null)
    const url = URL.createObjectURL(f)
    setPreview(url)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f && f.type.startsWith('image/')) handleFile(f)
  }

  const handleAnalyze = async () => {
    if (!file) return
    setIsAnalyzing(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await api.post('/api/diseases/detect', formData)
      setResult(res.data)
      toast.success('Analysis complete!')
    } catch {
      toast.error('Analysis failed. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleFeedback = async (positive: boolean) => {
    toast.success(positive ? 'Thanks for the feedback!' : 'Feedback recorded.')
  }

  if (!isAuthenticated) return null

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold pt-2" style={{ color: 'var(--color-neutral-900)' }}>Disease Detection</h1>
      <p className="text-sm" style={{ color: 'var(--color-neutral-500)' }}>Upload a photo of your crop leaf for AI analysis</p>

      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex flex-col items-center justify-center gap-4 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-colors hover:bg-green-50"
          style={{ borderColor: 'var(--color-primary-light)', backgroundColor: 'var(--color-white)' }}
          onClick={() => fileInputRef.current?.click()}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-primary-pale)' }}
          >
            <CloudUpload size={32} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold" style={{ color: 'var(--color-neutral-900)' }}>Drag & drop your photo here</p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-neutral-500)' }}>or tap to browse — JPG, PNG supported</p>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 h-10 px-5 rounded-lg text-sm font-semibold text-white"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <Camera size={16} />
            Take Photo
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="relative rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--color-white)' }}>
            <Image src={preview} alt="Crop preview" width={600} height={300} className="w-full object-cover rounded-xl" style={{ maxHeight: 280 }} />
            <button
              onClick={() => { setPreview(null); setFile(null); setResult(null) }}
              className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            >
              <X size={16} color="white" />
            </button>
          </div>

          {!result && (
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full h-12 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-70"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Disease'}
            </button>
          )}
        </div>
      )}

      {result && (
        <DiseaseResult
          disease={result.disease}
          confidence={result.confidence}
          severity={result.severity}
          symptoms={result.symptoms}
          treatmentSteps={result.treatment_steps}
          onFeedback={handleFeedback}
        />
      )}
    </div>
  )
}
