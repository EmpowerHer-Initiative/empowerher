import { Reveal } from "@/components/reveal";

const JUDGES = [
  {
    name: "Dr. Ellen Leggett",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPT5RG1ajWxDjwpl6zcWuZFSE0gC1TOnBMHdPh3",
    title:
      "Professor of Psychology and Founding Director of Applied Psychology Master’s Program (Retired), University of Southern California",
    quote:
      "It was an honor to read about and bear witness to the incredibly moving stories told by these writers. Many of us aspire to be courageous and to overcome adversity in our lives, and the writings of these Afghan women teach us all a humbling lesson. With elegant beauty and wisdom, the inspirational stories recounted by these writers demonstrate strength of character, love of learning, and the best of human persistence and resilience in the face of pain. A reverberating question stays with me: What feats would these remarkable women accomplish in a world that welcomed them? And the world does need them. Let their voices teach you.",
  },
  {
    name: "Dr. Susan M. Blaustein",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTnlKrZzPQgRrhjkv2mNoAG6Y5KExwBW7Cqs1O",
    title:
      "Instructor, Columbia University, Founder/Board Chair, WomenStrong International",
    quote:
      "My immediate impression, when reading the submissions, was that this body of work has been produced by an extraordinarily talented, capable, bold, and determined group of young women. I was deeply moved by their courage, grit, and refusal to be restrained in shadow and silence. These are young women who, like all young women and girls everywhere, have dreams, rights, and hopes for their futures, yet in far too many cruel places on earth, those dreams and rights are denied. I am honored to have worked closely with Afghan women and girls over the past seven years as they have repeatedly faced and overcome seemingly insurmountable challenges. We must continue to raise awareness of, and refuse to tolerate, this tremendous injustice, which threatens the future and promise of Afghanistan and stands in clear violation of the rights of women and girls.",
  },
  {
    name: "Dr. Sonia Palmieri",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTK2M6BgCVy1oGkRMuS0Lravl9JbQIxWFcNhtq",
    title:
      "Associate Professor, Department of Pacific Affairs, Australian National University",
    quote:
      "I was incredibly moved by the stories of bravery, confidence, tragedy and injustice shared by the Afghan artists. As an academic, creative writing is something I admire, perhaps in part because it is so difficult for me. But the huge response to the EmpowerHer writing competition shows that there is a wealth of creativity among Afghan women, and that writing can be a powerful way to process a range of both conflicting and complementary emotions — sadness, rage, frustration, joy. Certainly, the entrants wanted to share a profound sense of injustice at the hands of the Taliban. They did this with strong, pictorial clarity. Yet this was always underpinned by narratives of resilience and hope. Afghan women’s refusal of defeat in such conditions will change the world.",
  },
];

export const JudgeTestimonials = () => (
  <section className="bg-white px-6 py-16 md:py-24">
    <div className="mx-auto max-w-5xl">
      <Reveal asChild>
        <h2 className="text-center font-[family-name:var(--hv-display)] text-3xl font-bold tracking-tight md:text-4xl">
          What Our Judges Felt Reading These Stories
        </h2>
      </Reveal>

      <div className="mt-14 space-y-10">
        {JUDGES.map((judge, i) => (
          <Reveal asChild key={judge.name} delay={i * 100}>
            <div className="flex flex-col gap-8 rounded-2xl border border-[#ECE3D2] bg-[var(--hv-paper)] p-8 md:flex-row md:p-10">
              <img
                src={judge.image}
                alt={judge.name}
                className="h-40 w-40 shrink-0 self-center rounded-2xl border-2 border-[var(--hv-gold)]/40 object-cover md:self-start"
              />
              <div className="flex-1">
                <blockquote className="font-[family-name:var(--hv-serif-i)] text-[17px] leading-relaxed text-[var(--hv-ink2)] italic">
                  &ldquo;{judge.quote}&rdquo;
                </blockquote>
                <div className="mt-6">
                  <div className="h-px w-full bg-[var(--hv-gold)]/30" />
                  <div className="mt-4">
                    <p className="font-[family-name:var(--hv-display)] text-sm font-bold text-[var(--hv-ink)]">
                      {judge.name}
                    </p>
                    <p className="mt-0.5 text-xs leading-snug text-[var(--hv-ink3)]">
                      {judge.title}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
