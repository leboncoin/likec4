---
'@likec4/diagram': minor
'@likec4/spa': minor
---

Navigate to a view of another project

`navigateTo` cannot target a view of another project. When the new `onNavigateToProject` handler is
set, an element carrying a link to a view of another project (`/project/<id>/view/<view>/`, e.g. an
imported element linking to the view of its system in its own project) navigates there, on leaf,
compound and deployment nodes:

- with no navigation in the current project, or only to its own view there (`view x of x`, a local
  view of a neighbour): the navigate button opens the view in its project instead;
- with navigation to another view (e.g. a flow): that button stays, next to a second one opening
  the view in its project.

The app opens that view, focused on the element when it comes from that project.
