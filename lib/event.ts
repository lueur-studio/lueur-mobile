import api from "./api";

export type CreateEventDTO = {
  title: string;
  description: string;
  date: string;
};

export type UpdateEventDTO = {
  title?: string;
  description?: string;
  date?: string;
};

export type EventResponse = {
  id: number;
  title: string;
  description: string;
  date: string;
  invitation_url: string;
  created_by: number;
  created_at: string;
  updated_at: string;
};

export type ParticipantResponse = {
  id: number;
  user_id: number;
  event_id: number;
  access_level: "owner" | "admin" | "member";
  joined_at: string;
  user?: {
    id: number;
    email: string;
    username: string;
  };
};

export type AccessLevel = "owner" | "admin" | "member";

export const createEvent = async (data: CreateEventDTO): Promise<EventResponse> => {
  const response = await api.post("/api/events", data);
  return response.data.data;
};

export const getUserEvents = async (): Promise<EventResponse[]> => {
  const response = await api.get("/api/events");
  return response.data.data;
};

export const getEventById = async (eventId: number): Promise<EventResponse> => {
  const response = await api.get(`/api/events/${eventId}`);
  return response.data.data;
};

export const updateEvent = async (eventId: number, data: UpdateEventDTO): Promise<EventResponse> => {
  const response = await api.put(`/api/events/${eventId}`, data);
  return response.data.data;
};

export const deleteEvent = async (eventId: number): Promise<void> => {
  await api.delete(`/api/events/${eventId}`);
};

export const joinEventByUrl = async (invitationUrl: string): Promise<EventResponse> => {
  const response = await api.post("/api/events/join", { invitationUrl });
  return response.data.data;
};

export const leaveEvent = async (eventId: number): Promise<void> => {
  await api.post(`/api/events/${eventId}/leave`);
};

export const getEventParticipants = async (eventId: number): Promise<ParticipantResponse[]> => {
  const response = await api.get(`/api/events/${eventId}/participants`);
  return response.data.data;
};

export const updateUserAccessLevel = async (
  eventId: number,
  userId: number,
  accessLevel: AccessLevel,
): Promise<ParticipantResponse> => {
  const response = await api.put(`/api/events/${eventId}/participants/${userId}/access`, { accessLevel });
  return response.data.data;
};

export const removeUserFromEvent = async (eventId: number, userId: number): Promise<void> => {
  await api.delete(`/api/events/${eventId}/participants/${userId}`);
};

export const regenerateInvitationUrl = async (eventId: number): Promise<string> => {
  const response = await api.post(`/api/events/${eventId}/regenerate-url`);
  return response.data.data.invitation_url;
};
