import './globals.css';

export const metadata = {
  title: 'Realtime Chat App',
  description: 'A realtime chat application built with Next.js and React Bootstrap',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
