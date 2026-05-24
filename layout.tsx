import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Command Electric Deal Hunter',
  description: 'Deep deal dashboard for Command Electric',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
