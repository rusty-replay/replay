import { useParams } from 'next/navigation';

export function useGetEventParams() {
  const { issue_id: eventId } = useParams<{
    issue_id: string;
  }>();

  return { eventId: eventId ? parseInt(eventId) : undefined };
}
