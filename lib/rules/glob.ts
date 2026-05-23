export type GlobMatchOptions = {
  ignoreCase?: boolean
}

function hasGlobSyntax(pattern: string): boolean {
  return pattern.includes('*') || pattern.includes('?')
}

/**
 * url patterns without * or ? match as case-insensitive substrings of the full tab url.
 * with wildcards: anchored glob (* any run, ? one char). no regex syntax in patterns.
 */
export function globMatch(
  pattern: string,
  value: string,
  options: GlobMatchOptions = {},
): boolean {
  if (!hasGlobSyntax(pattern)) {
    if (options.ignoreCase) {
      return value.toLowerCase().includes(pattern.toLowerCase())
    }
    return value.includes(pattern)
  }
  const flags = options.ignoreCase ? 'i' : ''
  const re = globToRegExp(pattern, flags)
  return re.test(value)
}

export function globToRegExp(pattern: string, flags = ''): RegExp {
  let escaped = ''
  for (const char of pattern) {
    if (char === '*') {
      escaped += '.*'
    } else if (char === '?') {
      escaped += '.'
    } else if (/[.+^${}()|[\]\\]/.test(char)) {
      escaped += `\\${char}`
    } else {
      escaped += char
    }
  }
  return new RegExp(`^${escaped}$`, flags)
}
