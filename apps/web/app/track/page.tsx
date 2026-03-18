import { PublicSupportCta } from "../(public)/components/PublicSupportCta";

export default function TrackPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="max-w-2xl space-y-3">
        <h1 className="text-3xl font-semibold">Track your order</h1>
        <p className="text-sm leading-6 text-[var(--color-cloud)]">
          Enter your order reference to check the latest visible status.
        </p>
      </div>

      <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
        <form className="grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-medium">Order reference</span>
            <input
              type="text"
              placeholder="Enter your order reference"
              className="rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-sm outline-none"
            />
          </label>
          <div>
            <button
              type="submit"
              className="rounded-full bg-[var(--color-silk)] px-5 py-3 text-sm font-medium text-[var(--color-midnight)]"
            >
              Check status
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold">Result</h2>
        <p className="mt-3 text-sm text-[var(--color-cloud)]">
          Tracking results will appear here when a valid order reference is found.
        </p>
      </div>

      <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold">How tracking works</h2>
        <p className="mt-3 text-sm text-[var(--color-cloud)]">
          Status updates follow the order timeline so you can understand what has happened and what comes next.
        </p>
      </div>

      <div className="mt-8">
        <PublicSupportCta context="track" />
      </div>
    </div>
  );
}
