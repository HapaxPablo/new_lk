export interface IPlaylistFile {
  id: string
  name?: string
  url?: string
}

export interface IPlaylist {
  id: string
  name: string
  description?: string
  files_count?: number
  files?: IPlaylistFile[] | string[]
  created?: string
  owner?: {
    full_name?: string
  }
}

export interface IPlaylistsListResponse {
  count: number
  next: string | null
  previous: string | null
  results: IPlaylist[]
}

export interface IPlaylistDetailResponse extends IPlaylist {
  files: IPlaylistFile[]
}
