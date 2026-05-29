// Base URL of the call-analysis backend. Override with VITE_ANALYSIS_API.
export const ANALYSIS_API =
  import.meta.env.VITE_ANALYSIS_API || 'http://localhost:8787'
