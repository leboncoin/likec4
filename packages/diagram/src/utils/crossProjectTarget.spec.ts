import { describe, expect, it } from 'vitest'
import { crossProjectTarget } from './crossProjectTarget'

describe('crossProjectTarget', () => {
  it('targets the view of the project an imported element comes from, focused on it', () => {
    const element = {
      id: '@other-squads.adlife.pintad',
      links: [
        { url: 'https://backstage.example.com/catalog/pintad', title: 'Backstage' },
        { url: '/project/other-squads/view/adlife/', title: 'squad-adlife overview' },
      ],
    }
    expect(crossProjectTarget(element, 'datatools-immo')).toEqual({
      projectId: 'other-squads',
      viewId: 'adlife',
      focusOnElement: 'adlife.pintad',
    })
  })

  it('accepts a link without trailing slash, with a query or a hash', () => {
    const target = (url: string) => crossProjectTarget({ id: '@maps.maps', links: [{ url }] }, 'iss')
    expect(target('/project/maps/view/maps')?.viewId).toBe('maps')
    expect(target('/project/maps/view/maps/?theme=dark')?.viewId).toBe('maps')
    expect(target('/project/maps/view/maps#top')?.viewId).toBe('maps')
  })

  it('skips links to the current project', () => {
    const element = {
      id: 'datatools.adScoring',
      links: [{ url: '/project/datatools-immo/view/adScoring/' }],
    }
    expect(crossProjectTarget(element, 'datatools-immo')).toBeNull()
  })

  it('does not focus when the link points to a project the element does not come from', () => {
    const element = { id: 'datatools', links: [{ url: '/project/rebs/view/rebs/' }] }
    expect(crossProjectTarget(element, 'datatools-immo')).toEqual({
      projectId: 'rebs',
      viewId: 'rebs',
      focusOnElement: null,
    })
  })

  it('ignores other links', () => {
    const element = {
      id: '@maps.maps',
      links: [{ url: 'https://example.com/project/maps/view/maps/' }, { url: '/project/maps/' }],
    }
    expect(crossProjectTarget(element, 'iss')).toBeNull()
  })
})
