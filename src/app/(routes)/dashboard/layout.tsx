import { ProtectedRoute, UserSection } from "@/Components"
import { Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { UserConfigProvider } from "@/Context/UserContext"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
        <UserConfigProvider>
          <div className="w-full bg-red-50 h-[100vh]">
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