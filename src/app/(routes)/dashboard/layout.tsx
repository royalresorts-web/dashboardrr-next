import { ProtectedRoute, UserSection } from "@/Components"
import { Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { UserConfigProvider } from "@/Context/UserContext"
import { Metadata } from "next"
export const metadata: Metadata = {
  title: "Dashboard - Royal Resorts",
  description: "Administrador de servicios y aplicaciones para usuarios en Royal Resorts",
  icons: {
    icon: [
        { url: 'https://www.royalresorts.com/img/logo/favicon96x96.png' },
        { url: 'https://www.royalresorts.com/img/logo/favicon32x32.png', sizes: '32x32', type: 'image/png' },
        { url: 'https://www.royalresorts.com/img/logo/favicon16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: 'https://www.royalresorts.com/img/logo/touch-ipad-ret.png', sizes: '180x180' }],
  }    
};
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
        <UserConfigProvider>
          <div className="w-full h-[100vh]">
              <nav className="flex justify-between items-center py-2 px-2 pe-4 bg-white shadow-md">
                  <Link href="/">
                      <Image width={220} height={36} src="https://www.royalresorts.com/img/logo/svg/royal-resorts.svg" alt="RR Logo"/>
                  </Link>  
                  <div className="flex justify-center items-center gap-5">
                      <Menu size={36} className="cursor-pointer hover:scale-110" />
                      <UserSection />
                  </div>
              </nav>
              {children} {/* This will be the dashboard page.tsx */}
          </div>
        </UserConfigProvider>
    </ProtectedRoute>

  )
}