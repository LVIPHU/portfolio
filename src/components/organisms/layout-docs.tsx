export const LayoutDocs = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={'max-w-3xl flex flex-col min-h-screen relative mx-auto overflow-hidden px-6 py-32'}>{children}</div>
  )
}
