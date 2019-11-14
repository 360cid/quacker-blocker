export const Api = function () {
  /*
        Gets the contents at a given url.
        @param url {string}
        @return Promise
    */
  const getSource = async (url) => {
    if (!url) {
      throw new Error('Url not provided')
    }
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch url: ${url}`)
    }
    return response.text()
  }

  return {
    getSource
  }
}
