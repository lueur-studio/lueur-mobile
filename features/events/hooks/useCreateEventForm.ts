import { useState } from "react";

export const useCreateEventForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleCreateEvent = () => {
    if (!title.trim() || !description.trim() || !date.trim()) {
      setError("Please complete all of the fields.");
      return;
    }
    setError(null);
    setTitle("");
    setDescription("");
    setDate("");
  };

  return {
    title,
    description,
    date,
    error,
    setTitle,
    setDescription,
    setDate,
    setError,
    handleCreateEvent,
  };
};
