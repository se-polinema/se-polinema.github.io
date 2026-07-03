export interface LearningTrackStep {
  order: number
  level: 'beginner' | 'intermediate' | 'advanced'
  title: string
  titleId: string
  description: string
  descriptionId: string
  type: 'tutorial' | 'book' | 'deck' | 'tool' | 'dataset' | 'course' | 'paper'
  url: string
  internal: boolean
  estimatedTime: string
}

export interface LearningTrack {
  id: string
  title: string
  titleId: string
  description: string
  descriptionId: string
  estimatedTime: string
  prerequisites: string
  prerequisitesId: string
  steps: LearningTrackStep[]
}
