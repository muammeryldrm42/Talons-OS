import * as React from "react";

export function SectionCard(props: { title: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        background: "#121933",
        border: "1px solid #22305b",
        borderRadius: 18,
        padding: 20
      }}
    >
      <h2 style={{ marginTop: 0 }}>{props.title}</h2>
      {props.children}
    </section>
  );
}
