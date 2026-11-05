import { afterEach, describe, expect, it, vi } from 'vitest'

async function loadPaths(base: string) {
  vi.resetModules()
  vi.stubEnv('BASE_URL', base)
  return await import('./paths.ts')
}

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('paths (production, base "/")', () => {
  it('leaves paths untouched', async () => {
    const { withBase, stripBase, IS_BASE_DEPLOY } = await loadPaths('/')
    expect(IS_BASE_DEPLOY).toBe(false)
    expect(withBase('/members')).toBe('/members')
    expect(withBase('/')).toBe('/')
    expect(stripBase('/members')).toBe('/members')
  })
})

describe('paths (beta, base "/beta/")', () => {
  it('prefixes root-absolute paths once', async () => {
    const { withBase, IS_BASE_DEPLOY, BASE } = await loadPaths('/beta/')
    expect(IS_BASE_DEPLOY).toBe(true)
    expect(BASE).toBe('/beta/')
    expect(withBase('/members')).toBe('/beta/members')
    expect(withBase('/')).toBe('/beta/')
    expect(withBase('/blog/post-1')).toBe('/beta/blog/post-1')
  })

  it('is idempotent on already-prefixed paths', async () => {
    const { withBase } = await loadPaths('/beta/')
    expect(withBase('/beta/members')).toBe('/beta/members')
    expect(withBase(withBase('/members'))).toBe('/beta/members')
  })

  it('passes external, protocol-relative, hash and query values through', async () => {
    const { withBase } = await loadPaths('/beta/')
    expect(withBase('https://example.org/x')).toBe('https://example.org/x')
    expect(withBase('mailto:a@b.co')).toBe('mailto:a@b.co')
    expect(withBase('//cdn.example.org/x.js')).toBe('//cdn.example.org/x.js')
    expect(withBase('#section')).toBe('#section')
    expect(withBase('?page=2')).toBe('?page=2')
    expect(withBase('')).toBe('')
  })

  it('accepts a base without a trailing slash', async () => {
    const { withBase, BASE } = await loadPaths('/beta')
    expect(BASE).toBe('/beta/')
    expect(withBase('/members')).toBe('/beta/members')
  })

  it('stripBase is the inverse of withBase', async () => {
    const { withBase, stripBase } = await loadPaths('/beta/')
    for (const p of ['/', '/members', '/blog/post-1']) {
      expect(stripBase(withBase(p))).toBe(p)
    }
    expect(stripBase('/beta')).toBe('/')
    expect(stripBase('/other')).toBe('/other')
  })
})
