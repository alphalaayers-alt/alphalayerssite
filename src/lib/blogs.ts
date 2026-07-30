import { createId, readJsonFile, writeJsonFile } from './storage';
import type { BlogPost } from '@/types';
import { getSupabase, isSupabaseEnabled } from './supabase/client';

export interface AdminBlogPost extends BlogPost {
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

const FILE = 'blogs.json';

function rowToBlog(row: Record<string, unknown>): AdminBlogPost {
  return {
    id: String(row.id),
    title: String(row.title),
    category: String(row.category || 'Insights'),
    readTime: String(row.read_time || row.readTime || '3 min read'),
    date: String(row.date),
    excerpt: String(row.excerpt || ''),
    content: String(row.content),
    image: String(row.image || ''),
    published: Boolean(row.published),
    author: (row.author as AdminBlogPost['author']) || { name: '', role: '', avatar: '' },
    createdAt: String(row.created_at || row.createdAt || ''),
    updatedAt: String(row.updated_at || row.updatedAt || ''),
  };
}

function blogToRow(blog: AdminBlogPost) {
  return {
    id: blog.id,
    title: blog.title,
    category: blog.category,
    read_time: blog.readTime,
    date: blog.date,
    excerpt: blog.excerpt,
    content: blog.content,
    image: blog.image,
    published: blog.published,
    author: blog.author,
    created_at: blog.createdAt,
    updated_at: blog.updatedAt,
  };
}

export async function getBlogs(): Promise<AdminBlogPost[]> {
  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    const { data, error } = await sb.from('blogs').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []).map((row) => rowToBlog(row as Record<string, unknown>));
  }
  return readJsonFile<AdminBlogPost[]>(FILE, []);
}

export async function getPublishedBlogs(): Promise<AdminBlogPost[]> {
  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    const { data, error } = await sb
      .from('blogs')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []).map((row) => rowToBlog(row as Record<string, unknown>));
  }
  const blogs = await getBlogs();
  return blogs.filter((b) => b.published);
}

export async function createBlog(
  input: Omit<AdminBlogPost, 'id' | 'createdAt' | 'updatedAt'>
): Promise<AdminBlogPost> {
  const now = new Date().toISOString();
  const blog: AdminBlogPost = {
    ...input,
    id: createId('blog'),
    createdAt: now,
    updatedAt: now,
  };

  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    const { error } = await sb.from('blogs').insert(blogToRow(blog));
    if (error) throw new Error(error.message);
    return blog;
  }

  const blogs = await getBlogs();
  blogs.unshift(blog);
  await writeJsonFile(FILE, blogs);
  return blog;
}

export async function updateBlog(
  id: string,
  updates: Partial<AdminBlogPost>
): Promise<AdminBlogPost | null> {
  if (isSupabaseEnabled()) {
    const blogs = await getBlogs();
    const current = blogs.find((b) => b.id === id);
    if (!current) return null;
    const next = {
      ...current,
      ...updates,
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
    };
    const sb = getSupabase();
    const { error } = await sb.from('blogs').update(blogToRow(next)).eq('id', id);
    if (error) throw new Error(error.message);
    return next;
  }

  const blogs = await getBlogs();
  const index = blogs.findIndex((b) => b.id === id);
  if (index === -1) return null;

  blogs[index] = {
    ...blogs[index],
    ...updates,
    id: blogs[index].id,
    createdAt: blogs[index].createdAt,
    updatedAt: new Date().toISOString(),
  };
  await writeJsonFile(FILE, blogs);
  return blogs[index];
}

export async function deleteBlog(id: string): Promise<boolean> {
  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    const { error, count } = await sb.from('blogs').delete({ count: 'exact' }).eq('id', id);
    if (error) throw new Error(error.message);
    return (count || 0) > 0;
  }

  const blogs = await getBlogs();
  const next = blogs.filter((b) => b.id !== id);
  if (next.length === blogs.length) return false;
  await writeJsonFile(FILE, next);
  return true;
}
