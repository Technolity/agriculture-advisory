import api from '@/lib/axios'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Listing {
  id: string
  title: string
  description: string
  cropId: string
  cropName: string
  quantity: number
  unit: string
  pricePerUnit: number
  currency: string
  region: string
  city: string
  status: string
  images: string[]
  sellerName: string
  sellerId: string
  createdAt: string
}

export interface ListingsMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ListingsResponse {
  listings: Listing[]
  meta: ListingsMeta
}

export interface FetchListingsParams {
  region?: string
  cropId?: string
  minPrice?: number
  maxPrice?: number
  status?: string
  page?: number
  limit?: number
}

export interface CreateListingInput {
  title: string
  description: string
  cropId: string
  quantity: number
  unit: string
  pricePerUnit: number
  currency: string
  region: string
  city: string
  images?: string[]
}

type ApiSuccessResponse<T> = {
  success: true
  data: T
}

// ─── API functions ─────────────────────────────────────────────────────────────

export async function fetchListings(params?: FetchListingsParams): Promise<ListingsResponse> {
  const query = new URLSearchParams()
  if (params?.region) query.set('region', params.region)
  if (params?.cropId) query.set('cropId', params.cropId)
  if (params?.minPrice !== undefined) query.set('minPrice', String(params.minPrice))
  if (params?.maxPrice !== undefined) query.set('maxPrice', String(params.maxPrice))
  if (params?.status) query.set('status', params.status)
  if (params?.page !== undefined) query.set('page', String(params.page))
  if (params?.limit !== undefined) query.set('limit', String(params.limit))

  const qs = query.toString()
  const response = await api.get<ApiSuccessResponse<ListingsResponse>>(
    `/api/marketplace${qs ? `?${qs}` : ''}`
  )
  return response.data.data
}

export async function fetchListing(id: string): Promise<Listing> {
  const response = await api.get<ApiSuccessResponse<Listing>>(`/api/marketplace/${id}`)
  return response.data.data
}

export async function createListing(data: CreateListingInput): Promise<Listing> {
  const response = await api.post<ApiSuccessResponse<Listing>>('/api/marketplace', data)
  return response.data.data
}

export async function updateListing(
  id: string,
  data: Partial<CreateListingInput>
): Promise<Listing> {
  const response = await api.put<ApiSuccessResponse<Listing>>(`/api/marketplace/${id}`, data)
  return response.data.data
}

export async function deleteListing(id: string): Promise<void> {
  await api.delete(`/api/marketplace/${id}`)
}

export async function contactSeller(id: string): Promise<{ phone: string; email: string }> {
  const response = await api.post<ApiSuccessResponse<{ contactInfo: { phone: string; email: string } }>>(
    `/api/marketplace/${id}/contact`
  )
  return response.data.data.contactInfo
}
