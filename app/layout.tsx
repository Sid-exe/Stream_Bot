import "./global.css";

export const metadata = {
  title: "Stream-Bot",
  description:
    "Stream-Bot is a web app that generates text based on a given prompt using OpenAI's GPT-3 model.",
  icons: "/favicon.ico",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
