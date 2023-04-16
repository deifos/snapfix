import { Head, Html, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="bg-white font-sans text-slate-900 antialiased dark:bg-slate-900 dark:text-slate-50">
        <Main/>
        <NextScript />
      </body>
    </Html>
  )
}
