
import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Export from "@/pages/Export";
import ExportEntity from "@/pages/ExportEntity";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/export" element={<Export />} />
        <Route path="/export/:entityId" element={<ExportEntity />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
