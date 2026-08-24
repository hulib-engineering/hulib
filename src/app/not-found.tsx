// TODO: Refactor needed - this file exists outside [locale] to catch unauthenticated
// users hitting non-existent routes (middleware redirects to login before Next.js can
// resolve the route). Proper fix: create app/layout.tsx as root layout, move <html>/<body>
// out of [locale]/layout.tsx, and remove the CSS import below (will be inherited from root layout).
import '@/styles/global.css';

import Image from 'next/image';

export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-y-3 px-4 md:gap-y-6">
          <Image
            src="/assets/images/empty.png"
            width={400}
            height={400}
            alt=""
            className="h-[200px] w-[200px] md:h-[400px] md:w-[400px]"
          />
          <h1 className="text-center text-xl font-bold md:text-2xl">
            Could not find what you&apos;re looking for
          </h1>
        </div>
      </body>
    </html>
  );
}
