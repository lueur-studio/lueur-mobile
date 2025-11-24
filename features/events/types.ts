export type Event = {
  id: number;
  title: string;
  description: string;
  date: string;
  invitation_url: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  attendees?: number;
  isJoined?: boolean;
};
