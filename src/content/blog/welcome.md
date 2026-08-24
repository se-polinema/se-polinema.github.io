---
title: "Welcome to Software Engineering Laboratory"
titleId: "Selamat Datang di Software Engineering Laboratory"
date: 2026-05-14
category: announcement
author: SE Lab
lang: en
featured: true
excerpt: "The Software Engineering Laboratory at Politeknik Negeri Malang is now operational. Learn about our mission, research focus areas, and team."
excerptId: "Laboratorium Rekayasa Perangkat Lunak di Politeknik Negeri Malang kini telah beroperasi. Pelajari misi, bidang fokus riset, dan tim kami."
---

The Software Engineering Laboratory (SE Lab) at Politeknik Negeri Malang is proud to announce its establishment as a dedicated research and development unit under the Department of Information Technology (JTI).

## Our Mission

We aim to bridge the gap between academic knowledge and industry practice in software engineering. Through hands-on projects, collaborative research, and continuous learning, we prepare students and researchers to tackle real-world software challenges.

## What We Offer

- **Research Opportunities**: Engage in cutting-edge research across seven focus areas including web engineering, mobile development, artificial intelligence, and more.
- **Industry Collaboration**: Work alongside industry partners on meaningful projects that make an impact.
- **Knowledge Sharing**: Regular workshops, seminars, and knowledge-sharing sessions open to all JTI students.

## Example Workflow

Our lab encourages students to move from design thinking into implementable software systems. A small example of a service endpoint might look like this:

```ts
type ResearchFocus = {
  id: string
  title: string
  lead: string
}

const focusAreas: ResearchFocus[] = [
  { id: 'web-engineering', title: 'Web Engineering', lead: 'Software Engineering Laboratory' },
  { id: 'ai-systems', title: 'Artificial Intelligence', lead: 'Software Engineering Laboratory' },
]

export function getFocusArea(id: string) {
  return focusAreas.find((area) => area.id === id)
}
```

## Get Involved

Whether you are a student looking for research experience, a faculty member seeking collaboration, or an industry partner interested in working with us, we welcome you to reach out and be part of our journey.

Stay tuned for more updates!

---

*Software Engineering Laboratory, Jurusan Teknologi Informasi, Politeknik Negeri Malang*
