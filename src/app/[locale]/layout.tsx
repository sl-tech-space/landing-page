import { PageMetaOptions } from "@/types";
import { generateMetadata as generateMeta } from "@/utils";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { headers } from "next/headers";
import Script from "next/script";
import "../globals.css";

/**
 * 動的メタデータ生成関数
 * @param params - パラメータ
 * @returns メタデータ
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  // TOPページ用のメタデータ設定
  const metaOptions: PageMetaOptions = {};

  return generateMeta(locale, metaOptions);
}

/**
 * ロケールレイアウト
 * @param children - 子要素
 * @param params - パラメータ
 * @returns ロケールレイアウト
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const headersList = await headers();
  const { locale } = await params;
  const messages = await getMessages();
  const nonce = headersList.get("x-content-security-policy-nonce");

  return (
    <html lang={locale} className="dark:bg-gray-900 h-full">
      <head>
        {/* Critical CSS preload */}
        <link rel="preload" href="/globals.css" as="style" />
      </head>
      <body
        className="antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 h-full"
        suppressHydrationWarning={true}
      >
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
        {nonce && <Script nonce={nonce} />}
        <SpeedInsights />
      </body>
    </html>
  );
}
