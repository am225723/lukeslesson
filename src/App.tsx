/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { MobileLayout } from "./components/layout/MobileLayout";
import Home from "./pages/Home";
import GoalEntry from "./pages/student/GoalEntry";
import GoalBreakdown from "./pages/student/GoalBreakdown";
import TopicPreferences from "./pages/student/TopicPreferences";
import Homework from "./pages/student/Homework";
import Dashboard from "./pages/instructor/Dashboard";
import LessonPlan from "./pages/instructor/LessonPlan";
import SessionSummary from "./pages/instructor/SessionSummary";
import SubmissionReview from "./pages/instructor/SubmissionReview";
import AIAssistant from "./pages/instructor/AIAssistant";
import InstructorLogin from "./pages/instructor/Login";
import Resources from "./pages/Resources";
import Workspace from "./pages/shared/Workspace";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route element={<MobileLayout />}>
          <Route path="/" element={<Home />} />
          
          {/* Student Routes */}
          <Route path="/student/goal-entry" element={<GoalEntry />} />
          <Route path="/student/goal-breakdown" element={<GoalBreakdown />} />
          <Route path="/student/topic-preferences" element={<TopicPreferences />} />
          <Route path="/student/homework" element={<Homework />} />
          <Route path="/student/ai-assistant" element={<AIAssistant />} />
          
          {/* Instructor Routes */}
          <Route path="/instructor/login" element={<InstructorLogin />} />
          <Route path="/instructor/dashboard" element={<Dashboard />} />
          <Route path="/instructor/lesson-plan" element={<LessonPlan />} />
          <Route path="/instructor/session-summary" element={<SessionSummary />} />
          <Route path="/instructor/submission-review" element={<SubmissionReview />} />
          <Route path="/instructor/ai-assistant" element={<AIAssistant />} />

          {/* Shared Routes */}
          <Route path="/resources" element={<Resources />} />
          <Route path="/workspace" element={<Workspace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
