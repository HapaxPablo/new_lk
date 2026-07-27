import { contactLabelArray, IUserDetailsItem } from '@/types/user'
import { ContactItem } from '../ContactItem/ContactItem'

interface UserContactsProps {
  contacts?: IUserDetailsItem['contacts']
}

export function UserContacts({ contacts }: UserContactsProps) {
  if (!contacts || contacts.length === 0) {
    return <div>Нет доп. контактной информации</div>
  }

  return (
    <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
      {contacts.map((contact, idx) => {
        const label = contactLabelArray.find(
          (item) => item.value === contact.type
        )
        return (
          <ContactItem
            key={idx}
            type={label?.value || 'other'}
            title={label?.label || 'Other'}
            value={contact.meaning || 'No contact info'}
          />
        )
      })}
    </div>
  )
}
