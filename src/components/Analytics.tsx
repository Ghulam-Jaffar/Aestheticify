'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initializeAnalytics } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';

// Separate component that uses useSearchParams
function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleRouteChange = async () => {
      const analytics = await initializeAnalytics();
      if (analytics) {
        // Log page_view event
        logEvent(analytics, 'page_view', {
          page_path: pathname,
          page_location: window.location.href,
          page_title: document.title,
        });
        console.log('Analytics page_view event logged:', pathname);
      }
    };

    // Track route changes
    handleRouteChange();
  }, [pathname, searchParams]);

  return null;
}

// Main component with Suspense boundary
export default function Analytics() {
  return (
    <Suspense fallback={null}>
      <AnalyticsTracker />
    </Suspense>
  );
}
