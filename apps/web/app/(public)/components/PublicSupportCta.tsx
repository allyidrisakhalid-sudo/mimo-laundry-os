type PublicSupportCtaProps = {
  context: "home" | "track" | "partners" | "help" | "footer";
};

const copyByContext: Record<PublicSupportCtaProps["context"], { title: string; body: string; cta: string }> = {
  home: {
    title: "Need help before you start?",
    body: "Talk to support on WhatsApp for quick guidance on pickup, tracking, or service areas.",
    cta: "Chat on WhatsApp",
  },
  track: {
    title: "Still need help?",
    body: "If your tracking details are unclear, support can help you check the next step.",
    cta: "Get tracking help",
  },
  partners: {
    title: "Want to talk through partnership?",
    body: "Message Mimo on WhatsApp to understand the affiliate flow before you apply.",
    cta: "Ask about partnership",
  },
  help: {
    title: "Need direct support?",
    body: "Use WhatsApp for order issues, delays, payment questions, or pickup support.",
    cta: "Contact support",
  },
  footer: {
    title: "Support on WhatsApp",
    body: "Fast, clear help when you need it.",
    cta: "Open WhatsApp",
  },
};

export function PublicSupportCta({ context }: PublicSupportCtaProps) {
  const content = copyByContext[context];
  const href = "https://wa.me/255788558975";

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="space-y-2">
        <h3 className="text-base font-semibold text-[var(--color-silk)]">{content.title}</h3>
        <p className="text-sm text-[var(--color-cloud)]">{content.body}</p>
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex rounded-full bg-[var(--color-silk)] px-4 py-2 text-sm font-medium text-[var(--color-midnight)]"
        >
          {content.cta}
        </a>
      </div>
    </section>
  );
}
