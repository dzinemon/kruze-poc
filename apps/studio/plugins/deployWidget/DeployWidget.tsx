import { useState } from "react";
import { useCurrentUser } from "sanity";
import { Button, Card, Stack, Text, useToast } from "@sanity/ui";
import { EarthGlobeIcon, RocketIcon } from "@sanity/icons";

// ⚠️ SANITY_STUDIO_* env vars are bundled into client-side JS at build time.
// Webhook URLs are visible in browser network requests to any authenticated Studio user.
// For stricter secret hygiene, proxy through a server-side endpoint that holds the
// real URL and validates the caller's identity.
const WEBHOOKS = {
  staging: {
    vercel: import.meta.env.SANITY_STUDIO_DEPLOY_HOOK_STAGING_VERCEL,
    cf: import.meta.env.SANITY_STUDIO_DEPLOY_HOOK_STAGING_CF,
  },
  production: {
    vercel: import.meta.env.SANITY_STUDIO_DEPLOY_HOOK_PRODUCTION_VERCEL,
    cf: import.meta.env.SANITY_STUDIO_DEPLOY_HOOK_PRODUCTION_CF,
  },
};

type DeployTarget = "staging" | "production";

interface DeployResult {
  app: string;
  ok: boolean;
  error?: string;
}

async function triggerDeploy(target: DeployTarget): Promise<DeployResult[]> {
  const hooks = WEBHOOKS[target];

  const results = await Promise.allSettled([
    fetch(hooks.vercel, { method: "POST" }),
    fetch(hooks.cf, { method: "POST" }),
  ]);

  return [
    {
      app: "Next.js (Vercel)",
      ok: results[0].status === "fulfilled" && results[0].value.ok,
      error:
        results[0].status === "rejected"
          ? String(results[0].reason)
          : results[0].status === "fulfilled" && !results[0].value.ok
            ? results[0].value.statusText
            : undefined,
    },
    {
      app: "Astro (Cloudflare)",
      ok: results[1].status === "fulfilled" && results[1].value.ok,
      error:
        results[1].status === "rejected"
          ? String(results[1].reason)
          : results[1].status === "fulfilled" && !results[1].value.ok
            ? results[1].value.statusText
            : undefined,
    },
  ];
}

export function DeployWidget() {
  const toast = useToast();
  const [loading, setLoading] = useState<DeployTarget | null>(null);
  const currentUser = useCurrentUser();

  const isPublisher = currentUser?.roles?.some(
    (r) => r.name === "administrator" || r.name === "publisher",
  );

  const handleDeploy = async (target: DeployTarget) => {
    const label = target === "staging" ? "Staging" : "Production";
    const confirmed = window.confirm(
      `Deploy to ${label}? This will trigger a new build for both Next.js and Astro.`,
    );
    if (!confirmed) return;

    setLoading(target);
    try {
      const results = await triggerDeploy(target);
      const failed = results.filter((r) => !r.ok);

      if (failed.length === 0) {
        toast.push({
          status: "success",
          title: `${label} deploy triggered`,
          description: "Next.js (Vercel) + Astro (Cloudflare) builds started.",
        });
      } else {
        failed.forEach((r) => {
          toast.push({
            status: "error",
            title: `${r.app} deploy failed`,
            description: r.error,
          });
        });
        const succeeded = results.filter((r) => r.ok);
        if (succeeded.length > 0) {
          toast.push({
            status: "success",
            title: `${succeeded[0].app} deploy triggered`,
          });
        }
      }
    } catch (err) {
      toast.push({
        status: "error",
        title: "Deploy failed",
        description: String(err),
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card padding={4} shadow={1} radius={2} style={{ maxWidth: 320 }}>
      <Stack space={4}>
        <Text size={1} weight="semibold">
          Deploy
        </Text>

        <Stack space={2}>
          <Text size={1} muted>
            Triggers both Next.js (Vercel) and Astro (Cloudflare) builds.
          </Text>
        </Stack>

        <Button
          icon={RocketIcon}
          text={loading === "staging" ? "Deploying…" : "Deploy Staging"}
          tone="caution"
          disabled={!!loading}
          onClick={() => handleDeploy("staging")}
        />

        {isPublisher && (
          <Button
            icon={EarthGlobeIcon}
            text={loading === "production" ? "Deploying…" : "Deploy Live"}
            tone="critical"
            disabled={!!loading}
            onClick={() => handleDeploy("production")}
          />
        )}
      </Stack>
    </Card>
  );
}
