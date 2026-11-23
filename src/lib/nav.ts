import type { Messages } from '@/i18n/locales/en'
import { SOLUTIONS } from '@/data/catalog'
import { INDUSTRIES } from '@/data/industries'
import { BUSINESSES } from '@/data/businesses'
import { to } from './routes'

export interface NavLink { label: string; to: string; text?: string }
export interface NavItem { id: string; label: string; to: string; intro?: string; overview?: NavLink; children?: NavLink[]; match: string[] }

/** The main navigation row, in the order the brief requires. */
export function mainNav(m: Messages): NavItem[] {
  const n = m.nav
  return [
    { id: 'home', label: n.home, to: to.home(), match: ['/'] },
    {
      id: 'industries', label: n.industries, to: to.industries(), intro: n.industriesIntro, match: ['/industries'],
      overview: { label: n.allIndustries, to: to.industries() },
      children: INDUSTRIES.map((i) => ({ label: m.industries.items[i.id as keyof typeof m.industries.items].name, to: to.industry(i.id) })),
    },
    {
      id: 'products', label: n.productsServices, to: to.products(), intro: n.productsIntro, match: ['/products', '/solutions'],
      overview: { label: n.allProducts, to: to.products() },
      children: SOLUTIONS.map((s) => ({ label: m.solutions.items[s.id].name, to: to.solution(s.id), text: m.solutions.items[s.id].short })),
    },
    {
      id: 'businesses', label: n.businesses, to: to.businesses(), intro: n.businessesIntro, match: ['/businesses'],
      overview: { label: n.allBusinesses, to: to.businesses() },
      children: BUSINESSES.map((b) => ({ label: m.businesses.items[b.id].name, to: to.business(b.id), text: m.businesses.items[b.id].short })),
    },
    {
      id: 'resources', label: n.resources, to: to.resources(), intro: n.resourcesIntro, match: ['/resources', '/news'],
      overview: { label: n.allResources, to: to.resources() },
      children: [
        { label: n.resourcesMenu.documentation, to: to.resource('documentation') },
        { label: n.resourcesMenu.datasheets, to: to.resource('datasheets') },
        { label: n.resourcesMenu.news, to: to.news() },
        { label: n.resourcesMenu.insights, to: to.resource('insights') },
        { label: n.resourcesMenu.articles, to: to.resource('articles') },
      ],
    },
    {
      id: 'support', label: n.support, to: to.support(), intro: n.supportIntro, match: ['/support'],
      overview: { label: n.supportHome, to: to.support() },
      children: [
        { label: n.supportMenu.technical, to: to.support('technical') },
        { label: n.supportMenu.product, to: to.support('product') },
        { label: n.supportMenu.application, to: to.support('application') },
        { label: n.supportMenu.team, to: to.support('team') },
      ],
    },
    { id: 'contact', label: n.contact, to: to.contact(), match: ['/contact'] },
  ]
}

export function utilityNav(m: Messages): NavItem[] {
  return [
    { id: 'news', label: m.nav.news, to: to.news(), match: ['/news'] },
    { id: 'about', label: m.nav.about, to: to.about(), match: ['/about'] },
    { id: 'careers', label: m.nav.careers, to: to.careers(), match: ['/careers'] },
  ]
}

export const isActive = (item: NavItem, pathname: string) =>
  item.match.some((p) => (p === '/' ? pathname === '/' : pathname === p || pathname.startsWith(p + '/')))
