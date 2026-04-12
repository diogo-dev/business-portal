import MissionSection from "./_components/MissionSection/MissionSection";

export default function Home() {
  return (
    <>
      <main style={{ position: "relative", zIndex: 1, width: "100%" }}>
        <section id="mission">
          <MissionSection />
        </section>
      </main>
    </>
  );
}
