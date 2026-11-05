// Sections whose page is driven by a JSON file that may legitimately be empty.
// Navigation entries for these are hidden until the data exists, so visitors
// are not sent to an empty catalog. The routes themselves stay available.
import achievements from '../data/achievements.json'
import tools from '../data/tools.json'

export const HAS_ACHIEVEMENTS = (achievements as unknown[]).length > 0
export const HAS_TOOLS = (tools as unknown[]).length > 0
