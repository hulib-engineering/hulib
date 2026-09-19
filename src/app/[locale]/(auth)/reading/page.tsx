import ReadingSession from './_components/ReadingSession';
import { redirect } from '@/libs/i18nNavigation';

/**
 * A reading session is only reachable via `?channel=<something>-<sessionId>`.
 * Without a session id the client can never load a session and would sit on the
 * loader forever, so bounce back to the schedule before rendering anything.
 */
export default function ReadingPage({
  searchParams,
}: {
  searchParams: { channel?: string };
}) {
  const sessionId = searchParams.channel?.split('-')?.[1];

  if (!sessionId) {
    redirect('/my-schedule');
  }

  return <ReadingSession />;
}
