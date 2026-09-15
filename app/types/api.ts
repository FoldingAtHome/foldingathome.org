// Matches the response shape of fah-cms procs (see ~/projects/fah-cms/api/).
// Authors are joined onto the article row as flat `author_*` columns.

export type Status = 'draft' | 'published' | 'archived'

export interface ArticleListItem {
  id: number
  slug: string
  title: string
  excerpt?: string | null
  hero?: string | null
  status: Status
  published?: string | null
  created: string
  updated: string
  author_id?: number | null
  author?: string | null
}

export interface Article extends ArticleListItem {
  body?: string | null
  author_affiliation?: string | null
  author_url?: string | null
}

export interface Paper {
  id: number
  pmid?: string | null
  doi?: string | null
  title: string
  authors?: string | null
  abstract?: string | null
  journal?: string | null
  year?: number | null
  published?: string | null
  url?: string | null
  source_lab?: string | null
  fah_confirmed: boolean
}

export interface AssetMeta {
  id: string
  filename: string
  mime_type: string
  size: number
  alt_text?: string | null
  created: string
  updated: string
}

export interface Author {
  id: number
  name: string
  affiliation?: string | null
  url?: string | null
}
