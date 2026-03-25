import Link from "next/link";

const cards = [
  {
    title: "Multi-channel inbox",
    text: "Route WebChat, Telegram, Discord, Slack, and webhook traffic into a single control plane."
  },
  {
    title: "Agents + tools",
    text: "Bind channel traffic to agents that can use memory, retrieval, workflows, and tools."
  },
  {
    title: "Operations",
    text: "Inspect logs, jobs, usage, connector health, and knowledge ingestion from the dashboard."
  }
];

export default function HomePage() {
  return (
    <main className="container grid" style={{ gap: 24 }}>
      <section className="panel">
        <span className="badge">TalonsOS v0.1 scaffold</span>
        <h1 style={{ fontSize: 44, marginTop: 18 }}>A cleaner open-source AI control plane.</h1>
        <p className="muted" style={{ fontSize: 18, maxWidth: 780 }}>
          This starter repo gives you the foundation for a full-stack multi-channel AI platform:
          control panel, gateway, workers, connectors, tools, memory, RAG, workflows, and secure secret handling.
        </p>
        <nav>
          <Link href="/dashboard">Open dashboard</Link>
          <Link href="/inbox">Inbox</Link>
          <Link href="/agents">Agents</Link>
          <Link href="/channels">Channels</Link>
          <Link href="/settings">Settings</Link>
        </nav>
      </section>

      <section className="grid grid-3">
        {cards.map((card) => (
          <div key={card.title} className="panel">
            <h2>{card.title}</h2>
            <p className="muted">{card.text}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
