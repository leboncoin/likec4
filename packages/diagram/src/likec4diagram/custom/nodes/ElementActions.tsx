// SPDX-License-Identifier: MIT
//
// Copyright (c) 2023-2026 Denis Davydkov
// Copyright (c) 2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
//
// Portions of this file have been modified by NVIDIA CORPORATION & AFFILIATES.

import { IconArrowUpRight, IconTransform, IconZoomScan } from '@tabler/icons-react'
import { type MouseEvent as ReactMouseEvent, useMemo } from 'react'
import { hasAtLeast } from 'remeda'
import type { SimplifyDeep } from 'type-fest'
import { ElementActionButtons } from '../../../base-primitives'
import type { BaseNodeData } from '../../../base/types'
import { useEnabledFeatures } from '../../../context/DiagramFeatures'
import { type CrossProjectNavigation, useCrossProjectNavigation } from '../../../hooks/useCrossProjectNavigation'
import { useDiagram } from '../../../hooks/useDiagram'
import { readableText } from '../../../utils'
import type { Types } from '../../types'

/**
 * Navigate buttons: to the view in this project, to the view in the project the element comes from,
 * or both when the local one goes to another view than the element's own (e.g. a flow).
 */
function navigateButtons(
  navigateLocally: ((e: ReactMouseEvent) => void) | null,
  crossProject: CrossProjectNavigation | null,
): ElementActionButtons.Item[] {
  if (crossProject?.replacesLocal) {
    return [{
      key: 'navigate',
      ariaLabel: 'Navigate to view in its project',
      icon: <IconZoomScan />,
      onClick: crossProject.onClick,
    }]
  }
  const buttons = [] as ElementActionButtons.Item[]
  if (navigateLocally) {
    buttons.push({
      key: 'navigate',
      ariaLabel: 'Navigate to view',
      icon: <IconZoomScan />,
      onClick: navigateLocally,
    })
  }
  if (crossProject) {
    buttons.push({
      key: 'navigate-project',
      ariaLabel: 'Navigate to view in its project',
      icon: <IconArrowUpRight />,
      onClick: crossProject.onClick,
    })
  }
  return buttons
}

type WithExtraButtons = {
  /**
   * Add extra action buttons
   * @example
   * ```tsx
   * <ElementActions
   *   extraButtons={[
   *     {
   *       key: 'extra',
   *       icon: <IconZoomScan />,
   *       onClick: (e) => {
   *         e.stopPropagation()
   *         console.log('extra action clicked')
   *       },
   *       },
   *     },
   *   ]}
   * />
   * ```
   */
  extraButtons?: ElementActionButtons.Item[]
}

export type ElementActionsProps =
  & SimplifyDeep<{
    selected?: boolean
    data: Pick<Types.ElementNodeData, 'id' | 'modelFqn' | 'navigateTo' | 'title'> & BaseNodeData
  }>
  & WithExtraButtons

/**
 * Center-Bottom action bar, includes zoom-in and browse relationships actions, if the features are enabled.
 * Intended to be used with model elements.
 *
 * Use generic {@link ElementActionButtons} for custom action buttons.
 *
 * @param extraButtons - Add extra action buttons
 *
 * @example
 * ```tsx
 * <ElementActions
 *   extraButtons={[
 *     {
 *       key: 'extra',
 *       icon: <IconZoomScan />,
 *       onClick: (e) => {
 *         e.stopPropagation()
 *         console.log('extra action clicked')
 *       },
 *       },
 *     },
 *   ]}
 * />
 * ```
 */
export function ElementActions({
  extraButtons,
  ...props
}: ElementActionsProps) {
  const { enableNavigateTo, enableRelationshipBrowser } = useEnabledFeatures()
  const diagram = useDiagram()
  const { id, navigateTo, modelFqn, title } = props.data
  const crossProject = useCrossProjectNavigation(modelFqn, navigateTo)
  let buttons = useMemo(() => {
    const labelTitle = readableText(title) || id
    const buttons = navigateButtons(
      navigateTo && enableNavigateTo
        ? (e) => {
          e.stopPropagation()
          diagram.navigateTo(navigateTo, id)
        }
        : null,
      crossProject,
    )
    if (enableRelationshipBrowser) {
      buttons.push({
        key: 'relationships',
        ariaLabel: `Browse ${labelTitle} relationships`,
        icon: <IconTransform />,
        onClick: (e) => {
          e.stopPropagation()
          diagram.openRelationshipsBrowser(modelFqn)
        },
      })
    }
    return buttons
  }, [enableNavigateTo, enableRelationshipBrowser, modelFqn, navigateTo, crossProject, id, title, diagram])

  if (extraButtons && hasAtLeast(extraButtons, 1)) {
    buttons = [...buttons, ...extraButtons]
  }

  // Spread all ReactFlow node props and override buttons with our computed buttons
  return <ElementActionButtons {...props} buttons={buttons} />
}

export type DeploymentElementActionsProps =
  & SimplifyDeep<{
    selected?: boolean
    data: Pick<Types.DeploymentElementNodeData, 'id' | 'modelFqn' | 'navigateTo' | 'title'> & BaseNodeData
  }>
  & WithExtraButtons

/**
 * Center-Bottom action bar, includes zoom-in and browse relationships actions, if the features are enabled.
 * Intended to be used with deployment elements.
 *
 * Use generic {@link ElementActionButtons} for custom action buttons.
 *
 * @param extraButtons - Add extra action buttons
 *
 * @example
 * ```tsx
 * <DeploymentElementActions
 *   extraButtons={[
 *     {
 *       key: 'extra',
 *       icon: <IconZoomScan />,
 *       onClick: (e) => {
 *         e.stopPropagation()
 *         console.log('extra action clicked')
 *       },
 *       },
 *     },
 *   ]}
 * />
 * ```
 */
export const DeploymentElementActions = ({
  extraButtons,
  ...props
}: DeploymentElementActionsProps) => {
  const { enableNavigateTo, enableRelationshipBrowser } = useEnabledFeatures()
  const diagram = useDiagram()
  const { id, navigateTo, modelFqn, title } = props.data
  const crossProject = useCrossProjectNavigation(modelFqn, navigateTo)

  let buttons = useMemo(() => {
    const labelTitle = readableText(title) || id
    const buttons = navigateButtons(
      navigateTo && enableNavigateTo
        ? (e) => {
          e.stopPropagation()
          diagram.navigateTo(navigateTo, id)
        }
        : null,
      crossProject,
    )
    if (enableRelationshipBrowser && !!modelFqn) {
      buttons.push({
        key: 'relationships',
        ariaLabel: `Browse ${labelTitle} relationships`,
        icon: <IconTransform />,
        onClick: (e) => {
          e.stopPropagation()
          diagram.openRelationshipsBrowser(modelFqn)
        },
      })
    }
    return buttons
  }, [enableNavigateTo, enableRelationshipBrowser, modelFqn, navigateTo, crossProject, id, title, diagram])

  if (extraButtons && hasAtLeast(extraButtons, 1)) {
    buttons = [...buttons, ...extraButtons]
  }

  // Spread all ReactFlow node props and override buttons with our computed buttons
  return <ElementActionButtons {...props} buttons={buttons} />
}
