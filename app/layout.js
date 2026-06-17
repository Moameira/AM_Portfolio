import "./globals.css";

export const metadata = {
  title: "Mohamed Ameira - Portfolio",
  description: "Retro Windows-style portfolio with private GitHub OAuth editing.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
