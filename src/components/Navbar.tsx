"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useSiteContent } from "./SiteContentProvider";

interface NavbarProps {
  onOpenQuote: () => void;
  activePage: string;
  setActivePage: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenQuote,
  activePage,
  setActivePage,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopDropdown, setDesktopDropdown] = useState<
    "it" | "digital" | null
  >(null);
  const dropdownTimeoutRef = useRef<number | null>(null);
  const { content } = useSiteContent();
  const mainNavItems = content.nav.items.filter(
    (item) => item.visible && item.id !== "faq"
  );

  const homeLabel =
    content.nav.items.find((item) => item.id === "home")?.label || "Home";
  const aboutLabel =
    content.nav.items.find((item) => item.id === "about")?.label || "About Us";
  const projectsLabel =
    content.nav.items.find((item) => item.id === "projects")?.label ||
    "Case Studies";
  const blogLabel =
    content.nav.items.find((item) => item.id === "blog")?.label || "Blog";
  const contactLabel = content.nav.contactLabel;

  const getLinkClass = (active: boolean) =>
    `transition-colors duration-200 hover:text-white px-3.5 py-1.5 cursor-pointer whitespace-nowrap ${
      active ? "text-[#3b82f6] font-semibold" : "text-slate-300"
    }`;

  const itServices = [
    "Mobile App Development",
    "Website Development",
    "Custom Software Development",
    "AI Automation",
    "SaaS Development",
    "Cloud Solutions",
    "UI/UX Design",
    "Graphic Design",
  ];

  const digitalServices = [
    "SEO",
    "Social Media Management",
    "Content Creation",
    "Maintenance & Support",
  ];

  const clearDropdownTimeout = () => {
    if (dropdownTimeoutRef.current) {
      window.clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
  };

  const openDropdown = (type: "it" | "digital") => {
    clearDropdownTimeout();
    setDesktopDropdown(type);
    dropdownTimeoutRef.current = window.setTimeout(() => {
      setDesktopDropdown(null);
      dropdownTimeoutRef.current = null;
    }, 2000);
  };

  const closeDropdown = () => {
    clearDropdownTimeout();
    setDesktopDropdown(null);
  };

  useEffect(() => {
    return () => {
      clearDropdownTimeout();
    };
  }, []);

  const handleNavClick = (id: string) => {
    setActivePage(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMobileMenuOpen(false);
    closeDropdown();
  };

  const handleServiceClick = (serviceTitle: string) => {
    setActivePage("services");
    setMobileMenuOpen(false);
    closeDropdown();
    onOpenQuote(serviceTitle);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0d151c] border-b border-white/5 px-4 sm:px-8 lg:px-12 py-2 shadow-sm h-14 sm:h-16">
      <div className="max-w-[1500px] mx-auto flex items-center justify-between">
        <div
          onClick={() => handleNavClick("home")}
          className="flex items-center cursor-pointer group pr-2 sm:pr-4"
          id="navbar-logo"
        >
          <img
            src={content.brand.logoNav}
            alt={content.brand.name}
            className="h-10 sm:h-12 w-auto min-w-[13rem] sm:min-w-[15rem] object-contain object-left"
          />
        </div>

        <nav className="hidden lg:flex items-center ml-auto px-2 relative">
          <ul className="flex items-center gap-3 text-xs xl:text-sm font-medium">
            <li>
              <button
                onClick={() => handleNavClick("home")}
                className={getLinkClass(activePage === "home")}
              >
                {homeLabel}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick("about")}
                className={getLinkClass(activePage === "about")}
              >
                {aboutLabel}
              </button>
            </li>
            <li className="relative" onMouseEnter={() => openDropdown("it")}>
              <button
                onClick={() =>
                  desktopDropdown === "it"
                    ? closeDropdown()
                    : openDropdown("it")
                }
                className={getLinkClass(activePage === "services")}
              >
                IT Services
              </button>
              {desktopDropdown === "it" && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-[#111921] border border-white/10 rounded-2xl shadow-2xl p-4 space-y-2 z-50">
                  {itServices.map((service) => (
                    <button
                      key={service}
                      onClick={() => handleServiceClick(service)}
                      className="w-full text-left text-sm text-slate-300 hover:text-white transition-colors"
                    >
                      {service}
                    </button>
                  ))}
                </div>
              )}
            </li>
            <li
              className="relative"
              onMouseEnter={() => openDropdown("digital")}
            >
              <button
                onClick={() =>
                  desktopDropdown === "digital"
                    ? closeDropdown()
                    : openDropdown("digital")
                }
                className={getLinkClass(activePage === "services")}
              >
                Digital Marketing Services
              </button>
              {desktopDropdown === "digital" && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-[#111921] border border-white/10 rounded-2xl shadow-2xl p-4 space-y-2 z-50">
                  {digitalServices.map((service) => (
                    <button
                      key={service}
                      onClick={() => handleServiceClick(service)}
                      className="w-full text-left text-sm text-slate-300 hover:text-white transition-colors"
                    >
                      {service}
                    </button>
                  ))}
                </div>
              )}
            </li>
            <li>
              <button
                onClick={() => handleNavClick("projects")}
                className={getLinkClass(activePage === "projects")}
              >
                {projectsLabel}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick("blog")}
                className={getLinkClass(activePage === "blog")}
              >
                {blogLabel}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick("contact")}
                className={getLinkClass(activePage === "contact")}
              >
                {contactLabel}
              </button>
            </li>
          </ul>
        </nav>

        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenQuote}
            id="navbar-quote-btn"
            className="bg-[#2563eb] text-white font-semibold px-5 py-2.5 rounded-full flex items-center gap-2.5 hover:bg-[#1d4ed8] transition-all shadow-md group cursor-pointer hover:scale-105"
          >
            <span className="text-xs sm:text-sm">{content.nav.ctaLabel}</span>
            <div className="w-6 h-6 rounded-full bg-white text-[#2563eb] flex items-center justify-center group-hover:bg-slate-100 transition-colors">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-slate-200 p-2 rounded-lg bg-[#18232c] hover:bg-[#18232c]/80 border border-white/10 cursor-pointer"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden mt-4 pb-4 px-2 pt-2 border-t border-white/10 flex flex-col gap-2 bg-[#111921] rounded-2xl p-4 shadow-lg border border-white/10">
          {mainNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-left py-2.5 px-3 text-sm font-medium ${
                activePage === item.id
                  ? "text-white font-bold"
                  : "text-slate-200 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick("contact")}
            className={`text-left py-2.5 px-3 text-sm font-medium ${
              activePage === "contact"
                ? "text-white font-bold"
                : "text-slate-200 hover:text-white"
            }`}
          >
            {content.nav.contactLabel}
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenQuote();
            }}
            className="w-full bg-[#2563eb] text-white font-bold py-3 rounded-full flex items-center justify-center gap-2 shadow-lg hover:bg-[#1d4ed8]"
          >
            <span>{content.nav.ctaLabel}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
};
