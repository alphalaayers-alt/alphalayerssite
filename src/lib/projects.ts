import { createId, readJsonFile, writeJsonFile } from './storage';
import { getSupabase, isSupabaseEnabled } from './supabase/client';

export type ProjectStatus = 'planned' | 'in_progress' | 'blocked' | 'done';
export type TaskStatus = 'todo' | 'doing' | 'done';

export interface ProjectTask {
  id: string;
  title: string;
  status: TaskStatus;
  assigneeId?: string;
  dueDate?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  priority: 'low' | 'medium' | 'high';
  ownerId: string;
  memberIds: string[];
  tasks: ProjectTask[];
  startDate?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

const FILE = 'projects.json';

function fromRow(row: Record<string, unknown>): ProjectItem {
  return {
    id: String(row.id),
    title: String(row.title),
    description: String(row.description || ''),
    status: row.status as ProjectStatus,
    priority: row.priority as ProjectItem['priority'],
    ownerId: String(row.owner_id || row.ownerId),
    memberIds: (row.member_ids as string[]) || (row.memberIds as string[]) || [],
    tasks: (row.tasks as ProjectTask[]) || [],
    startDate: (row.start_date as string) || undefined,
    dueDate: (row.due_date as string) || undefined,
    createdAt: String(row.created_at || row.createdAt || ''),
    updatedAt: String(row.updated_at || row.updatedAt || ''),
  };
}

function toRow(project: ProjectItem) {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    status: project.status,
    priority: project.priority,
    owner_id: project.ownerId,
    member_ids: project.memberIds,
    tasks: project.tasks,
    start_date: project.startDate || null,
    due_date: project.dueDate || null,
    created_at: project.createdAt,
    updated_at: project.updatedAt,
  };
}

export async function getProjects(): Promise<ProjectItem[]> {
  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    const { data, error } = await sb.from('projects').select('*').order('updated_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []).map((r) => fromRow(r as Record<string, unknown>));
  }
  return readJsonFile<ProjectItem[]>(FILE, []);
}

export async function getProjectsForUser(userId: string, isAdmin = false): Promise<ProjectItem[]> {
  const projects = await getProjects();
  if (isAdmin) return projects;
  return projects.filter((p) => p.ownerId === userId || p.memberIds.includes(userId));
}

export async function createProject(input: {
  title: string;
  description?: string;
  status?: ProjectStatus;
  priority?: ProjectItem['priority'];
  ownerId: string;
  memberIds?: string[];
  startDate?: string;
  dueDate?: string;
}): Promise<ProjectItem> {
  const now = new Date().toISOString();
  const project: ProjectItem = {
    id: createId('proj'),
    title: input.title.trim(),
    description: input.description || '',
    status: input.status || 'planned',
    priority: input.priority || 'medium',
    ownerId: input.ownerId,
    memberIds: input.memberIds || [],
    tasks: [],
    startDate: input.startDate,
    dueDate: input.dueDate,
    createdAt: now,
    updatedAt: now,
  };

  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    const { error } = await sb.from('projects').insert(toRow(project));
    if (error) throw new Error(error.message);
    return project;
  }

  const projects = await getProjects();
  projects.unshift(project);
  await writeJsonFile(FILE, projects);
  return project;
}

export async function updateProject(
  id: string,
  updates: Partial<Omit<ProjectItem, 'id' | 'createdAt'>>
): Promise<ProjectItem | null> {
  const projects = await getProjects();
  const current = projects.find((p) => p.id === id);
  if (!current) return null;
  const next: ProjectItem = {
    ...current,
    ...updates,
    id: current.id,
    createdAt: current.createdAt,
    updatedAt: new Date().toISOString(),
  };

  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    const { error } = await sb.from('projects').update(toRow(next)).eq('id', id);
    if (error) throw new Error(error.message);
    return next;
  }

  const index = projects.findIndex((p) => p.id === id);
  projects[index] = next;
  await writeJsonFile(FILE, projects);
  return next;
}

export async function deleteProject(id: string): Promise<boolean> {
  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    const { error, count } = await sb.from('projects').delete({ count: 'exact' }).eq('id', id);
    if (error) throw new Error(error.message);
    return (count || 0) > 0;
  }
  const projects = await getProjects();
  const next = projects.filter((p) => p.id !== id);
  if (next.length === projects.length) return false;
  await writeJsonFile(FILE, next);
  return true;
}

export async function addTask(
  projectId: string,
  task: { title: string; assigneeId?: string; dueDate?: string }
): Promise<ProjectItem | null> {
  const project = (await getProjects()).find((p) => p.id === projectId);
  if (!project) return null;
  project.tasks.push({
    id: createId('task'),
    title: task.title.trim(),
    status: 'todo',
    assigneeId: task.assigneeId,
    dueDate: task.dueDate,
  });
  return updateProject(projectId, { tasks: project.tasks });
}

export async function updateTask(
  projectId: string,
  taskId: string,
  updates: Partial<ProjectTask>
): Promise<ProjectItem | null> {
  const project = (await getProjects()).find((p) => p.id === projectId);
  if (!project) return null;
  const tIndex = project.tasks.findIndex((t) => t.id === taskId);
  if (tIndex < 0) return null;
  project.tasks[tIndex] = { ...project.tasks[tIndex], ...updates, id: taskId };
  return updateProject(projectId, { tasks: project.tasks });
}
