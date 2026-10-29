import { LikeC4ProjectsOverview, useChangeLikeC4Project } from '@likec4/diagram'
import { Divider } from '@mantine/core'
import { useLikeC4ProjectsOverview } from 'likec4:projects-overview'
import { ColorSchemeToggle } from '../components/ColorSchemeToggle'
import { NavigationPanel } from '../components/NavigationPanel'
import { SelectProject } from '../components/view-page/SelectProject'

export function ProjectsOverviewPage() {
  const changeProject = useChangeLikeC4Project()
  const projectsOverview = useLikeC4ProjectsOverview()
  return (
    <>
      <LikeC4ProjectsOverview
        view={projectsOverview}
        onNavigateToProject={changeProject}
      />
      <NavigationPanel.Root panelPosition="right" hideBelow={'md'}>
        <NavigationPanel.Body gap={'1'}>
          <SelectProject />
          <Divider orientation="vertical" visibleFrom="md" />
          <ColorSchemeToggle />
        </NavigationPanel.Body>
      </NavigationPanel.Root>
    </>
  )
}
