# TJE portfolio

## Structure

```text
docs/
  index.html           Page structure
  assets/style.css     Colours, typography, responsive card layout
  assets/app.js        JSON loading, search, category and status filters
  data/projects.json   Site text and project entries
  TEMPLATE.md          Template recommendation and publishing options
```

## JSON format for the projects

This is in file `data/projects.json`. Meaning of the fields:

| Field | Meaning |
| --- | --- |
| `id` | Unique stable slug, e.g. `Doc4TF` |
| `title` | Display name |
| `summary` | Short description of purpose and outcome |
| `category` | My own grouping; category filters are generated automatically |
| `status` | `planned`, `active`, `available`, `completed`, or `archived` |
| `tags` | Array of technologies or topics |
| `featured` | `true` to highlight and sort first; otherwise `false` |
| `url` | Public project/demo URL, or empty string |
| `repository` | Public source URL, or empty string |

The githubpage reloads the JSON on each visit; editing it does not require changing the rendering code.

The starter uses a dark view withlime accents, responsive project cards, featured entries, and combined search/category/status filters. Fonts load from Google Fonts with local sans-serif fallbacks.

## Logos and publications

Each project can include these optional fields:

```json
"logo": {
  "src": "assets/logos/project_logo.png",
  "alt": "Project logo"
},
"resources": [
  {
    "title": "Project description",
    "url": "https://www.academia.edu/tonyjurg/....",
    "type": "Paper · Academia"
  },
  {
    ...
  }
]
```
