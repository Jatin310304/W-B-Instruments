import { COMPANY as C, LEGAL } from '@/data/company'
import type { LegalId } from '@/data/site'

/**
 * Legal page bodies. Published in English only (translations of legal text need legal approval).
 * Privacy and Copyright carry over the v9 wording, updated for what this website actually does.
 * The other eight pages are placeholders: they say what the page will contain and state only facts about this website's code.
 * `[[TBC: ...]]` renders as a visible "to be confirmed" marker.
 */
export type Block = { p: string } | { ul: string[] } | { h: string }
export interface LegalDoc { kind: 'draft' | 'placeholder'; lead: string; sections: { id: string; title: string; body: Block[] }[] }

const v = (val: string | boolean, what: string) => (val ? String(val) : `[[TBC: ${what}]]`)
const ENTITY = `${C.legalName} (ACN ${C.acn})`

const placeholder = (lead: string, willContain: string[], facts: string[] = []): LegalDoc => ({
  kind: 'placeholder',
  lead,
  sections: [
    { id: 'contains', title: 'What this page will contain', body: [{ ul: willContain }] },
    ...(facts.length ? [{ id: 'facts', title: 'What we can say about this website today', body: [{ ul: facts }] as Block[] }] : []),
  ],
})

export const LEGAL_DOCS: Record<LegalId, LegalDoc> = {
  privacy: {
    kind: 'draft',
    lead: 'How W&B Instruments collects, uses and protects the personal information you share through this website.',
    sections: [
      { id: 'who', title: 'Who we are', body: [
        { p: `This notice explains how ${ENTITY}, trading as W&B Instruments (“we”, “us”), handles personal information collected through this website. We are based at ${C.addressLine}.` },
        { p: 'It covers this website only. It does not cover information we collect in other ways, such as over the phone, by email sent directly to us, or when you buy from us.' },
      ] },
      { id: 'collect', title: 'Information you give us', body: [
        { p: 'We only collect personal information through this website when you choose to send it to us:' },
        { ul: [
          'Enquiry form: your full name, email address, enquiry type, message and privacy consent (required); your company, phone number and the product or service you are interested in (optional).',
          'Careers expression of interest: your full name, email address, area of interest, message and consent (required); your phone number and CV (optional).',
        ] },
        { p: 'Please don’t include sensitive information (such as health information) in a message or CV unless it is needed. You don’t have to give us personal information to browse the website, and you can contact us by phone instead.' },
      ] },
      { id: 'auto', title: 'Information collected automatically', body: [
        { p: 'No cookies, analytics or tracking. This website does not set cookies and does not use analytics, advertising or social media tracking. Fonts and images are served from this website, not from third parties.' },
        { p: 'Preferences stored in your browser. If you choose a language or a country or region, your choice is saved in your browser’s local storage so the site remembers it. It stays on your device and is not sent to us. You can remove it at any time by clearing this website’s data in your browser.' },
        { p: `Technical information. Like any website, our server receives your device’s IP address and basic request details so it can deliver pages. Our hosting provider, ${v(LEGAL.hosting, 'website hosting provider and server location')}, may keep its own server logs under its own policies.` },
      ] },
      { id: 'why', title: 'Why we use it', body: [
        { ul: [
          'to respond to your enquiry, prepare a quotation or arrange a calibration you asked for;',
          'to consider your expression of interest for current or future roles;',
          'to keep a record of enquiries so we can follow up and help you if you contact us again.',
        ] },
        { p: 'We do not sell your personal information. Sending an enquiry does not add you to a mailing list.' },
      ] },
      { id: 'store', title: 'How it is stored and protected', body: [
        { p: 'We take reasonable steps to protect personal information from misuse, interference, loss and unauthorised access, modification or disclosure. No method of transmission or storage is completely secure.' },
        { p: `We keep enquiry records for ${v(LEGAL.retention, 'retention period for enquiry records, emails and CVs')}, after which we delete them or make them anonymous unless the law requires us to keep them longer.` },
      ] },
      { id: 'share', title: 'Who we share it with', body: [
        { ul: [
          `Our hosting provider: ${v(LEGAL.hosting, 'website hosting provider and server location')}.`,
          `Our email service, which delivers form submissions to our team: ${v(LEGAL.emailService, 'email service provider')}.`,
          'Others when required by law, for example a court or regulator.',
        ] },
        { p: `If a provider stores information outside Australia, your information may be held overseas. ${v(LEGAL.overseas, 'whether any provider stores information outside Australia, and in which countries')}` },
      ] },
      { id: 'rights', title: 'Your choices and rights', body: [
        { p: 'You can ask us to tell you what personal information we hold about you from this website, correct or update it, or delete information we no longer need, unless we have to keep it by law. To make a request, contact us using the details below.' },
      ] },
      { id: 'complaints', title: 'Contact us and complaints', body: [
        { p: `Privacy requests and complaints are handled by ${v(LEGAL.privacyContact, 'name or role of the person who handles privacy requests')}. Email ${LEGAL.privacyEmail || C.email}, call ${C.phone}, or write to ${C.legalName}, ${C.addressLine}.` },
        { p: 'If you are not satisfied with our response, you may be able to complain to the Office of the Australian Information Commissioner (oaic.gov.au).' },
      ] },
      { id: 'law', title: 'Laws we follow', body: [
        { p: `We are an Australian company and handle personal information in line with the Australian Privacy Principles in the Privacy Act 1988 (Cth). ${LEGAL.privacyActConfirmed ? '' : '[[TBC: whether the Privacy Act 1988 applies to W&B Instruments or the company follows it voluntarily (small business exemption)]]'}` },
      ] },
      { id: 'changes', title: 'Changes to this notice', body: [{ p: 'We may update this notice when our website, our practices or the law change. The updated notice will be posted on this page with a new effective date.' }] },
    ],
  },
  copyright: {
    kind: 'draft',
    lead: 'Who owns the content on this website, how you may use it, and how to raise a concern.',
    sections: [
      { id: 'notice', title: 'Copyright notice', body: [
        { p: `The content of this website, including its text, design, graphics and the W&B Instruments name and logo, is owned by or licensed to ${ENTITY}, unless we say otherwise. ${LEGAL.contentOwnershipConfirmed ? '' : '[[TBC: that W&B owns, or is licensed to use, all text, photographs and graphics, including manufacturer product images]]'}` },
        { p: 'It is protected by copyright and other laws, including the Copyright Act 1968 (Cth).' },
      ] },
      { id: 'third', title: 'Third-party brands and material', body: [
        { p: 'The names, logos and trade marks of the manufacturers we represent, including Senseca, Delta OHM, Sensortherm, Status Instruments and Giussani, belong to their respective owners and are used to identify their products.' },
        { p: 'Metaval Engineering and Metaval Alloys are separate brands. Information on the Our Businesses pages is taken from their websites, which are linked on each page.' },
        { p: 'Images labelled “Studio render” are computer-generated illustrations. They do not show a specific manufacturer’s product or W&B’s premises.' },
      ] },
      { id: 'photos', title: 'Photo credits', body: [
        { p: 'Some industry photographs come from Wikimedia Commons and are used under the licences shown. They illustrate the industry and do not show W&B’s premises or customers.' },
        { p: 'Induction heating of a steel bar: C Paice, CC BY-SA 3.0 (creativecommons.org/licenses/by-sa/3.0). Source: commons.wikimedia.org/wiki/File:Induction_heating_of_bar.jpg. Resized.' },
        { p: 'Glass-making electric furnace: Paul Harrison, CC BY-SA 4.0 (creativecommons.org/licenses/by-sa/4.0). Source: commons.wikimedia.org/wiki/File:Glass-making_Electric_Furnace_1.jpg. Resized.' },
        { p: 'Weather station: Scott Bauer, USDA, public domain. Source: commons.wikimedia.org/wiki/File:Weather_Station_USDA.jpg.' },
      ] },
      { id: 'report', title: 'Reporting a concern', body: [{ p: `If you believe material on this website infringes your rights, email ${C.email} with the page address and details of your concern.` }] },
    ],
  },
  cookies: placeholder('How this website uses cookies and similar technologies.', ['The cookie policy approved by W&B Instruments', 'How to manage cookie choices, if cookies are introduced'], [
    'This website does not set cookies.',
    'It stores your language and country or region choice in your browser’s local storage, which you can clear at any time.',
  ]),
  terms: placeholder('The terms that apply when you use this website.', ['Terms of use approved by W&B Instruments', 'Any terms of sale, if W&B publishes them']),
  imprint: placeholder('Company identification details.', ['Registered company details approved by W&B Instruments'], [
    `Company: ${C.legalName}, ACN ${C.acn}`,
    `Address: ${C.addressLine}`,
    `Phone: ${C.phone} · Email: ${C.email}`,
  ]),
  accessibility: placeholder('Our approach to making this website accessible, and how to report a problem.', ['An accessibility statement approved by W&B Instruments', 'Known limitations and how to request information in another format'], [
    `If something on this website is hard to use, call ${C.phone} or email ${C.email} and we will help.`,
  ]),
  'communication-preferences': placeholder('How to choose which communications you receive from us.', ['How to subscribe to or unsubscribe from W&B communications, if W&B introduces them'], [
    'Sending an enquiry through this website does not add you to a mailing list.',
  ]),
  'resource-availability': placeholder('Availability of documents, datasheets and other resources.', ['Which resources W&B publishes, in which formats, and how to request them'], [
    'Datasheets are not yet published on this website; they can be requested from the Product Datasheets page.',
  ]),
  'do-not-sell': placeholder('Your choices about the sale or sharing of personal information.', ['W&B Instruments’ approved statement and request process'], [
    'The current Privacy Notice states that we do not sell your personal information.',
  ]),
  governance: placeholder('Information about W&B Instruments’ governance.', ['Governance information approved by W&B Instruments']),
  'machine-readable-files': placeholder('Machine-readable files published by W&B Instruments.', ['Any machine-readable disclosures W&B is required to or chooses to publish'], [
    'This website publishes sitemap.xml and robots.txt for search engines.',
  ]),
}
