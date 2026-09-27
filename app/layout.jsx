import './globals.css';

export const metadata = {
  title: 'BloxSwaps MM2',
  description: 'MM2 Trading Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
