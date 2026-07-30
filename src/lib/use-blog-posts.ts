'use client';

import { useEffect, useState } from 'react';
import { blogPostsData } from '../data/mockData';
import type { BlogPost } from '../types';

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>(blogPostsData);

  useEffect(() => {
    let active = true;
    fetch('/api/blogs')
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        const published = Array.isArray(data.blogs) ? data.blogs : [];
        // Admin-published blogs first, then default mock posts
        const merged = [...published, ...blogPostsData];
        const unique = merged.filter(
          (post, index, arr) => arr.findIndex((p) => p.id === post.id) === index
        );
        setPosts(unique);
      })
      .catch(() => {
        if (active) setPosts(blogPostsData);
      });

    return () => {
      active = false;
    };
  }, []);

  return posts;
}
