import { visit } from 'unist-util-visit'
import plantumlEncoder from 'plantuml-encoder'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import https from 'node:https'

function fetchUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (
          res.statusCode &&
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          fetchUrl(res.headers.location).then(resolve).catch(reject)
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

interface RemarkPlantumlOptions {
  serverUrl?: string
  cacheDir?: string
}

export function remarkPlantuml(options: RemarkPlantumlOptions = {}) {
  const serverUrl = options.serverUrl ?? 'https://www.plantuml.com/plantuml'
  const cacheDir = path.resolve(options.cacheDir ?? 'src/content/diagrams-cache')

  return async (tree: any) => {
    const tasks: Task[] = []

    visit(tree, 'code', (node: any, index: any, parent: any) => {
      if (node.lang === 'plantuml' && index !== undefined && parent !== undefined) {
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

        let svg: string
        if (fs.existsSync(cacheFile)) {
          svg = fs.readFileSync(cacheFile, 'utf-8')
        } else {
          const encoded = plantumlEncoder.encode(task.source)
          const url = `${serverUrl}/svg/${encoded}`
          svg = await fetchUrl(url)
          fs.mkdirSync(cacheDir, { recursive: true })
          fs.writeFileSync(cacheFile, svg)
        }

        svg = svg.replace(/<svg(\s)/i, '<svg class="plantuml-svg"$1')
        task.html = `<div class="plantuml-diagram">${svg}</div>`
      }),
    )

    // Splice in reverse-index order within each parent so earlier indices stay valid
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
