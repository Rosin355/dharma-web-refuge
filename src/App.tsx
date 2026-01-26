import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Insegnamenti from "./pages/Insegnamenti";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Eventi from "./pages/Eventi";
import EventForm from "./pages/EventForm";
import Cerimonie from "./pages/Cerimonie";
import CeremonyForm from "./pages/CeremonyForm";
import TestiScaricabili from "./pages/TestiScaricabili";
import TestoScaricabileDetail from "./pages/TestoScaricabileDetail";
import DownloadableTextForm from "./pages/DownloadableTextForm";
import ChiSiamo from "./pages/ChiSiamo";
import Contatti from "./pages/Contatti";
import Dona from "./pages/Dona";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/insegnamenti" element={<Insegnamenti />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/eventi" element={<Eventi />} />
              <Route path="/admin/events/new" element={<EventForm />} />
              <Route path="/admin/events/:id/edit" element={<EventForm />} />
              <Route path="/cerimonie" element={<Cerimonie />} />
              <Route path="/admin/ceremonies/new" element={<CeremonyForm />} />
              <Route path="/admin/ceremonies/:id/edit" element={<CeremonyForm />} />
              <Route path="/testi-scaricabili" element={<TestiScaricabili />} />
              <Route path="/testi-scaricabili/:slug" element={<TestoScaricabileDetail />} />
              <Route path="/admin/downloadable-texts/new" element={<DownloadableTextForm />} />
              <Route path="/admin/downloadable-texts/:id/edit" element={<DownloadableTextForm />} />
              <Route path="/chi-siamo" element={<ChiSiamo />} />
              <Route path="/contatti" element={<Contatti />} />
              <Route path="/dona" element={<Dona />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;