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

export function ModalAddFile({ onSuccess }: { onSuccess?: () => void }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [file, setFile] = useState<File | null>(null)
  const [fileBase64, setFileBase64] = useState<string>('')
  const [fileName, setFileName] = useState<string>('Файл не выбран')
  const [uploadType, setUploadType] = useState<string>('')
  const [source, setSource] = useState<string>('')
  const [tags, setTags] = useState<string>('')
  const { showToast } = useToast()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setFileName(selectedFile.name)

    // очистка старого preview
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    // создаём preview
    const url = URL.createObjectURL(selectedFile)
    setPreviewUrl(url)

    // конвертация в base64 для отправки
    convertBase64(selectedFile)
      .then((b64) => setFileBase64(b64))
      .catch((err) => {
        console.error('convertBase64 error:', err)
      })
  }
  const isOpen = searchParams.get('modal') === 'open'

  const handleOpen = () => {
    const newUrl = `${pathname}?page=1&limit=20&modal=open`
    router.push(newUrl, { scroll: false })
  }

  const handleClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }

    setFile(null)
    setFileName('Файл не выбран')
    setFileBase64('')
    setTags('')
    setUploadType('')

    const newUrl = `${pathname}?page=1&limit=20`
    router.push(newUrl, { scroll: false })
  }

  const handleSendFile = async () => {
    if (!file) {
      showToast('Файл не выбран', 'error')
      return
    }

    if (!uploadType) {
      showToast('Тип файла не выбран', 'error')
      return
    }

    try {
      const tagsPayload = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
        .map((name) => ({ name }))

      // Используем base64 payload
      const payload = {
        source: fileBase64 || undefined,
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
        showToast(result?.error || 'Не удалось загрузить файл', 'error')
        return
      }

      showToast(`Файл ${result?.name || file.name} успешно создан`, 'success')
      // вызвать коллбек для обновления списка файлов в таблице
      onSuccess?.()
      handleClose()
    } catch (error) {
      console.error('Ошибка при отправке файла:', error)
      showToast('Ошибка при отправке файла', 'error')
    }
  }

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Button
        variant="primary"
        onClick={handleOpen}
        style={{ maxHeight: '52px', height: '100%' }}
      >
        Добавить файл
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
              width: 400,
              background: '#fff',
              borderRadius: 16,
              padding: 24,
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.12)',
            }}
          >
            <div style={{ marginBottom: 18 }}>
              <h2 style={{ margin: 0, fontSize: 20 }}>Загрузить файл</h2>
            </div>
            <div style={{ display: 'grid', gap: 12 }}>
              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 14, color: '#111' }}>Файл</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />

                <Button
                  variant="primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Выбрать файл
                </Button>

                <div style={{ fontSize: 13, color: '#666' }}>{fileName}</div>
                {previewUrl && (
                  <div
                    style={{
                      marginTop: 12,
                      borderRadius: 8,
                      overflow: 'hidden',
                      border: '1px solid #ddd',
                      padding: 8,
                    }}
                  >
                    {file?.type.startsWith('image/') && (
                      <img
                        src={previewUrl}
                        alt={file.name}
                        style={{
                          width: '100%',
                          maxHeight: 200,
                          objectFit: 'contain',
                        }}
                      />
                    )}

                    {file?.type.startsWith('video/') && (
                      <video
                        src={previewUrl}
                        controls
                        style={{
                          width: '100%',
                          maxHeight: 200,
                        }}
                      />
                    )}

                    {file?.type.startsWith('audio/') && (
                      <audio
                        src={previewUrl}
                        controls
                        style={{
                          width: '100%',
                        }}
                      />
                    )}

                    {!file?.type.startsWith('image/') &&
                      !file?.type.startsWith('video/') &&
                      !file?.type.startsWith('audio/') && (
                        <div>📄 {file?.name}</div>
                      )}
                  </div>
                )}
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
              <Button variant="default" onClick={handleClose}>
                Закрыть
              </Button>
              <Button variant="primary" onClick={handleSendFile}>
                Отправить
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
