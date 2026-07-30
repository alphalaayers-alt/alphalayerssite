import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { createBlog, deleteBlog, getBlogs, updateBlog } from '@/lib/blogs';

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const blogs = await getBlogs();
  return NextResponse.json({ blogs });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.title || !body.content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const blog = await createBlog({
      title: String(body.title).trim(),
      category: String(body.category || 'Insights').trim(),
      readTime: String(body.readTime || '3 min read').trim(),
      date: String(body.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })),
      excerpt: String(body.excerpt || body.content.slice(0, 160)).trim(),
      content: String(body.content).trim(),
      image: String(body.image || '/src/assets/images/blog_ai_finance_1785300931668.jpg').trim(),
      author: {
        name: String(body.authorName || 'Alpha Layers Team').trim(),
        role: String(body.authorRole || 'Editor').trim(),
        avatar: String(body.authorAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'),
      },
      published: Boolean(body.published ?? true),
    });

    return NextResponse.json({ blog });
  } catch {
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Blog id is required' }, { status: 400 });
    }

    const blog = await updateBlog(body.id, {
      title: body.title,
      category: body.category,
      readTime: body.readTime,
      date: body.date,
      excerpt: body.excerpt,
      content: body.content,
      image: body.image,
      published: body.published,
      author: body.authorName
        ? {
            name: body.authorName,
            role: body.authorRole || 'Editor',
            avatar: body.authorAvatar || '',
          }
        : undefined,
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ blog });
  } catch {
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Blog id is required' }, { status: 400 });
  }

  const ok = await deleteBlog(id);
  if (!ok) {
    return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
