"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DEFAULT_SITE_CONTENT } from "@/lib/site-content-defaults";
import type { SiteContent } from "@/types/site-content";

interface SiteContentContextValue {
  content: SiteContent;
  loading: boolean;
  refresh: () => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextValue>({
  content: DEFAULT_SITE_CONTENT,
  loading: true,
  refresh: async () => undefined,
});

export function SiteContentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/site");
      const data = await res.json();
      if (data?.content) {
        setContent(data.content as SiteContent);
      } else {
        setContent(DEFAULT_SITE_CONTENT);
      }
    } catch {
      setContent(DEFAULT_SITE_CONTENT);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const value = useMemo(
    () => ({ content: content ?? DEFAULT_SITE_CONTENT, loading, refresh }),
    [content, loading]
  );

  if (loading && !content) {
    return null;
  }

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
