interface WrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export const Wrapper = ({ title, description, children }: WrapperProps) => {
  return (
    <div className="w-full max-w-md p-8 text-center">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground mx-auto max-w-48 text-sm">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
};
