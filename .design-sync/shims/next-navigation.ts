// Shim next/navigation — hooks no-op cho môi trường ngoài Next router.
export const usePathname = () => '/'
export const useRouter = () => ({
  push: () => {},
  replace: () => {},
  back: () => {},
  forward: () => {},
  refresh: () => {},
  prefetch: () => {},
})
export const useSearchParams = () => new URLSearchParams()
export const useParams = () => ({})
export const useSelectedLayoutSegment = () => null
export const useSelectedLayoutSegments = () => []
export const redirect = () => {}
export const notFound = () => {}
