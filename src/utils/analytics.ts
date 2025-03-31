import { initializeAnalytics } from '@/lib/firebase';
import { logEvent as firebaseLogEvent, AnalyticsCallOptions } from 'firebase/analytics';

/**
 * Log an event to Firebase Analytics
 * @param eventName The name of the event to log
 * @param eventParams Optional parameters to include with the event
 * @param options Optional analytics call options
 */
export async function logEvent(
  eventName: string, 
  eventParams?: Record<string, any>,
  options?: AnalyticsCallOptions
) {
  try {
    const analytics = await initializeAnalytics();
    if (analytics) {
      firebaseLogEvent(analytics, eventName, eventParams, options);
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Analytics event logged: ${eventName}`, eventParams);
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error logging analytics event:', error);
    return false;
  }
}

/**
 * Common analytics events to track throughout the app
 */
export const AnalyticsEvents = {
  // Journal related events
  JOURNAL_CREATED: 'journal_created',
  JOURNAL_SAVED: 'journal_saved',
  JOURNAL_DOWNLOADED: 'journal_downloaded',
  JOURNAL_SHARED: 'journal_link_copied',
  
  // Vibe related events
  VIBE_GENERATED: 'vibe_generated',
  VIBE_SWITCHED: 'vibe_switched',
  VIBE_REMIXED: 'vibe_remixed',
  
  // User related events
  USER_SIGNED_IN: 'user_signed_in',
  USER_SIGNED_UP: 'user_signed_up',
  USER_SIGNED_OUT: 'user_signed_out',
  
  // Feature usage events
  SPOTIFY_TRACK_ADDED: 'spotify_track_added',
  QR_CODE_VIEWED: 'qr_code_viewed'
};
