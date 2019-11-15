/*
  Parses a url and returns its scheme and domain.
  @param {string} urlString
  @return {string}
*/
export const getDomainFromUrl = (urlString) => {
  const regex = /.+:\/\/[^/?#\s]+/
  const match = urlString.match(regex)
  if (!match) {
    throw new Error(`Could not parse domain from ${urlString}`)
  }

  return match[0]
}
