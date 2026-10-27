import { type Fqn, type Link, type ProjectId, type ViewId, splitGlobalFqn } from '@likec4/core/types'

export type CrossProjectTarget = {
  projectId: ProjectId
  viewId: ViewId
  /**
   * Element to focus on the target view, when the link points to the project the element comes from
   */
  focusOnElement: Fqn | null
}

const projectViewLink = /^\/project\/([^/?#]+)\/view\/([^/?#]+)\/?(?:[?#].*)?$/

/**
 * Finds the first link of the element to a view of another project (`/project/<id>/view/<view>/`).
 */
export function crossProjectTarget(
  element: { id: string; links: ReadonlyArray<Link> },
  currentProjectId: string,
): CrossProjectTarget | null {
  const [ownerProjectId, fqn] = splitGlobalFqn(element.id as Fqn)
  for (const { url } of element.links) {
    const match = projectViewLink.exec(url)
    if (!match) {
      continue
    }
    const projectId = decodeURIComponent(match[1]!) as ProjectId
    if (projectId === currentProjectId) {
      continue
    }
    return {
      projectId,
      viewId: decodeURIComponent(match[2]!) as ViewId,
      focusOnElement: ownerProjectId === projectId ? fqn : null,
    }
  }
  return null
}
