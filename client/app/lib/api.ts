function getApiUrl(): string {
  // Use environment variable if available (for production)
  // NEXT_PUBLIC_ prefix makes it available in the browser
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  
  if (apiUrl) {
    return apiUrl
  }
  
  // For local development
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:4002'
    }
  }
  
  // Fallback for local development
  return 'http://localhost:4002'
}

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const API_URL = getApiUrl()
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(error.error || `Request failed: ${response.status} ${response.statusText}`)
    }
    return response.json()
  } catch (error: any) {
    if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
      console.error('API Request failed:', { url: `${API_URL}${endpoint}`, apiUrl: API_URL, hostname: typeof window !== 'undefined' ? window.location.hostname : 'server' })
      throw new Error(`Cannot connect to backend at ${API_URL}. Please check your backend service is running.`)
    }
    throw error
  }
}