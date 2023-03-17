export function Title({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
      {children}
    </h1>
  );
}
