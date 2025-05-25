import type { Metadata } from "next";
 
export const metadata: Metadata = {
  title: "Inscription",
  description: "S'inscrire à notre portofolio",
};
 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}