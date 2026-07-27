'use client'

import { useMemo, useState } from 'react'
import { IPlaylistFile } from '@/types/playlists'

const getFilePreviewType = (url: string, name?: string) => {
  const cleanedUrl = url.split('?')[0].split('#')[0]
  const extension =
    cleanedUrl.split('.').pop()?.toLowerCase() ||
    name?.split('.').pop()?.toLowerCase() ||
    ''

  if (['mp4', 'webm', 'ogg', 'mov', 'mkv'].includes(extension)) {
    return 'video'
  }
  if (['mp3', 'wav', 'm4a', 'oga', 'aac'].includes(extension)) {
    return 'audio'
  }
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
    return 'image'
  }
  return 'file'
}

const formatFileName = (name: string) => name.replace(/_/g, ' ')

export function PlaylistDetailPreview({ files }: { files: IPlaylistFile[] }) {
  const [selectedId, setSelectedId] = useState(files[0]?.id ?? '')

  const selectedFile = useMemo(
    () => files.find((file) => file.id === selectedId) ?? files[0],
    [files, selectedId]
  )

  const previewType = useMemo(
    () =>
      selectedFile?.url
        ? getFilePreviewType(selectedFile.url, selectedFile.name)
        : 'file',
    [selectedFile]
  )

  return (
    <div className="flex gap-6 w-full">
      <div className="space-y-4 w-full">
        <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold">Файлы плейлиста</h3>
          <p className="mt-2 text-sm text-gray-600">
            Нажмите на файл, чтобы посмотреть содержимое прямо на странице.
          </p>
        </div>

        <div className="space-y-3 overflow-auto max-h-[calc(100vh-600px)] w-full">
          {files.map((file) => {
            const isActive = file.id === selectedFile?.id
            const filePreviewType = file.url
              ? getFilePreviewType(file.url, file.name)
              : 'file'

            return (
              <button
                key={file.id}
                type="button"
                onClick={() => setSelectedId(file.id)}
                className={`w-full rounded-3xl border px-4 py-4 text-left transition ${
                  isActive
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {file.name ? formatFileName(file.name) : file.id}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {filePreviewType === 'video'
                        ? 'Видео'
                        : filePreviewType === 'audio'
                          ? 'Аудио'
                          : filePreviewType === 'image'
                            ? 'Изображение'
                            : 'Файл'}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {isActive ? 'Выбран' : 'Просмотр'}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="rounded-4xl border border-gray-200 bg-white p-6 shadow-sm h-full w-full">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Предпросмотр файла
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {selectedFile?.name
                ? formatFileName(selectedFile.name)
                : 'Без названия'}
            </p>
          </div>
          {selectedFile?.url ? (
            <a
              href={selectedFile.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-blue-600 transition hover:text-blue-800"
            >
              Открыть в новой вкладке
            </a>
          ) : null}
        </div>

        <div className="rounded-3xl border border-gray-200 bg-black/5 p-4">
          {selectedFile?.url ? (
            previewType === 'video' ? (
              <video
                controls
                className="h-90 w-full rounded-3xl bg-black"
                src={selectedFile.url}
              />
            ) : previewType === 'audio' ? (
              <audio
                controls
                className="w-full"
                src={selectedFile.url}
                preload="metadata"
              >
                Ваш браузер не поддерживает аудио.
              </audio>
            ) : previewType === 'image' ? (
              <img
                src={selectedFile.url}
                alt={selectedFile.name || 'Плейлист файл'}
                className="max-h-105 w-full rounded-3xl object-contain"
              />
            ) : (
              <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-600">
                Файл не поддерживается для предпросмотра.
                <div className="mt-3">
                  <a
                    href={selectedFile.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Открыть файл
                  </a>
                </div>
              </div>
            )
          ) : (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-600">
              У выбранного файла нет ссылки для просмотра.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
