import { IApplicationData } from '../models/IApplicationData'
import { getApplicationData } from './applicationData'

describe('applicationData', () => {
  it('should return the default applicationData', () => {
    const result = getApplicationData()
    expect(result.appVersion).toBe('v0.0.0')
  })

  it('should return the window.applicationData', () => {
    const applicationData: IApplicationData = {
      appVersion: 'test',
      serverWebSocket: 'ws://localhost:3000',
    }
    // @ts-expect-error - Mock for what we inject this property in index.html
    window.applicationData = applicationData
    const result = getApplicationData()
    expect(result.appVersion).toBe(applicationData.appVersion)
    expect(result.serverWebSocket).toBe(applicationData.serverWebSocket)
  })
})
