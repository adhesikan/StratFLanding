import { Suspense } from "react";
import ThankYouClient from "./thank-you-client";

export default function ThankYouPage({
  searchParams = {}
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  return (
    <Suspense>
      <ThankYouClient searchParams={searchParams} />
    </Suspense>
  );
}
