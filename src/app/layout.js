import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Admin || Smart Original Brand",
  description: "Generated by create next app",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
      <Providers>{children}</Providers> 
      </body>
    </html>
  );
}
