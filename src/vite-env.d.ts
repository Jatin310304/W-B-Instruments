/// <reference types="vite/client" />
interface ImportMetaEnv {
  /** Set to "true" on the live site so forms post to /api/enquiry and /api/careers. */
  readonly VITE_ENQUIRY_ENABLED?: string
  /** Set to "true" to list the pseudo-locale in the language selector (translation QA only). */
  readonly VITE_I18N_PSEUDO?: string
}
