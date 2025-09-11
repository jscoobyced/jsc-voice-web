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
      webSocketServer: 'localhost',
      webSocketPort: 8080,
      webSocketPath: '/audio',
      webSocketScheme: 'ws',
    }
    // @ts-expect-error - Mock for what we inject this property in index.html
    window.applicationData = applicationData
    const result = getApplicationData()
    expect(result.appVersion).toBe(applicationData.appVersion)
    expect(result.webSocketScheme).toBe(applicationData.webSocketScheme)
    expect(result.webSocketServer).toBe(applicationData.webSocketServer)
    expect(result.webSocketPort).toBe(applicationData.webSocketPort)
    expect(result.webSocketPath).toBe(applicationData.webSocketPath)
    // @ts-expect-error - Clean up mock
    delete window.applicationData
  })
})
