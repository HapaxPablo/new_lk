import { OrganizationForm } from '@/types/olf'
import { useEffect, useState } from 'react'

export function useOlfFetcher(type: string) {
  const [olfIndividual, setOlfIndividual] = useState<OrganizationForm[] | null>(
    null
  )
  const [olfLegal, setOlfLegal] = useState<OrganizationForm[] | null>(null)

  useEffect(() => {
    if (!type) return

    const getOlf = async (): Promise<void> => {
      if (type === 'individual' && olfIndividual) {
        // console.log('[CACHED individual]', olfIndividual)
        return
      }

      if (type === 'legal' && olfLegal) {
        // console.log('[CACHED legal]', olfLegal)
        return
      }

      try {
        const response = await fetch(`/api/opf?type=${type}`)

        const fetched: OrganizationForm[] = await response.json()
        // console.log('[FETCHED]', fetched)

        if (type === 'individual') {
          setOlfIndividual(fetched)
        } else if (type === 'legal') {
          setOlfLegal(fetched)
        }
      } catch (error) {
        console.error('Error fetching OPF:', error)
      }
    }

    getOlf()
  }, [type])

  return { olfIndividual, olfLegal }
}
