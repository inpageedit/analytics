export function setTitle(...title: string[]) {
  title.push('InPageEdit Analytics')
  document.title = title.join(' | ')
  return document.title
}
