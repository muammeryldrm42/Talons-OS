import Link from "next/link";

export default function Page() {
  return (
    <main className="container grid" style={{ gap: 20 }}>
      <div className="panel">
        <span className="badge">Channels</span>
        <h1 style={{ fontSize: 36, marginTop: 16 }}>Channels</h1>
        <p className="muted">Connector setup, status, and inbound/outbound test actions.</p>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/inbox">Inbox</Link>
          <Link href="/agents">Agents</Link>
          <Link href="/channels">Channels</Link>
        </nav>
      </div>
    </main>
  );
}
