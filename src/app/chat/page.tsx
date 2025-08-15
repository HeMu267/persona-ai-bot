import ChatPageInner from "./ChatPageInner";

export default function Page({ searchParams }: { searchParams: { persona?: string } }) {
  const personaKey = searchParams.persona || "hiteshPersona";

  return <ChatPageInner personaKey={personaKey} />;
}
