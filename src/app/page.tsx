import PersonaCard from "../components/viewCard";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-b from-gray-900 to-black text-white px-6">
      {/* Hero */}
      <section className="text-center m-2 md:m-5 lg:m-6 max-w-3xl mb-16">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Persona AI — Chat with Hitesh & Piyush (AI Edition)
        </h1>
        <p className="text-lg md:text-xl text-gray-300">
          Choose a persona and start chatting with AI versions of your favorite tech creators.
        </p>
      </section>

      {/* View Cards */}
      <section className="grid gap-8 md:m-4 md:grid-cols-2 max-w-5xl">
        <PersonaCard
          name="Hitesh Choudhary"
          image="/hitesh.png"
          personaId="hitesh"
        />
        <PersonaCard
          name="Piyush Garg"
          image="/piyush.webp"
          personaId="piyush"
        />
      </section>

      {/* Footer */}
      <footer className="mt-20 text-gray-500 text-sm">
        © {new Date().getFullYear()} Persona AI BOT
      </footer>
    </main>
  );
}
