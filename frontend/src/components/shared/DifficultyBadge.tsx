import { Badge } from '@/components/ui/badge'
import { difficultyLabels } from '@/lib/labels'
import type { TechnologyDifficulty } from '@/types/enums'

export function DifficultyBadge({ difficulty }: { difficulty: TechnologyDifficulty }) {
  return <Badge variant="outline">{difficultyLabels[difficulty]}</Badge>
}
