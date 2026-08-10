import { Badge } from '@/components/ui/badge'
import { categoryLabels } from '@/lib/labels'
import type { TechnologyCategory } from '@/types/enums'

export function CategoryBadge({ category }: { category: TechnologyCategory }) {
  return <Badge variant="secondary">{categoryLabels[category]}</Badge>
}
