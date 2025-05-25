import type { Metadata } from "next";
 
export const metadata: Metadata = {
  title: "Connexion",
  description: "Connexion à notre portfolio",
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