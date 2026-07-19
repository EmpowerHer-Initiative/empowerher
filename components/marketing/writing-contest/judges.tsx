import { Reveal } from "@/components/reveal";

const judges = [
  {
    name: "Dr. Susan M. Blaustein",
    description:
      "Dr. Susan M. Blaustein is the Founding Board Chair and President of WomenStrong International, a global nonprofit that supports local feminist leaders advancing the rights of women and girls worldwide. She previously co-founded and directed the Millennium Cities Initiative at Columbia University's Earth Institute and has worked on conflict prevention and international justice with leading global organizations. A writer and journalist, she has reported on global politics and social justice for major publications including The New Yorker and The Wall Street Journal. Dr. Blaustein teaches at Columbia University's Climate School, holds a doctorate from Yale University, was a Harvard Junior Fellow, and has received numerous honors, including a Guggenheim Fellowship and the Ban Ki-moon Award for Women's Empowerment.",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTnlKrZzPQgRrhjkv2mNoAG6Y5KExwBW7Cqs1O",
  },
  {
    name: "Dr. Ellen Leggett",
    description:
      "Dr. Ellen Leggett is a psychologist with a lifelong passion for supporting the education of girls and women. She graduated from Mount Holyoke College, the first U.S. college founded for women, and was Associate Dean of Students at Scripps College, an esteemed California college for women. Most recently, she has been Professor of Psychology at the University of Southern California and Founding Director of the Master's in Applied Psychology program there, where she has taught students from all over the world. She holds master's and doctoral degrees in Human Development and Education from Harvard University.",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPT5RG1ajWxDjwpl6zcWuZFSE0gC1TOnBMHdPh3",
  },
  {
    name: "Dr. Sonia Palmieri",
    description:
      "Associate Professor Dr. Sonia Palmieri is Head of the Department of Pacific Affairs at the Coral Bell School of Asia and Pacific Affairs, Australian National University. Her research focuses on women's leadership in political institutions, particularly gender-sensitive parliaments. She is a leading contributor to both the theory and practice of inclusive and feminist research methodologies.",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTK2M6BgCVy1oGkRMuS0Lravl9JbQIxWFcNhtq",
  },
  {
    name: "Dr. Marilyn Sides",
    description:
      "Dr. Marilyn Sides is an Associate Teaching Professor in the Department of English and Creative Writing at Wellesley College, where she also serves as Director of Creative Writing. She is affiliated with the Comparative Literary Studies Program. Marilyn is the author of the short story collection The Island of the Mapmaker's Wife and the novel The Genius of Affection. At Wellesley, she teaches creative writing as well as literature courses.",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTEXcdsbfRbjSv9fDHMpJXBriOWVtPmoQZNC3q",
  },
  {
    name: "Patrick M. Erwin",
    description:
      "Patrick M. Erwin is the Curriculum Director at the Maxwell Leadership Foundation, with extensive experience in education and leadership development. He previously served 17 years as a high school band director in Cobb County, Georgia. Patrick holds degrees in Political Science, Music Education, and Leadership, and is an award-winning speaker who presents nationally on leadership, student engagement, and professional growth.",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTPp5idDYhZvxtB3ycfP5jQXiMRAWOCrnJ2oYe",
  },
  {
    name: "Andrew McPeak",
    description:
      "Andrew McPeak is an author, researcher, and expert on emerging generations with over a decade of experience working with young adults across education and professional settings. He is the co-host of the School on a Mission Podcast, co-author of Marching off the Map (2017) and Generation Z Unfiltered (2019), and the author of Ready for Real Life (2023).",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTtLlBep7RH9uDZYO2eqksXLbgS5pT0fia4Unh",
  },
  {
    name: "Bella Fisher",
    description:
      "Bella Fisher is a junior at Miss Hall's School in Massachusetts and grew up on a farm in Berkshire County. She has a strong interest in creative writing and the arts, particularly prose and fiction, and enjoys exploring literary and artistic projects. She is an editor at the literary magazine Girls Write the World, where she helps amplify young voices through writing and editorial work. Bella is passionate about supporting other young writers and aspires to publish her own work in the future.",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPT3cvDJJKpPsIbjXnuoAM3O2JygVY8KzGFtD6k",
  },
  {
    name: "Maia Roberts",
    description:
      "Maia Roberts is a junior at Miss Hall's School, where she pursues advanced coursework in English and history with a particular focus on feminist studies. Her academic work has earned her placement on the Head's List each semester of high school. She is an editor at the international literary journal Girls Right the World, where she contributes to elevating young voices through writing and editorial work. Maia believes in the importance of using literature and education to explore gender equity and amplify underrepresented perspectives.",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPT1n9bdNM2QzEuUaBX9YLlpwGm6Z8oisI4dSv7",
  },
  {
    name: "Juliet Hopkins",
    description:
      "Juliet Hopkins is a junior at Miss Hall's School and is originally from Rabun County, Georgia. She has a strong interest in creative writing and oil painting, and she balances her artistic pursuits with athletics as a varsity volleyball player. She is an editor at the literary magazine Girls Right the World, where she helps amplify young voices through writing and editorial work. Juliet believes in the importance of uplifting the voices of refugee girls and learning more about their experiences and backgrounds.",
    image:
      "https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTDbXy77h0fiZ3z8JjCWsbc2laUL6tAeqPnMNS",
  },
];

export const Judges = () => (
  <section className="bg-foreground/[0.025] py-28 md:py-40">
    <div className="container">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
            The Panel
          </p>
          <h2 className="mt-5 font-serif text-4xl leading-[1.1] md:text-5xl">
            Our Judges
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {judges.map((judge, i) => (
            <Reveal asChild key={judge.name} delay={(i % 3) * 80}>
              <div>
                <div className="aspect-square overflow-hidden rounded-2xl">
                  <img
                    src={judge.image}
                    alt={judge.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mt-5 font-serif text-2xl">{judge.name}</h3>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  {judge.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Thank you + sponsors */}
        <Reveal asChild>
          <div className="mt-20 space-y-10">
            <p className="text-muted-foreground mx-auto max-w-2xl text-center text-base leading-relaxed font-medium md:text-lg">
              We thank our judges for their support of this contest and
              appreciate their time and effort to help Afghan girls share their
              voices globally.
            </p>
            <div className="border-border/60 bg-background rounded-3xl border p-10 text-center shadow-sm md:p-14">
              <p className="mx-auto max-w-3xl font-serif text-xl leading-relaxed md:text-2xl">
                Special thanks to our sponsors, the Solebury School community in
                Pennsylvania, United States, and the Afghan Girls Financial
                Assistance Fund (AGFAF) in New Jersey, United States, for their
                generous donations to our efforts to uplift and support Afghan
                girls through HerVoice.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
                <div className="bg-muted/50 size-56 overflow-hidden rounded-2xl">
                  <img
                    src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTytzgM9tSQWCPTDEdgq92vwoMZR87xBLuIAfs"
                    alt="Solebury School"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="bg-background border-border/60 flex w-56 items-center justify-center overflow-hidden rounded-2xl border p-4">
                  <img
                    src="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTpavV7aqrM0zsm5gThJ2eDxZtjCFUdBGElvb1"
                    alt="AGFAF"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);
