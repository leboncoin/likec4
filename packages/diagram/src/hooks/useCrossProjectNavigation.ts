import type { Fqn, ViewId } from '@likec4/core/types'
import { type MouseEvent as ReactMouseEvent, useMemo } from 'react'
import { useDiagramEventHandlers } from '../context/DiagramEventHandlers'
import { useOptionalLikeC4Model } from '../context/LikeC4ModelContext'
import { crossProjectTarget } from '../utils/crossProjectTarget'

export type CrossProjectNavigation = {
  onClick: (event: ReactMouseEvent) => void
  /**
   * True when the element has no navigation of its own here, or only to the view of itself in
   * this project (a neighbour view): the view in its project replaces it.
   * False when it navigates to another view (e.g. a flow), kept next to this one.
   */
  replacesLocal: boolean
}

/**
 * Navigation to the view of another project the element links to,
 * or null when there is none (or no `onNavigateToProject` handler).
 */
export function useCrossProjectNavigation(
  modelFqn: Fqn | null | undefined,
  navigateTo: ViewId | null | undefined,
): CrossProjectNavigation | null {
  const { onNavigateToProject } = useDiagramEventHandlers()
  const model = useOptionalLikeC4Model()

  return useMemo(() => {
    if (!onNavigateToProject || !model || !modelFqn) {
      return null
    }
    const element = model.findElement(modelFqn)
    const target = element ? crossProjectTarget(element, model.projectId) : null
    if (!target) {
      return null
    }
    return {
      onClick: (event: ReactMouseEvent) => {
        event.stopPropagation()
        onNavigateToProject(target, event)
      },
      replacesLocal: !navigateTo || model.findView(navigateTo)?.viewOf?.id === modelFqn,
    }
  }, [onNavigateToProject, model, modelFqn, navigateTo])
}
