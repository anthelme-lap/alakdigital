import { StaticServiceRepository } from '@/features/services/infrastructure/repositories/static_service_repository';
import { GetServices, GetServiceBySlug } from '@/features/services/application/usecases/get_services';

import { StaticProjectRepository } from '@/features/projects/infrastructure/repositories/static_project_repository';
import { GetProjects, GetFeaturedProjects, GetProjectBySlug } from '@/features/projects/application/usecases/get_projects';

import { StaticSolutionRepository } from '@/features/solutions/infrastructure/repositories/static_solution_repository';
import { GetSolutions, GetSolutionBySlug } from '@/features/solutions/application/usecases/get_solutions';

import { StaticBlogRepository } from '@/features/blog/infrastructure/repositories/static_blog_repository';
import { GetArticles, GetArticleBySlug } from '@/features/blog/application/usecases/get_articles';

const serviceRepository = new StaticServiceRepository();
const projectRepository = new StaticProjectRepository();
const solutionRepository = new StaticSolutionRepository();
const blogRepository = new StaticBlogRepository();

export const getServices = new GetServices(serviceRepository);
export const getServiceBySlug = new GetServiceBySlug(serviceRepository);

export const getProjects = new GetProjects(projectRepository);
export const getFeaturedProjects = new GetFeaturedProjects(projectRepository);
export const getProjectBySlug = new GetProjectBySlug(projectRepository);

export const getSolutions = new GetSolutions(solutionRepository);
export const getSolutionBySlug = new GetSolutionBySlug(solutionRepository);

export const getArticles = new GetArticles(blogRepository);
export const getArticleBySlug = new GetArticleBySlug(blogRepository);
