export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav>Dashboard Nav</nav>
      <main>{children}</main>
    </div>
  )
}
