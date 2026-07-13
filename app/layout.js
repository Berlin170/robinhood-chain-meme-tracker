import "./globals.css";

export const metadata = {
  title: "Robinhood Chain Meme Tracker — powered by GoldRush",
  description:
    "Live board of new token launches, market cap risers, and smart money flows on Robinhood Chain. Built on the GoldRush API.",
  openGraph: {
    title: "Robinhood Chain Meme Tracker",
    description:
      "New launches firehose, top movers, and whale flows on Robinhood Chain — live via GoldRush.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="bg-layer" />
        {children}
      </body>
    </html>
  );
}
