export function Main({ children }: { children: React.ReactNode }) {
  return (
    <div className="@container/main flex flex-1 flex-col px-6 py-10 md:px-10">
      {children}
    </div>
  );
}
