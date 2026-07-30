'use client';

import React, { useEffect, useState } from 'react';
import { Globe, ImagePlus, Plus, Save, Trash2 } from 'lucide-react';
import {
  BentoButton,
  BentoCard,
  BentoInput,
  BentoTextarea,
  BentoTitle,
} from '@/components/admin/BentoUI';
import type { SiteContent } from '@/types/site-content';

function createId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

type Section =
  | 'brand'
  | 'home'
  | 'pages'
  | 'services'
  | 'products'
  | 'projects'
  | 'team'
  | 'testimonials'
  | 'faqs'
  | 'modals';

const SECTIONS: { id: Section; label: string }[] = [
  { id: 'brand', label: 'Brand & Footer' },
  { id: 'home', label: 'Home / Hero' },
  { id: 'pages', label: 'Page Headers' },
  { id: 'services', label: 'Services' },
  { id: 'products', label: 'Products' },
  { id: 'projects', label: 'Projects' },
  { id: 'team', label: 'Team' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'faqs', label: 'FAQs' },
  { id: 'modals', label: 'Modals' },
];

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">{label}</span>
      {children}
    </label>
  );
}

async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch('/api/admin/site/upload', { method: 'POST', body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data.url as string;
}

function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  return (
    <div className="space-y-2">
      <Field label={label}>
        <BentoInput value={value} onChange={(e) => onChange(e.target.value)} placeholder="Image URL or upload" />
      </Field>
      <div className="flex items-center gap-3">
        <label className="inline-flex">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setUploading(true);
              try {
                onChange(await uploadImage(file));
              } catch (err) {
                alert(err instanceof Error ? err.message : 'Upload failed');
              } finally {
                setUploading(false);
                e.target.value = '';
              }
            }}
          />
          <span className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl text-xs bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer">
            <ImagePlus className="w-3.5 h-3.5" />
            {uploading ? 'Uploading...' : 'Upload Image'}
          </span>
        </label>
        {value ? (
          <img src={value} alt="" className="h-12 w-16 object-cover rounded-xl border border-white/10" />
        ) : null}
      </div>
    </div>
  );
}

