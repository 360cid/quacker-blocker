import { Api } from './api'
import { mockResponseText } from '../__mocks__/api'

describe('getSource', () => {
  const setup = (shouldReturnSuccess) => {
    global.fetch = jest.fn().mockImplementationOnce(() => {
      return Promise.resolve({
        ok: shouldReturnSuccess,
        text: () => mockResponseText
      })
    })
  }

  test('It should fetch the correct URL', async () => {
    setup(true)
    const api = new Api()
    const testUrl = 'https://www.ebird.org'
    await api.getSource(testUrl)
    expect(global.fetch).toHaveBeenCalledWith(testUrl)
  })
  test('It should resolve with text content', async () => {
    setup(true)
    const api = new Api()
    const result = await api.getSource('https://its/mallard/time')
    expect(result).toEqual(mockResponseText)
  })
  test('It should throw an error when the status is not ok', async () => {
    setup(false)
    const api = new Api()
    const result = api.getSource('https://whoops.com')
    await expect(result).rejects.toThrow()
  })
  test('It should fail if no url is passed', async () => {
    setup(true)
    const api = new Api()
    const result = api.getSource()
    await expect(result).rejects.toThrow()
  })
})
