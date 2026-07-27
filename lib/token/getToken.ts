import { getClientAccessToken } from './getAccessTokenClient'
import { getServerAccessToken } from './getAccessTokenServer'

export const getToken = async () => {
  const isSSR = typeof window === 'undefined'
  let token
  if (isSSR) {
    // console.log('isSSR', isSSR)
    token = await getServerAccessToken()
  } else {
    // console.log('isSSR', isSSR)
    token = getClientAccessToken()
  }

  return token
}
