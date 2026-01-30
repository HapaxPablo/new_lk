'use client'

import { IUserDetailsItem } from '@/types/user'
import NotFound from '@/app/not-found'
import { UserAvatar } from './userAvatar/UserAvatar'
import { ContactItem } from './ContactItem/ContactItem'
import { useEffect, useState } from 'react'
import { getToken } from '@/lib/token/getToken'
import { UserInfoSkeleton } from './UserInfoSkeleton'

interface Props {
  userId: string
}

export default function UserInfoModalView({ userId }: Props) {
  if (!userId) return <NotFound />

  const [userInfo, setUserInfo] = useState<IUserDetailsItem | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  type ContactInfo = IUserDetailsItem['additional_contact_info'][number]

  const fullName = [
    userInfo?.full_name?.last_name,
    userInfo?.full_name?.first_name,
    userInfo?.full_name?.middle_name,
  ]
    .filter(Boolean)
    .join(' ')

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `access_token ${await getToken()}`,
          },
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setUserInfo(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching user info:', error)
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [userId])

  return (
    <>
      {loading ? (
        <UserInfoSkeleton />
      ) : (
        <div className="flex gap-4 items-start">
          <UserAvatar src={userInfo?.full_name?.avatar} alt={fullName} />

          <div className="flex-1 space-y-2">
            <p className="text-lg font-semibold">{fullName}</p>

            {userInfo?.phone_number && (
              <ContactItem type="phone" value={userInfo.phone_number} />
            )}

            {userInfo?.additional_contact_info
              ?.filter((i: ContactInfo) => i.type === 'mail' && i.meaning)
              .map((i: ContactInfo) => (
                <ContactItem
                  key={i.meaning}
                  type="mail"
                  value={i.meaning!}
                  meta={i.viddmail}
                />
              ))}
          </div>
        </div>
      )}
    </>
  )
}
