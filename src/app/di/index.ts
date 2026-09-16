import { ApiServiceRepository } from '@/features/services/infrastructure/repositories/ApiServiceRepository';
import { GetServices, GetServiceBySlug } from '@/features/services/application/usecases/get_services';

import { ApiProjectRepository } from '@/features/projects/infrastructure/repositories/ApiProjectRepository';
import { GetProjects, GetFeaturedProjects, GetProjectBySlug } from '@/features/projects/application/usecases/get_projects';

import { ApiSolutionRepository } from '@/features/solutions/infrastructure/repositories/ApiSolutionRepository';
import { GetSolutions, GetSolutionBySlug } from '@/features/solutions/application/usecases/get_solutions';

import { ApiBlogRepository } from '@/features/blog/infrastructure/repositories/ApiBlogRepository';
import { GetArticles, GetArticleBySlug } from '@/features/blog/application/usecases/get_articles';

const serviceRepository = new ApiServiceRepository();
const projectRepository = new ApiProjectRepository();
const solutionRepository = new ApiSolutionRepository();
const blogRepository = new ApiBlogRepository();

export const getServices = new GetServices(serviceRepository);
export const getServiceBySlug = new GetServiceBySlug(serviceRepository);

export const getProjects = new GetProjects(projectRepository);
export const getFeaturedProjects = new GetFeaturedProjects(projectRepository);
export const getProjectBySlug = new GetProjectBySlug(projectRepository);

export const getSolutions = new GetSolutions(solutionRepository);
export const getSolutionBySlug = new GetSolutionBySlug(solutionRepository);

export const getArticles = new GetArticles(blogRepository);
export const getArticleBySlug = new GetArticleBySlug(blogRepository);
