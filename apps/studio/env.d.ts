interface ImportMetaEnv {
  readonly SANITY_STUDIO_PROJECT_ID: string;
  readonly SANITY_STUDIO_DATASET: string;
  readonly SANITY_STUDIO_DEPLOY_HOOK_STAGING_VERCEL: string;
  readonly SANITY_STUDIO_DEPLOY_HOOK_STAGING_CF: string;
  readonly SANITY_STUDIO_DEPLOY_HOOK_PRODUCTION_VERCEL: string;
  readonly SANITY_STUDIO_DEPLOY_HOOK_PRODUCTION_CF: string;
  readonly SANITY_STUDIO_PREVIEW_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
