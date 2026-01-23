import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL('https://sajagsilwal.com.np'),
  title: "Sajag Silwal | Computer Engineer, Entrepreneur & Educator",
  description: "Personal website of Sajag Silwal - Computer Engineer, CEO @ Iruka Technologies, Educator, and Capital Market Analyst with 7+ years experience in Nepal.",
  keywords: ["Sajag Silwal", "Computer Engineer", "Nepal", "Iruka Technologies", "Educator", "Capital Market"],
  openGraph: {
    title: "Sajag Silwal | Computer Engineer, Entrepreneur & Educator",
    description: "Computer Engineer, CEO @ Iruka Technologies, Educator, and Capital Market Analyst with 7+ years experience in Nepal.",
    url: 'https://sajagsilwal.com.np',
    siteName: 'Sajag Silwal',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Sajag Silwal | Computer Engineer, Entrepreneur & Educator",
    description: "Computer Engineer, CEO @ Iruka Technologies, Educator, and Capital Market Analyst.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
