import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface Topic {
  id: string;
  title: string;
  description: string;
  type: string;
  duration: number;
}

export interface HomeworkStatus {
  [assignmentId: string]: {
    status: "not_started" | "in_progress" | "completed";
    submittedAt?: string;
    feedback?: string;
  };
}

interface SessionContextType {
  goals: string[];
  setGoals: (goals: string[]) => void;
  topics: Topic[];
  setTopics: (topics: Topic[]) => void;
  topicOrder: string[];
  setTopicOrder: (order: string[]) => void;
  completedActivities: string[];
  setCompletedActivities: (activities: string[]) => void;
  addCompletedActivity: (activity: string) => void;
  homeworkStatus: HomeworkStatus;
  setHomeworkStatus: (status: HomeworkStatus) => void;
  updateHomeworkStatus: (assignmentId: string, status: HomeworkStatus[string]) => void;
  sessionNotes: string[];
  setSessionNotes: (notes: string[]) => void;
  addSessionNote: (note: string) => void;
}

const STORAGE_KEY = "ai-learning-session";

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed[key] !== undefined ? parsed[key] : fallback;
    }
  } catch {}
  return fallback;
}

function saveToStorage(data: Record<string, unknown>) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...existing, ...data }));
  } catch {}
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [goals, setGoalsState] = useState<string[]>(() => loadFromStorage("goals", []));
  const [topics, setTopicsState] = useState<Topic[]>(() => loadFromStorage("topics", []));
  const [topicOrder, setTopicOrderState] = useState<string[]>(() => loadFromStorage("topicOrder", []));
  const [completedActivities, setCompletedActivitiesState] = useState<string[]>(() => loadFromStorage("completedActivities", []));
  const [homeworkStatus, setHomeworkStatusState] = useState<HomeworkStatus>(() => loadFromStorage("homeworkStatus", {}));
  const [sessionNotes, setSessionNotesState] = useState<string[]>(() => loadFromStorage("sessionNotes", []));

  const setGoals = useCallback((g: string[]) => { setGoalsState(g); saveToStorage({ goals: g }); }, []);
  const setTopics = useCallback((t: Topic[]) => { setTopicsState(t); saveToStorage({ topics: t }); }, []);
  const setTopicOrder = useCallback((o: string[]) => { setTopicOrderState(o); saveToStorage({ topicOrder: o }); }, []);
  const setCompletedActivities = useCallback((a: string[]) => { setCompletedActivitiesState(a); saveToStorage({ completedActivities: a }); }, []);
  const setHomeworkStatus = useCallback((s: HomeworkStatus) => { setHomeworkStatusState(s); saveToStorage({ homeworkStatus: s }); }, []);
  const setSessionNotes = useCallback((n: string[]) => { setSessionNotesState(n); saveToStorage({ sessionNotes: n }); }, []);

  const addCompletedActivity = useCallback((activity: string) => {
    setCompletedActivitiesState((prev) => {
      const next = [...prev, activity];
      saveToStorage({ completedActivities: next });
      return next;
    });
  }, []);

  const updateHomeworkStatus = useCallback((assignmentId: string, status: HomeworkStatus[string]) => {
    setHomeworkStatusState((prev) => {
      const next = { ...prev, [assignmentId]: status };
      saveToStorage({ homeworkStatus: next });
      return next;
    });
  }, []);

  const addSessionNote = useCallback((note: string) => {
    setSessionNotesState((prev) => {
      const next = [...prev, note];
      saveToStorage({ sessionNotes: next });
      return next;
    });
  }, []);

  return (
    <SessionContext.Provider
      value={{
        goals,
        setGoals,
        topics,
        setTopics,
        topicOrder,
        setTopicOrder,
        completedActivities,
        setCompletedActivities,
        addCompletedActivity,
        homeworkStatus,
        setHomeworkStatus,
        updateHomeworkStatus,
        sessionNotes,
        setSessionNotes,
        addSessionNote,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
