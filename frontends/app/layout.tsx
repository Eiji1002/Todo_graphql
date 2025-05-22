
'use client';

import "./globals.css";
import { ApolloProvider } from '@apollo/client';
import client from "./lib/apollo-client";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ApolloProvider client={client}>
        <body>{children}</body>
      </ApolloProvider>
   
    </html>
  );
}
