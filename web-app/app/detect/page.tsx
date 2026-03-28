'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CloudUpload, Camera, X, Circle, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import DiseaseResult from '@/components/DiseaseResult'
import { analyzeDisease } from '@/lib/backendApi'
import { DetectionResult } from '@/types'
import Image from 'next/image'

export default function DetectPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<DetectionResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isCameraOpen, setIsCameraOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) router.push('/login')
  }, [isAuthenticated, router])

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

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
      const detection = await analyzeDisease(formData)
      setResult(detection)
      toast.success('Analysis complete!')
    } catch (error) {
      console.error('[detect] Analysis failed', {
        fileName: file?.name,
        fileSize: file?.size,
        message: error instanceof Error ? error.message : String(error),
      })
      toast.error('Analysis failed. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleFeedback = async (positive: boolean) => {
    toast.success(positive ? 'Thanks for the feedback!' : 'Feedback recorded.')
  }

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
      })
      streamRef.current = stream
      setIsCameraOpen(true)
      // Assign stream to video element after state update renders the <video>
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      })
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Camera access denied. Please allow camera permissions.'
      )
    }
  }

  const capturePhoto = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob(
      (blob) => {
        if (!blob) return
        const captured = new File([blob], 'capture.jpg', { type: 'image/jpeg' })
        handleFile(captured)
        stopStream()
        setIsCameraOpen(false)
      },
      'image/jpeg',
      0.85
    )
  }

  const cancelCamera = () => {
    stopStream()
    setIsCameraOpen(false)
  }

  if (!isAuthenticated) return null

  return (
    <div className="flex flex-col gap-4 p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold pt-2" style={{ color: 'var(--color-neutral-900)' }}>Disease Detection</h1>
      <p className="text-sm" style={{ color: 'var(--color-neutral-500)' }}>Upload a photo of your crop leaf for AI analysis</p>

      {/* Hidden canvas used only for snapshot capture */}
      <canvas ref={canvasRef} className="hidden" />

      {!preview && isCameraOpen && (
        <div className="flex flex-col gap-3">
          <div className="relative rounded-xl overflow-hidden bg-black" style={{ maxHeight: '20rem' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full object-cover rounded-xl"
              style={{ maxHeight: '20rem' }}
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={capturePhoto}
              className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold text-white transition-opacity active:opacity-80"
              style={{ backgroundColor: '#16a34a' }}
            >
              <Circle size={16} />
              Capture
            </button>
            <button
              type="button"
              onClick={cancelCamera}
              className="flex items-center justify-center gap-2 h-11 px-5 rounded-xl text-sm font-semibold border-2 transition-opacity active:opacity-80"
              style={{ borderColor: 'var(--color-neutral-300)', color: 'var(--color-neutral-700)' }}
            >
              <XCircle size={16} />
              Cancel
            </button>
          </div>
        </div>
      )}

      {!preview && !isCameraOpen && (
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
            onClick={(e) => { e.stopPropagation(); openCamera() }}
          >
            <Camera size={16} />
            Take Photo
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
          />
        </div>
      )}

      {preview && (
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
          plant_identified={result.plant_identified}
          is_healthy={result.is_healthy}
          confidence={result.confidence}
          severity={result.severity}
          urgency={result.urgency}
          symptoms={result.symptoms}
          treatmentSteps={result.treatment_steps}
          prevention_tips={result.prevention_tips}
          additional_notes={result.additional_notes}
          onFeedback={handleFeedback}
        />
      )}
    </div>
  )
}