export function WebsiteManager() {
  const [section, setSection] = useState<Section>('brand');
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/site');
      const data = await res.json();
      if (res.ok) setContent(data.content);
      else setMessage(data.error || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!content) return;
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/site', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || 'Save failed');
        return;
      }
      setContent(data.content);
      setMessage('Saved — refresh the public site to see changes.');
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    if (!confirm('Reset all website content to defaults?')) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/site', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      });
      const data = await res.json();
      if (res.ok) {
        setContent(data.content);
        setMessage('Reset to defaults.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading || !content) {
    return (
      <BentoCard>
        <p className="text-sm text-slate-400">Loading website content...</p>
      </BentoCard>
    );
  }

  return (
    <section className="space-y-5">
      <BentoTitle
        title="Website Manager"
        subtitle="Edit all public site text, images, and collections from one place"
        action={
          <div className="flex flex-wrap gap-2">
            <BentoButton variant="ghost" onClick={reset} disabled={saving}>
              Reset Defaults
            </BentoButton>
            <BentoButton onClick={save} disabled={saving}>
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </BentoButton>
          </div>
        }
      />

      {message && (
        <BentoCard className="!py-3 !bg-[#2563eb]/10 !border-[#2563eb]/30">
          <p className="text-xs text-[#93c5fd]">{message}</p>
        </BentoCard>
      )}

      <div className="flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all ${
              section === s.id
                ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-500/20'
                : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {section === 'brand' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <BentoCard className="space-y-3">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#60a5fa]" /> Brand
            </h3>
            <Field label="Brand Name">
              <BentoInput
                value={content.brand.name}
                onChange={(e) => setContent({ ...content, brand: { ...content.brand, name: e.target.value } })}
              />
            </Field>
            <Field label="Tagline">
              <BentoInput
                value={content.brand.tagline}
                onChange={(e) => setContent({ ...content, brand: { ...content.brand, tagline: e.target.value } })}
              />
            </Field>
            <Field label="SEO Title">
              <BentoInput
                value={content.brand.seoTitle}
                onChange={(e) => setContent({ ...content, brand: { ...content.brand, seoTitle: e.target.value } })}
              />
            </Field>
            <Field label="SEO Description">
              <BentoTextarea
                rows={3}
                value={content.brand.seoDescription}
                onChange={(e) =>
                  setContent({ ...content, brand: { ...content.brand, seoDescription: e.target.value } })
                }
              />
            </Field>
            <ImageField
              label="Navbar Logo"
              value={content.brand.logoNav}
              onChange={(url) => setContent({ ...content, brand: { ...content.brand, logoNav: url } })}
            />
            <ImageField
              label="Footer Logo"
              value={content.brand.logoFooter}
              onChange={(url) => setContent({ ...content, brand: { ...content.brand, logoFooter: url } })}
            />
            <Field label="Quote CTA Label">
              <BentoInput
                value={content.nav.ctaLabel}
                onChange={(e) => setContent({ ...content, nav: { ...content.nav, ctaLabel: e.target.value } })}
              />
            </Field>
          </BentoCard>

          <BentoCard className="space-y-3">
            <h3 className="font-bold text-lg">Footer & Contact</h3>
            <Field label="Footer Blurb">
              <BentoTextarea
                rows={3}
                value={content.footer.blurb}
                onChange={(e) => setContent({ ...content, footer: { ...content.footer, blurb: e.target.value } })}
              />
            </Field>
            <Field label="Address">
              <BentoInput
                value={content.footer.address}
                onChange={(e) => setContent({ ...content, footer: { ...content.footer, address: e.target.value } })}
              />
            </Field>
            <Field label="Phone">
              <BentoInput
                value={content.footer.phone}
                onChange={(e) => setContent({ ...content, footer: { ...content.footer, phone: e.target.value } })}
              />
            </Field>
            <Field label="Email">
              <BentoInput
                value={content.footer.email}
                onChange={(e) => setContent({ ...content, footer: { ...content.footer, email: e.target.value } })}
              />
            </Field>
            <Field label="Newsletter Heading">
              <BentoInput
                value={content.footer.newsletterHeading}
                onChange={(e) =>
                  setContent({ ...content, footer: { ...content.footer, newsletterHeading: e.target.value } })
                }
              />
            </Field>
            <Field label="Copyright Name">
              <BentoInput
                value={content.footer.copyrightName}
                onChange={(e) =>
                  setContent({ ...content, footer: { ...content.footer, copyrightName: e.target.value } })
                }
              />
            </Field>
            <div className="space-y-2 pt-2">
              <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Nav Items Visibility</p>
              {content.nav.items.map((item, idx) => (
                <label key={item.id} className="flex items-center justify-between gap-2 py-1.5 border-b border-white/5">
                  <span className="text-sm">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={item.visible}
                    onChange={(e) => {
                      const items = [...content.nav.items];
                      items[idx] = { ...item, visible: e.target.checked };
                      setContent({ ...content, nav: { ...content.nav, items } });
                    }}
                  />
                </label>
              ))}
            </div>
          </BentoCard>
        </div>
      )}

      {section === 'home' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <BentoCard className="space-y-3">
            <h3 className="font-bold text-lg">Hero</h3>
            <Field label="Welcome Tag">
              <BentoInput
                value={content.home.hero.welcomeTag}
                onChange={(e) =>
                  setContent({ ...content, home: { ...content.home, hero: { ...content.home.hero, welcomeTag: e.target.value } } })
                }
              />
            </Field>
            <Field label="Headline">
              <BentoInput
                value={content.home.hero.headline}
                onChange={(e) =>
                  setContent({ ...content, home: { ...content.home, hero: { ...content.home.hero, headline: e.target.value } } })
                }
              />
            </Field>
            <Field label="Headline Accent Word">
              <BentoInput
                value={content.home.hero.headlineAccent}
                onChange={(e) =>
                  setContent({
                    ...content,
                    home: { ...content.home, hero: { ...content.home.hero, headlineAccent: e.target.value } },
                  })
                }
              />
            </Field>
            <Field label="Description">
              <BentoTextarea
                rows={3}
                value={content.home.hero.description}
                onChange={(e) =>
                  setContent({
                    ...content,
                    home: { ...content.home, hero: { ...content.home.hero, description: e.target.value } },
                  })
                }
              />
            </Field>
            <Field label="Primary CTA">
              <BentoInput
                value={content.home.hero.primaryCta}
                onChange={(e) =>
                  setContent({
                    ...content,
                    home: { ...content.home, hero: { ...content.home.hero, primaryCta: e.target.value } },
                  })
                }
              />
            </Field>
            <Field label="Floating Badge">
              <BentoInput
                value={content.home.hero.floatingBadge}
                onChange={(e) =>
                  setContent({
                    ...content,
                    home: { ...content.home, hero: { ...content.home.hero, floatingBadge: e.target.value } },
                  })
                }
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Experience Number">
                <BentoInput
                  value={content.home.hero.experienceNumber}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      home: { ...content.home, hero: { ...content.home.hero, experienceNumber: e.target.value } },
                    })
                  }
                />
              </Field>
              <Field label="Experience Label">
                <BentoInput
                  value={content.home.hero.experienceLabel}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      home: { ...content.home, hero: { ...content.home.hero, experienceLabel: e.target.value } },
                    })
                  }
                />
              </Field>
            </div>
            <ImageField
              label="Hero Image"
              value={content.home.hero.image}
              onChange={(url) =>
                setContent({ ...content, home: { ...content.home, hero: { ...content.home.hero, image: url } } })
              }
            />
          </BentoCard>

          <BentoCard className="space-y-3">
            <h3 className="font-bold text-lg">About Teaser + Services Teaser</h3>
            <Field label="About Badge">
              <BentoInput
                value={content.home.aboutTeaser.badge}
                onChange={(e) =>
                  setContent({
                    ...content,
                    home: { ...content.home, aboutTeaser: { ...content.home.aboutTeaser, badge: e.target.value } },
                  })
                }
              />
            </Field>
            <Field label="About Headline">
              <BentoInput
                value={content.home.aboutTeaser.headline}
                onChange={(e) =>
                  setContent({
                    ...content,
                    home: { ...content.home, aboutTeaser: { ...content.home.aboutTeaser, headline: e.target.value } },
                  })
                }
              />
            </Field>
            <Field label="Vision Text">
              <BentoTextarea
                rows={2}
                value={content.home.aboutTeaser.visionText}
                onChange={(e) =>
                  setContent({
                    ...content,
                    home: { ...content.home, aboutTeaser: { ...content.home.aboutTeaser, visionText: e.target.value } },
                  })
                }
              />
            </Field>
            <Field label="Mission Text">
              <BentoTextarea
                rows={2}
                value={content.home.aboutTeaser.missionText}
                onChange={(e) =>
                  setContent({
                    ...content,
                    home: { ...content.home, aboutTeaser: { ...content.home.aboutTeaser, missionText: e.target.value } },
                  })
                }
              />
            </Field>
            <ImageField
              label="About Image"
              value={content.home.aboutTeaser.image}
              onChange={(url) =>
                setContent({
                  ...content,
                  home: { ...content.home, aboutTeaser: { ...content.home.aboutTeaser, image: url } },
                })
              }
            />
            <Field label="Services Headline">
              <BentoInput
                value={content.home.servicesTeaser.headline}
                onChange={(e) =>
                  setContent({
                    ...content,
                    home: {
                      ...content.home,
                      servicesTeaser: { ...content.home.servicesTeaser, headline: e.target.value },
                    },
                  })
                }
              />
            </Field>
            <Field label="Services Blurb">
              <BentoTextarea
                rows={2}
                value={content.home.servicesTeaser.blurb}
                onChange={(e) =>
                  setContent({
                    ...content,
                    home: {
                      ...content.home,
                      servicesTeaser: { ...content.home.servicesTeaser, blurb: e.target.value },
                    },
                  })
                }
              />
            </Field>
          </BentoCard>
        </div>
      )}

      {section === 'pages' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {(
            [
              ['about', 'About Page'],
              ['services', 'Services Page'],
              ['products', 'Products Page'],
              ['projects', 'Projects Page'],
              ['blog', 'Blog Page'],
              ['contact', 'Contact Page'],
              ['faq', 'FAQ Page'],
            ] as const
          ).map(([key, title]) => {
            const page = content.pages[key] as Record<string, string>;
            return (
              <BentoCard key={key} className="space-y-3">
                <h3 className="font-bold text-lg">{title}</h3>
                {Object.entries(page).map(([field, value]) => (
                  <Field key={field} label={field}>
                    {String(value).length > 80 ? (
                      <BentoTextarea
                        rows={2}
                        value={value}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            pages: {
                              ...content.pages,
                              [key]: { ...content.pages[key], [field]: e.target.value },
                            },
                          })
                        }
                      />
                    ) : (
                      <BentoInput
                        value={value}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            pages: {
                              ...content.pages,
                              [key]: { ...content.pages[key], [field]: e.target.value },
                            },
                          })
                        }
                      />
                    )}
                  </Field>
                ))}
              </BentoCard>
            );
          })}
        </div>
      )}

      {section === 'services' && (
        <CollectionEditor
          title="Services"
          items={content.collections.services}
          onChange={(services) =>
            setContent({ ...content, collections: { ...content.collections, services } })
          }
          blank={() => ({
            id: createId('srv'),
            title: 'New Service',
            category: 'General',
            shortDesc: '',
            fullDesc: '',
            features: [''],
            icon: 'Settings',
            image: '/src/assets/images/service_business_strategies_1785300397999.jpg',
          })}
          renderFields={(item, update) => (
            <>
              <Field label="Title">
                <BentoInput value={item.title} onChange={(e) => update({ title: e.target.value })} />
              </Field>
              <Field label="Category">
                <BentoInput value={item.category} onChange={(e) => update({ category: e.target.value })} />
              </Field>
              <Field label="Short Description">
                <BentoTextarea rows={2} value={item.shortDesc} onChange={(e) => update({ shortDesc: e.target.value })} />
              </Field>
              <Field label="Full Description">
                <BentoTextarea rows={3} value={item.fullDesc} onChange={(e) => update({ fullDesc: e.target.value })} />
              </Field>
              <Field label="Features (one per line)">
                <BentoTextarea
                  rows={3}
                  value={item.features.join('\n')}
                  onChange={(e) => update({ features: e.target.value.split('\n').filter(Boolean) })}
                />
              </Field>
              <ImageField label="Image" value={item.image} onChange={(url) => update({ image: url })} />
            </>
          )}
        />
      )}

      {section === 'products' && (
        <CollectionEditor
          title="Products"
          items={content.collections.products}
          onChange={(products) =>
            setContent({ ...content, collections: { ...content.collections, products } })
          }
          blank={() => ({
            id: createId('prod'),
            title: 'New Product',
            badge: 'New',
            tagline: '',
            description: '',
            metrics: '',
            features: [''],
            image: '/src/assets/images/product_fintech_dashboard_1785300898682.jpg',
          })}
          renderFields={(item, update) => (
            <>
              <Field label="Title">
                <BentoInput value={item.title} onChange={(e) => update({ title: e.target.value })} />
              </Field>
              <Field label="Badge">
                <BentoInput value={item.badge} onChange={(e) => update({ badge: e.target.value })} />
              </Field>
              <Field label="Tagline">
                <BentoInput value={item.tagline} onChange={(e) => update({ tagline: e.target.value })} />
              </Field>
              <Field label="Description">
                <BentoTextarea rows={3} value={item.description} onChange={(e) => update({ description: e.target.value })} />
              </Field>
              <Field label="Metrics">
                <BentoInput value={item.metrics} onChange={(e) => update({ metrics: e.target.value })} />
              </Field>
              <Field label="Features (one per line)">
                <BentoTextarea
                  rows={3}
                  value={item.features.join('\n')}
                  onChange={(e) => update({ features: e.target.value.split('\n').filter(Boolean) })}
                />
              </Field>
              <ImageField label="Image" value={item.image} onChange={(url) => update({ image: url })} />
            </>
          )}
        />
      )}

      {section === 'projects' && (
        <CollectionEditor
          title="Projects"
          items={content.collections.projects}
          onChange={(projects) =>
            setContent({ ...content, collections: { ...content.collections, projects } })
          }
          blank={() => ({
            id: createId('proj'),
            title: 'New Project',
            client: '',
            category: 'Enterprise IT',
            impact: '',
            description: '',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
            year: String(new Date().getFullYear()),
          })}
          renderFields={(item, update) => (
            <>
              <Field label="Title">
                <BentoInput value={item.title} onChange={(e) => update({ title: e.target.value })} />
              </Field>
              <Field label="Client">
                <BentoInput value={item.client} onChange={(e) => update({ client: e.target.value })} />
              </Field>
              <Field label="Category">
                <BentoInput value={item.category} onChange={(e) => update({ category: e.target.value })} />
              </Field>
              <Field label="Impact">
                <BentoInput value={item.impact} onChange={(e) => update({ impact: e.target.value })} />
              </Field>
              <Field label="Year">
                <BentoInput value={item.year} onChange={(e) => update({ year: e.target.value })} />
              </Field>
              <Field label="Description">
                <BentoTextarea rows={3} value={item.description} onChange={(e) => update({ description: e.target.value })} />
              </Field>
              <ImageField label="Image" value={item.image} onChange={(url) => update({ image: url })} />
            </>
          )}
        />
      )}

      {section === 'team' && (
        <CollectionEditor
          title="Team"
          items={content.collections.team}
          onChange={(team) => setContent({ ...content, collections: { ...content.collections, team } })}
          blank={() => ({
            id: createId('tm'),
            name: 'New Member',
            role: '',
            bio: '',
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
            linkedin: '#',
          })}
          renderFields={(item, update) => (
            <>
              <Field label="Name">
                <BentoInput value={item.name} onChange={(e) => update({ name: e.target.value })} />
              </Field>
              <Field label="Role">
                <BentoInput value={item.role} onChange={(e) => update({ role: e.target.value })} />
              </Field>
              <Field label="Bio">
                <BentoTextarea rows={2} value={item.bio} onChange={(e) => update({ bio: e.target.value })} />
              </Field>
              <ImageField label="Avatar" value={item.avatar} onChange={(url) => update({ avatar: url })} />
            </>
          )}
        />
      )}

      {section === 'testimonials' && (
        <CollectionEditor
          title="Testimonials"
          items={content.collections.testimonials}
          onChange={(testimonials) =>
            setContent({ ...content, collections: { ...content.collections, testimonials } })
          }
          blank={() => ({
            id: createId('test'),
            name: 'Client Name',
            role: '',
            company: '',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
            content: '',
            rating: 5,
          })}
          renderFields={(item, update) => (
            <>
              <Field label="Name">
                <BentoInput value={item.name} onChange={(e) => update({ name: e.target.value })} />
              </Field>
              <Field label="Role">
                <BentoInput value={item.role} onChange={(e) => update({ role: e.target.value })} />
              </Field>
              <Field label="Company">
                <BentoInput value={item.company} onChange={(e) => update({ company: e.target.value })} />
              </Field>
              <Field label="Quote">
                <BentoTextarea rows={3} value={item.content} onChange={(e) => update({ content: e.target.value })} />
              </Field>
              <ImageField label="Avatar" value={item.avatar} onChange={(url) => update({ avatar: url })} />
            </>
          )}
        />
      )}

      {section === 'faqs' && (
        <CollectionEditor
          title="FAQs"
          items={content.collections.faqs}
          onChange={(faqs) => setContent({ ...content, collections: { ...content.collections, faqs } })}
          blank={() => ({
            id: createId('faq'),
            category: 'General',
            question: 'New question?',
            answer: '',
          })}
          renderFields={(item, update) => (
            <>
              <Field label="Category">
                <BentoInput value={item.category} onChange={(e) => update({ category: e.target.value })} />
              </Field>
              <Field label="Question">
                <BentoInput value={item.question} onChange={(e) => update({ question: e.target.value })} />
              </Field>
              <Field label="Answer">
                <BentoTextarea rows={3} value={item.answer} onChange={(e) => update({ answer: e.target.value })} />
              </Field>
            </>
          )}
        />
      )}

      {section === 'modals' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <BentoCard className="space-y-3">
            <h3 className="font-bold text-lg">Quote Modal</h3>
            <Field label="Title">
              <BentoInput
                value={content.modals.quote.title}
                onChange={(e) =>
                  setContent({
                    ...content,
                    modals: { ...content.modals, quote: { ...content.modals.quote, title: e.target.value } },
                  })
                }
              />
            </Field>
            <Field label="Subtitle">
              <BentoTextarea
                rows={2}
                value={content.modals.quote.subtitle}
                onChange={(e) =>
                  setContent({
                    ...content,
                    modals: { ...content.modals, quote: { ...content.modals.quote, subtitle: e.target.value } },
                  })
                }
              />
            </Field>
            <Field label="Service Options (one per line)">
              <BentoTextarea
                rows={5}
                value={content.modals.quote.serviceOptions.join('\n')}
                onChange={(e) =>
                  setContent({
                    ...content,
                    modals: {
                      ...content.modals,
                      quote: {
                        ...content.modals.quote,
                        serviceOptions: e.target.value.split('\n').filter(Boolean),
                      },
                    },
                  })
                }
              />
            </Field>
          </BentoCard>
          <BentoCard className="space-y-3">
            <h3 className="font-bold text-lg">Video Modal</h3>
            <Field label="Title">
              <BentoInput
                value={content.modals.video.title}
                onChange={(e) =>
                  setContent({
                    ...content,
                    modals: { ...content.modals, video: { ...content.modals.video, title: e.target.value } },
                  })
                }
              />
            </Field>
            <Field label="Headline">
              <BentoInput
                value={content.modals.video.headline}
                onChange={(e) =>
                  setContent({
                    ...content,
                    modals: { ...content.modals, video: { ...content.modals.video, headline: e.target.value } },
                  })
                }
              />
            </Field>
            <Field label="Description">
              <BentoTextarea
                rows={2}
                value={content.modals.video.description}
                onChange={(e) =>
                  setContent({
                    ...content,
                    modals: { ...content.modals, video: { ...content.modals.video, description: e.target.value } },
                  })
                }
              />
            </Field>
            <Field label="Video URL (YouTube/Vimeo embed)">
              <BentoInput
                value={content.modals.video.videoUrl}
                onChange={(e) =>
                  setContent({
                    ...content,
                    modals: { ...content.modals, video: { ...content.modals.video, videoUrl: e.target.value } },
                  })
                }
              />
            </Field>
            <ImageField
              label="Thumb Image"
              value={content.modals.video.thumbImage}
              onChange={(url) =>
                setContent({
                  ...content,
                  modals: { ...content.modals, video: { ...content.modals.video, thumbImage: url } },
                })
              }
            />
          </BentoCard>
        </div>
      )}
    </section>
  );
}

function CollectionEditor<T extends { id: string }>({
  title,
  items,
  onChange,
  blank,
  renderFields,
}: {
  title: string;
  items: T[];
  onChange: (items: T[]) => void;
  blank: () => T;
  renderFields: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">{title}</h3>
        <BentoButton
          onClick={() => onChange([blank(), ...items])}
          className="!text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Add {title.slice(0, -1)}
        </BentoButton>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {items.map((item, idx) => (
          <BentoCard key={item.id} className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-500">#{idx + 1}</p>
              <BentoButton
                variant="danger"
                className="!py-1 !px-2 !text-[11px]"
                onClick={() => onChange(items.filter((x) => x.id !== item.id))}
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </BentoButton>
            </div>
            {renderFields(item, (patch) => {
              const next = [...items];
              next[idx] = { ...item, ...patch };
              onChange(next);
            })}
          </BentoCard>
        ))}
      </div>
    </div>
  );
}
