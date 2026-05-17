"use client";

const Hero = () => {
  return (
    <section
      id="hero"
      className="flex flex-col items-center gap-4 py-20 text-center"
    >
      <h1 className="text-2xl font-bold">Hero Section</h1>
    </section>
  );
};

export default function LandingPage() {
  return <Hero />;
}
