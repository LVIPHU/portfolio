export * from './types'
export * from './schema'
export { profile } from './profile'
export { projects, featuredProjects } from './projects'
export { getAllProjectSlugs, getProject, getProjectCase } from './projects-mdx'
export { resume } from './resume'
export { gallery } from './gallery'
export {
  contentDir,
  getAllPosts,
  getPost,
  getAllSlugs,
  getAllTags,
  getPostsByTag,
  getTagData,
  getSearchDocs,
  getRelatedPosts,
  getStructuredData,
} from './blog'
export { getAllAuthors, getAuthor } from './authors'
export { me, skills, skillNames, education, experience } from './me'
export { skills as SKILLS_2025, experience as EXPERIENCES_2025, projects as PROJECTS_2025 } from './me'
export { SITE_METADATA_2025 } from './site-metadata2025'
export { PHOTOS_2025, type Photo2025 } from './photos2025'
