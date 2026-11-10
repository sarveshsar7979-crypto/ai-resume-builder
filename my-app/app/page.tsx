import { Hero, Nav } from "./_components/hero";
import { LandingSections } from "./_components/sections";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <Hero />
        <LandingSections />
      </main>
    </>
  );
}
