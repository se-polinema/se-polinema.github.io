export interface Resource {
  title: string
  titleId: string
  description: string
  descriptionId: string
  stream: string
  type: 'tutorial' | 'book' | 'deck' | 'tool' | 'dataset' | 'course' | 'paper'
  level: 'beginner' | 'intermediate' | 'advanced'
  url: string
  internal?: boolean
}
