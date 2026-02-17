import { ContactItem } from '../ContactItem/ContactItem'
import { UserAvatar } from '../userAvatar/UserAvatar'

interface UserHeaderProps {
  fullName: string
  avatar?: string
  phone?: string
}

export function UserHeader({ fullName, avatar, phone }: UserHeaderProps) {
  return (
    <div className="flex gap-3 w-full">
      <UserAvatar src={avatar} alt={fullName} />
      <div className="flex-1 space-y-2">
        <div className="text-lg font-semibold">{fullName}</div>
        {phone && <ContactItem type="phone" value={phone} title="Телефон" />}
      </div>
    </div>
  )
}
