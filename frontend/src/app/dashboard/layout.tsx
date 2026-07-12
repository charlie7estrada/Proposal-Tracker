import DashboardNav from '@/components/DashboardNav';
import Footer from '@/components/Footer';

// Shared frame for every page under /dashboard: header with the nav tabs
// on top, the page content in the middle, and the footer at the bottom.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <DashboardNav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
