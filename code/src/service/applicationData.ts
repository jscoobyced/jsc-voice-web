import { IApplicationData } from '../models/IApplicationData'

export const getApplicationData = () => {
  // @ts-expect-error - We inject this property in index.html
  if (window.applicationData) {
    // @ts-expect-error - We inject this property in index.html
    return window.applicationData as IApplicationData
  }
  return {
    appVersion: 'v0.0.0',
    webSocketServer: '',
    webSocketPort: 0,
    webSocketPath: '',
  }
}
