import { IUserDetailsItem } from '@/types/user'
import { UserContacts } from '../userContacts/UserContacts'
import { UserHeader } from '../userHeader/UserHeader'

interface UserInfoContentProps {
  userInfo: IUserDetailsItem
  fullName: string
}

export function UserInfoContent({ userInfo, fullName }: UserInfoContentProps) {
  return (
    <div className="flex flex-col gap-4">
      <UserHeader
        fullName={fullName}
        avatar={userInfo.full_name?.avatar}
        phone={userInfo.phone_number}
      />

      <div className="border-b border-gray-200 w-full" />

      <div>
        <h2 className="text-lg font-semibold">
          Дополнительная контактная информация
        </h2>
      </div>

      <UserContacts contacts={userInfo.contacts} />
    </div>
  )
}
