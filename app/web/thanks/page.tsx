import Link from "next/link";
import { redirect } from "next/navigation";

type ThanksPageProps = {
  searchParams: Promise<{ paid?: string; plan?: string }>;
};

const PLAN_LABEL: Record<string, string> = {
  monthly: "Monthly License",
  annual: "Annual License",
};

export default async function ThanksPage({ searchParams }: ThanksPageProps) {
  const params = await searchParams;
  const isPaid = params.paid === "1";

  if (!isPaid) {
    redirect("/web/payment");
  }

  const plan = params.plan ?? "annual";
  const planLabel = PLAN_LABEL[plan] ?? "Selected License";

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-16 sm:py-20">
      <section className="rounded-3xl border border-emerald-400/30 bg-emerald-500/10 p-8 text-center sm:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">Payment confirmed</p>
        <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Thanks, your MC Lucy license is active</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-200">
          Plan activated: <span className="font-semibold text-emerald-200">{planLabel}</span>
        </p>
        <p className="mt-2 text-sm text-slate-300">
          You can now continue to Mission Control and start operating with your selected plan.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/app"
            className="rounded-md bg-emerald-300 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-200"
          >
            Open Mission Control
          </Link>
          <Link
            href="/web/landing"
            className="rounded-md border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-emerald-300 hover:text-emerald-200"
          >
            Back to Landing
          </Link>
        </div>
      </section>
    </div>
  );
}
