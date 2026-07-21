export const StoryCover = ({
  title,
  author,
  cover,
}: {
  title: string;
  author: string;
  cover: string;
}) => (
  <div
    className={`relative h-[140px] w-[104px] flex-none overflow-hidden rounded-[5px] shadow-[0_1px_2px_rgba(10,15,25,.25),0_14px_28px_-16px_rgba(10,15,25,.55)] transition-transform duration-[450ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:-translate-y-1 group-hover:-rotate-2 ${cover}`}
  >
    <div className="absolute inset-[7px] flex flex-col items-center justify-center gap-[7px] rounded-[2px] border border-white/30 px-2 py-2 text-center">
      <span className="text-[6.5px] font-bold tracking-[0.22em] uppercase opacity-70">
        HerVoice &middot; 2026
      </span>
      <span className="font-serif text-xs leading-[1.05] font-medium italic">
        {title}
      </span>
      <span className="h-px w-[18px] bg-current opacity-50" />
      <span className="text-[6.5px] font-semibold tracking-[0.16em] uppercase opacity-60">
        {author}
      </span>
    </div>
    <span className="absolute top-0 bottom-0 left-0 w-[5px] bg-black/20 shadow-[inset_-1px_0_0_rgba(255,255,255,.12)]" />
  </div>
);
