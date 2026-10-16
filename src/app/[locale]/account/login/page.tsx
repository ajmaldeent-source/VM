import type { Metadata } from "next";
import { redirect } from "next/navigation";
import GoogleButton from "@/components/GoogleButton";
import { getDictionary } from "@/content";
import { href, isLocale } from "@/i18n/config";
import { pageLocale, type LocaleParams } from "@/i18n/server";
import { missingAuthConfig } from "@/lib/auth";
import { currentUser } from "@/lib/guards";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getDictionary(locale).ui.account.loginTitle, robots: { index: false } } : {};
}

// Consumer entry point. Lives inside the public site (localized, same header/footer)
// and always returns to the consumer account, never to /admin.
type Props = LocaleParams & { searchParams: Promise<{ error?: string }> };

export default async function AccountLoginPage({ params, searchParams }: Props) {
  const locale = await pageLocale(params);
  const t = getDictionary(locale);
  const a = t.ui.account;
  const { error } = await searchParams;
  if (await currentUser()) redirect(href(locale, "/account"));

  return (
    <section className="container-x grid min-h-[80vh] place-items-center pb-16 pt-28">
      <div className="glass w-full max-w-sm p-8 text-center">
        <h1 className="text-2xl font-bold">{a.loginTitle}</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{a.loginBody}</p>
        {error && (
          <p role="alert" className="mt-6 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
            {t.ui.form.genericError}
          </p>
        )}
        {missingAuthConfig.length > 0 ? (
          <p className="mt-6 rounded-xl bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">{a.notConfigured}</p>
        ) : (
          <GoogleButton callbackUrl={href(locale, "/account")} label={a.continueGoogle} busyLabel={a.redirecting} />
        )}
      </div>
    </section>
  );
}
