import Link from "next/link";

interface WrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export const Wrapper = ({ title, description, children }: WrapperProps) => {
  return (
    <div className="w-full max-w-md rounded-[2rem] border border-black/[0.06] bg-white px-8 py-10 text-center shadow-[0_4px_32px_rgba(0,0,0,0.06)]">
      <div className="mb-8">
        <Link href="/" className="inline-flex justify-center">
          <img
            src="https://cdn.empowerher-initiative.org/logo.png"
            alt="EmpowerHer"
            className="w-48 text-[#43a9e2] transition-opacity duration-200 hover:opacity-80"
          />
          {/* <Logo className="size-10 text-[#43a9e2] transition-opacity duration-200 hover:opacity-80" /> */}
        </Link>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {title}
          </h1>
          <p className="text-muted-foreground mx-auto max-w-56 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
};
