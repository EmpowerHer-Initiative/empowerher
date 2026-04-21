import { AdminToolbar } from "@/components/admin/admin-toolbar";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <AdminToolbar />
    </>
  );
}
