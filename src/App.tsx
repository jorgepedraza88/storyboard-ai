import { Routes, Route } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { SequenceListPage } from "@/pages/SequenceListPage";
import { StoryboardEditorPage } from "@/pages/StoryboardEditorPage";

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<SequenceListPage />} />
        <Route path="/sequences/:sequenceId" element={<StoryboardEditorPage />} />
      </Routes>
    </AppShell>
  );
}

export default App;
