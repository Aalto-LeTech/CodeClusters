export const NgramModelId = 'ngram'

export function createQueryParams(obj) {
  return Object.keys(obj).reduce((acc, cur, i) => cur !== 'q' ? `${acc}&${cur}=${obj[cur]}` : acc, `?q=${obj.q}`)
}
