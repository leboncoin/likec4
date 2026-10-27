// SPDX-License-Identifier: MIT
//
// Copyright (c) 2023-2026 Denis Davydkov
// Copyright (c) 2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
//
// Portions of this file have been modified by NVIDIA CORPORATION & AFFILIATES.

import type { NodeId } from '@likec4/core'
import { IconArrowUpRight } from '@tabler/icons-react'
import { CompoundActionButton } from '../../../base-primitives'
import { useEnabledFeatures } from '../../../context/DiagramFeatures'
import { useCrossProjectNavigation } from '../../../hooks/useCrossProjectNavigation'
import { useDiagram } from '../../../hooks/useDiagram'
import type { Types } from '../../types'

type CompoundActionsProps = Types.NodeProps<'compound-deployment' | 'compound-element'>

export const CompoundActions = (props: CompoundActionsProps) => {
  const { enableNavigateTo } = useEnabledFeatures()
  const diagram = useDiagram()

  const { navigateTo, modelFqn } = props.data
  const crossProject = useCrossProjectNavigation(modelFqn, navigateTo)
  if (crossProject?.replacesLocal) {
    return (
      <CompoundActionButton
        ariaLabel="Navigate to view in its project"
        onClick={crossProject.onClick}
        {...props}
      />
    )
  }
  const navigateLocally = !!navigateTo && enableNavigateTo
  if (!navigateLocally && !crossProject) {
    return null
  }
  return (
    <>
      {navigateLocally && (
        <CompoundActionButton
          ariaLabel="Navigate to view"
          onClick={(e) => {
            e.stopPropagation()
            diagram.navigateTo(navigateTo, props.id as NodeId)
          }}
          {...props}
        />
      )}
      {crossProject && (
        <CompoundActionButton
          ariaLabel="Navigate to view in its project"
          icon={<IconArrowUpRight stroke={2} />}
          onClick={crossProject.onClick}
          {...props}
        />
      )}
    </>
  )
}
