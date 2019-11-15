import { getDomainFromUrl } from './utilities'

describe('getDomainFromUrl', () => {
  test('it should get the domain from a url', () => {
    const url = 'https://www.cnn.com/2019/11/14/cars/ford-mustang-electric-suv/index.html'
    const result = getDomainFromUrl(url)
    expect(result).toEqual('https://www.cnn.com')
  })
  test('it should not include query parameters', () => {
    const url = 'https://query.com?q=some&a=entry'
    const result = getDomainFromUrl(url)
    expect(result).toEqual('https://query.com')
  })
  test('it should not include fragments', () => {
    const url = 'https://www.joesbabysitting.com#about'
    const result = getDomainFromUrl(url)
    expect(result).toEqual('https://www.joesbabysitting.com')
  })
  test('it should work for custom extension schemes', () => {
    const url = 'chrome-extension://hnkanfgmglhnleflmdjhakfbjganmdjb/_generated_background_page.html'
    const result = getDomainFromUrl(url)
    expect(result).toEqual('chrome-extension://hnkanfgmglhnleflmdjhakfbjganmdjb')
  })
  test('it should include ports', () => {
    const url = 'http://localhost:1600/'
    const result = getDomainFromUrl(url)
    expect(result).toEqual('http://localhost:1600')
  })
  test('it should throw an error if the string is not a url', () => {
    const invalid = 'I am not a url'
    expect(() => {
      getDomainFromUrl(invalid)
    }).toThrow()
  })
})
