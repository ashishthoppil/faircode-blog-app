import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer'
import { SessionProvider } from "next-auth/react";

import { Poppins } from "next/font/google";

import "./globals.css";

const font = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata = {
  title: "Blog App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${font.className}`}>
        <SessionProvider>
          <Header />
          {children}
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
