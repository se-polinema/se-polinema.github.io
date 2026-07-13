import { visit } from 'unist-util-visit'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import https from 'node:https'

function fetchSvg(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (
          res.statusCode &&
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          fetchSvg(res.headers.location).then(resolve).catch(reject)
          return
        }
        if (res.statusCode && res.statusCode >= 400) {
          reject(new Error(`Mermaid render failed with status ${res.statusCode}`))
          return
        }
        const chunks: Buffer[] = []
        res.on('data', (c: Buffer) => chunks.push(c))
        res.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
        res.on('error', reject)
      })
      .on('error', reject)
  })
}

interface Task {
  node: any
  index: number
  parent: any
  source: string
  html?: string
}

interface RemarkMermaidOptions {
  serverUrl?: string
  cacheDir?: string
}

export function remarkMermaid(options: RemarkMermaidOptions = {}) {
  const serverUrl = options.serverUrl ?? 'https://mermaid.ink/svg'
  const cacheDir = path.resolve(options.cacheDir ?? 'src/content/diagrams-cache')

  return async (tree: any) => {
    const tasks: Task[] = []

    visit(tree, 'code', (node: any, index: any, parent: any) => {
      if (node.lang === 'mermaid' && index !== undefined && parent !== undefined) {
        tasks.push({ node, index, parent, source: node.value as string })
      }
    })

    if (tasks.length === 0) return

    await Promise.all(
      tasks.map(async (task) => {
        const hash = crypto
          .createHash('sha256')
          .update(task.source)
          .digest('hex')
          .slice(0, 12)
        const cacheFile = path.join(cacheDir, `${hash}.svg`)

        try {
          let svg: string
          if (fs.existsSync(cacheFile)) {
            svg = fs.readFileSync(cacheFile, 'utf-8')
          } else {
            const encoded = Buffer.from(task.source, 'utf-8').toString('base64')
            const url = `${serverUrl}/${encoded}`
            svg = await fetchSvg(url)
            try {
              fs.mkdirSync(cacheDir, { recursive: true })
              fs.writeFileSync(cacheFile, svg)
            } catch (_cacheErr) {
              console.warn(
                `[remarkMermaid] Could not write cache file ${cacheFile}. Skipping cache.`,
              )
            }
          }

          svg = svg.replace(/<svg(\s)/i, '<svg class="mermaid-svg"$1')
          task.html = `<div class="mermaid-diagram">${svg}</div>`
        } catch (err) {
          const snippet =
            task.source.length > 80
              ? task.source.slice(0, 80).replace(/\n/g, ' ') + '…'
              : task.source.replace(/\n/g, ' ')
          console.warn(
            `[remarkMermaid] Failed to render diagram (hash: ${hash}): ${snippet}`,
          )
          if (err instanceof Error && err.message) {
            console.warn(`[remarkMermaid]   Reason: ${err.message}`)
          }
          console.warn(
            `[remarkMermaid]   The diagram will appear as a plain code block in the output.`,
          )
        }
      }),
    )

    tasks.sort((a, b) => (a.parent === b.parent ? b.index - a.index : 0))

    for (const task of tasks) {
      if (!task.html) continue
      task.parent.children.splice(task.index, 1, {
        type: 'html',
        value: task.html,
      })
    }
  }
}
