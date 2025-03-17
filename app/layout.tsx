import "./global.css";

export const metadata = {
  title: "stream chatbot",
  description:
    "Stream-Bot is a web app that generates text based on a given prompt using OpenAI's model.",
  icons: "/favicon.ico",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
