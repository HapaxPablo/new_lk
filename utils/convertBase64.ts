export function convertBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)

    fileReader.onload = () => {
      if (typeof fileReader.result === 'string') {
        // Заменяем MIME-тип на имя файла
        const base64String = fileReader.result.replace(
          /^data:[^;]+/,
          `data:${file.name}`
        )
        resolve(base64String)
      } else {
        reject(new Error('Ошибка при чтении файла'))
      }
    }

    fileReader.onerror = (error) => {
      reject(error)
    }
  })
}
