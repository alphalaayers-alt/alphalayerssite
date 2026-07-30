import { NextResponse } from 'next/server';
import { requireFeature } from '@/lib/admin-auth';
import {
  addTask,
  createProject,
  deleteProject,
  getProjectsForUser,
  updateProject,
  updateTask,
} from '@/lib/projects';

export async function GET() {
  const session = await requireFeature('projects');
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const isAdmin = ['super_admin', 'manager'].includes(session.user.role);
  const projects = await getProjectsForUser(session.user.id, isAdmin);
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const session = await requireFeature('projects');
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();

    if (body.action === 'add_task') {
      if (!body.projectId || !body.title) {
        return NextResponse.json({ error: 'projectId and title required' }, { status: 400 });
      }
      const project = await addTask(body.projectId, {
        title: body.title,
        assigneeId: body.assigneeId,
        dueDate: body.dueDate,
      });
      if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      return NextResponse.json({ project });
    }

    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const project = await createProject({
      title: body.title,
      description: body.description,
      status: body.status,
      priority: body.priority,
      ownerId: session.user.id,
      memberIds: body.memberIds || [],
      startDate: body.startDate,
      dueDate: body.dueDate,
    });
    return NextResponse.json({ project });
  } catch {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await requireFeature('projects');
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();

    if (body.action === 'update_task') {
      const project = await updateTask(body.projectId, body.taskId, {
        title: body.title,
        status: body.status,
        assigneeId: body.assigneeId,
        dueDate: body.dueDate,
      });
      if (!project) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
      return NextResponse.json({ project });
    }

    if (!body.id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    const project = await updateProject(body.id, {
      title: body.title,
      description: body.description,
      status: body.status,
      priority: body.priority,
      memberIds: body.memberIds,
      startDate: body.startDate,
      dueDate: body.dueDate,
      tasks: body.tasks,
    });
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    return NextResponse.json({ project });
  } catch {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await requireFeature('projects');
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const ok = await deleteProject(id);
  if (!ok) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
