import "../../styles/global.css";

export const metadata = {
  title: "Weather Dashboard",
  description: "Real-time weather monitoring",
  icons: {
    icon: "/sun.svg", 
    shortcut: "/sun.svg",
    apple: "/sun.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
