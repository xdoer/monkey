interface Match {
  pattern: RegExp
  handleResponse(res: any): any
}

interface FetchHookOptions {
  match: Match[]
}

export function fetchHook({ match }: FetchHookOptions) {
  const _fetch = unsafeWindow.fetch

  unsafeWindow.fetch = async (url, options) => {
    const res = await _fetch(url, options)

    const matched = match.filter(i => i.pattern.test('' + url))
    if (matched.length) {
      const resCloned = res.clone()
      const data = await resCloned.json()
      const newRes = matched.reduce((r, c) => c.handleResponse(r), data)
      return new Response(JSON.stringify(newRes), res)
    }

    return res
  }
}
