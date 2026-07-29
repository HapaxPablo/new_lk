'use client'

import { type ChangeEvent, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/button/Button'
import { convertBase64 } from '@/utils/convertBase64'

const arrayOfTypesFile = [
  { id: '0', label: 'Музыка' },
  { id: '1', label: 'Видео' },
  { id: '2', label: 'Изображение' },
  { id: '3', label: 'Бегущая строка' },
  { id: '4', label: 'Реклама' },
]

interface PendingFile {
  id: string
  file: File
  base64: string
  previewUrl: string
  status: 'idle' | 'uploading' | 'success' | 'error'
  error?: string
}

export function ModalAddFile({ onSuccess }: { onSuccess?: () => void }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([])
  const [uploadType, setUploadType] = useState<string>('')
  const [tags, setTags] = useState<string>('')
  const [isSending, setIsSending] = useState(false)

  const { showToast } = useToast()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
    if (!selectedFiles || selectedFiles.length === 0) return

    Array.from(selectedFiles).forEach((selectedFile) => {
      const id = `${selectedFile.name}-${selectedFile.size}-${selectedFile.lastModified}-${crypto.randomUUID()}`
      const previewUrl = URL.createObjectURL(selectedFile)

      // сразу добавляем в список с пустым base64, докидываем его после конвертации
      setPendingFiles((prev) => [
        ...prev,
        {
          id,
          file: selectedFile,
          base64: '',
          previewUrl,
          status: 'idle',
        },
      ])

      convertBase64(selectedFile)
        .then((b64) => {
          setPendingFiles((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, base64: b64 } : item
            )
          )
        })
        .catch((err) => {
          console.error('convertBase64 error:', err)
          setPendingFiles((prev) =>
            prev.map((item) =>
              item.id === id
                ? {
                    ...item,
                    status: 'error',
                    error: 'Не удалось прочитать файл',
                  }
                : item
            )
          )
        })
    })

    // разрешаем повторно выбрать те же файлы (сброс value инпута)
    event.target.value = ''
  }

  const handleRemoveFile = (id: string) => {
    setPendingFiles((prev) => {
      const target = prev.find((item) => item.id === id)
      if (target) {
        URL.revokeObjectURL(target.previewUrl)
      }
      return prev.filter((item) => item.id !== id)
    })
  }

  const isOpen = searchParams.get('modal') === 'open'

  const handleOpen = () => {
    const newUrl = `${pathname}?page=1&limit=20&modal=open`
    router.push(newUrl, { scroll: false })
  }

  const resetState = () => {
    pendingFiles.forEach((item) => URL.revokeObjectURL(item.previewUrl))
    setPendingFiles([])
    setTags('')
    setUploadType('')
  }

  const handleClose = () => {
    resetState()
    const newUrl = `${pathname}?page=1&limit=20`
    router.push(newUrl, { scroll: false })
  }

  const uploadSingleFile = async (item: PendingFile) => {
    const tagsPayload = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
      .map((name) => ({ name }))

    const payload = {
      source: item.base64 || undefined,
      type: uploadType,
      tags: tagsPayload.length > 0 ? tagsPayload : undefined,
    }

    const response = await fetch('/api/files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result?.error || 'Не удалось загрузить файл')
    }

    return result
  }

  const handleSendFiles = async () => {
    const filesToSend = pendingFiles.filter((item) => item.status !== 'success')

    if (filesToSend.length === 0) {
      showToast('Нет файлов для отправки', 'error')
      return
    }

    if (!uploadType) {
      showToast('Тип файла не выбран', 'error')
      return
    }

    setIsSending(true)

    let successCount = 0
    let errorCount = 0

    // отправляем по очереди, а не параллельно
    for (const item of filesToSend) {
      if (!item.base64) {
        // ещё не сконвертировался — помечаем ошибкой, не блокируя остальные
        setPendingFiles((prev) =>
          prev.map((p) =>
            p.id === item.id
              ? { ...p, status: 'error', error: 'Файл ещё обрабатывается' }
              : p
          )
        )
        errorCount++
        continue
      }

      setPendingFiles((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, status: 'uploading' } : p))
      )

      try {
        const result = await uploadSingleFile(item)
        setPendingFiles((prev) =>
          prev.map((p) => (p.id === item.id ? { ...p, status: 'success' } : p))
        )
        successCount++
        showToast(
          `Файл ${result?.name || item.file.name} успешно создан`,
          'success'
        )
      } catch (error: any) {
        console.error('Ошибка при отправке файла:', item.file.name, error)
        setPendingFiles((prev) =>
          prev.map((p) =>
            p.id === item.id
              ? {
                  ...p,
                  status: 'error',
                  error: error?.message || 'Ошибка загрузки',
                }
              : p
          )
        )
        errorCount++
        showToast(`Ошибка при загрузке файла ${item.file.name}`, 'error')
      }
    }

    setIsSending(false)

    if (successCount > 0) {
      onSuccess?.()
    }

    // закрываем модалку только если ни одной ошибки не осталось совсем
    const stillHasErrors = errorCount > 0
    if (!stillHasErrors) {
      handleClose()
    }
  }

  useEffect(() => {
    return () => {
      pendingFiles.forEach((item) => URL.revokeObjectURL(item.previewUrl))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Button
        variant="primary"
        onClick={handleOpen}
        style={{ maxHeight: '52px', height: '100%' }}
      >
        Добавить файлы
      </Button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={handleClose}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: 460,
              maxHeight: '85vh',
              overflowY: 'auto',
              background: '#fff',
              borderRadius: 16,
              padding: 24,
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.12)',
            }}
          >
            <div style={{ marginBottom: 18 }}>
              <h2 style={{ margin: 0, fontSize: 20 }}>Загрузить файлы</h2>
            </div>
            <div style={{ display: 'grid', gap: 12 }}>
              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 14, color: '#111' }}>Файлы</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />

                <Button
                  variant="primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Выбрать файлы
                </Button>

                <div style={{ fontSize: 13, color: '#666' }}>
                  {pendingFiles.length === 0
                    ? 'Файлы не выбраны'
                    : `Выбрано файлов: ${pendingFiles.length}`}
                </div>

                {pendingFiles.map((item) => {
                  const isAudio = item.file.type.startsWith('audio/')

                  return (
                    <div
                      key={item.id}
                      style={{
                        borderRadius: 8,
                        overflow: 'hidden',
                        border: '1px solid #ddd',
                        padding: 8,
                        display: 'flex',
                        flexDirection: isAudio ? 'column' : 'row',
                        gap: 10,
                        alignItems: isAudio ? 'stretch' : 'center',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          gap: 10,
                          alignItems: 'center',
                        }}
                      >
                        {!isAudio && (
                          <div style={{ flexShrink: 0, width: 60, height: 60 }}>
                            {item.file.type.startsWith('image/') && (
                              <img
                                src={item.previewUrl}
                                alt={item.file.name}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  borderRadius: 6,
                                }}
                              />
                            )}
                            {item.file.type.startsWith('video/') && (
                              <video
                                src={item.previewUrl}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  borderRadius: 6,
                                }}
                              />
                            )}
                            {!item.file.type.startsWith('image/') &&
                              !item.file.type.startsWith('video/') && (
                                <div
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: '#f3f3f3',
                                    borderRadius: 6,
                                    fontSize: 20,
                                  }}
                                >
                                  📄
                                </div>
                              )}
                          </div>
                        )}

                        {isAudio && (
                          <div
                            style={{
                              flexShrink: 0,
                              width: 32,
                              height: 32,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: '#f3f3f3',
                              borderRadius: 6,
                              fontSize: 16,
                            }}
                          >
                            🎵
                          </div>
                        )}

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 13,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {item.file.name}
                          </div>
                          <div style={{ fontSize: 12, color: '#888' }}>
                            {item.status === 'idle' &&
                              !item.base64 &&
                              'Обработка...'}
                            {item.status === 'idle' &&
                              item.base64 &&
                              'Готов к отправке'}
                            {item.status === 'uploading' && 'Загрузка...'}
                            {item.status === 'success' && '✅ Загружен'}
                            {item.status === 'error' &&
                              `❌ ${item.error || 'Ошибка'}`}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveFile(item.id)}
                          disabled={isSending}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            cursor: isSending ? 'not-allowed' : 'pointer',
                            fontSize: 16,
                            color: '#999',
                            flexShrink: 0,
                          }}
                          aria-label="Удалить файл"
                        >
                          ×
                        </button>
                      </div>

                      {isAudio && (
                        <audio
                          src={item.previewUrl}
                          controls
                          style={{ width: '100%' }}
                        />
                      )}
                    </div>
                  )
                })}
              </label>

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 14, color: '#111' }}>Тип файла</span>
                <select
                  value={uploadType}
                  onChange={(event) => setUploadType(event.target.value)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #ccc',
                    width: '100%',
                  }}
                >
                  <option value="">Выберите тип</option>
                  {arrayOfTypesFile.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 14, color: '#111' }}>
                  Теги (через запятую)
                </span>
                <input
                  type="text"
                  value={tags}
                  onChange={(event) => setTags(event.target.value)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #ccc',
                    width: '100%',
                  }}
                />
              </label>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 10,
                marginTop: 16,
              }}
            >
              <Button
                variant="default"
                onClick={handleClose}
                disabled={isSending}
              >
                Закрыть
              </Button>
              <Button
                variant="primary"
                onClick={handleSendFiles}
                disabled={
                  isSending || pendingFiles.every((f) => f.status === 'success')
                }
              >
                {isSending
                  ? 'Отправка...'
                  : `Отправить (${pendingFiles.filter((f) => f.status !== 'success').length})`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
