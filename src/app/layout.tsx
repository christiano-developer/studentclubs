import type { Metadata } from "next";
import { Black_Han_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navBar";
import Footer from "@/components/Footer";
import FloatingIcons from "@/components/FloatingIcons";
import MaintenanceWrapper from "@/components/MaintenanceWrapper";
import { AuthProvider } from "@/contexts/AuthContext";
import { organizationConfig } from "@/config/organization";

const blackHanSans = Black_Han_Sans({
  weight: "400",
  variable: "--font-black-han-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: organizationConfig.site.title,
  description: organizationConfig.site.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${blackHanSans.variable} antialiased`}>
        <AuthProvider>
          <MaintenanceWrapper>
            <Navbar />
            <FloatingIcons />
            {children}
            <Footer />
          </MaintenanceWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
