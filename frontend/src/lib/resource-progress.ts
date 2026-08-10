const STORAGE_KEY = 'devtech_opened_resources'

type OpenedMap = Record<string, string[]>

function readMap(): OpenedMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return {}
    return parsed as OpenedMap
  } catch {
    return {}
  }
}

function writeMap(map: OpenedMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
}

export function getOpenedResourceIds(technologyId: string): string[] {
  return readMap()[technologyId] ?? []
}

export function markResourceOpened(technologyId: string, resourceId: string): string[] {
  const map = readMap()
  const current = new Set(map[technologyId] ?? [])
  current.add(resourceId)
  const next = Array.from(current)
  map[technologyId] = next
  writeMap(map)
  return next
}

export function isResourceOpened(technologyId: string, resourceId: string): boolean {
  return getOpenedResourceIds(technologyId).includes(resourceId)
}
