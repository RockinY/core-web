import pinyinlite from 'pinyinlite/index_full'

export const slugify = (input: string): string => {
  if (!input) {
    return ''
  }
  // 转换为拼音
  const toPinyin = pinyinlite(input).map(i => i[0]).join('')
  // 转换为小写字母
  const toLowerCaseString = toPinyin.toLowerCase()
  // 去除各种奇怪字符
  return toLowerCaseString.replace(/[^0-9a-zA-Z-]/g, "")
}