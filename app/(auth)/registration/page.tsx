import { RegistrationWrapper } from '@/components/auth/register/RegisterFormWrapper'

const page = async () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="flex flex-col w-full gap-1 h-full">
        <RegistrationWrapper />
      </div>
    </div>
  )
}
export default page
