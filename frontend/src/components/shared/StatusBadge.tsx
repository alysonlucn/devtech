import { Badge } from '@/components/ui/badge'
import { progressStatusLabels } from '@/lib/labels'
import type { ProgressStatus } from '@/types/enums'

const variantMap: Record<ProgressStatus, 'secondary' | 'warning' | 'default' | 'success'> = {
  NOT_STARTED: 'secondary',
  IN_PROGRESS: 'warning',
  READY_FOR_ASSESSMENT: 'default',
  VALIDATED: 'success',
}

export function StatusBadge({ status }: { status: ProgressStatus }) {
  return <Badge variant={variantMap[status]}>{progressStatusLabels[status]}</Badge>
}
