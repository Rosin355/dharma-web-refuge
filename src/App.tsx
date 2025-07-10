import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Insegnamenti from "./pages/Insegnamenti";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Eventi from "./pages/Eventi";
import EventDetail from "./pages/EventDetail";
import Cerimonie from "./pages/Cerimonie";
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
              <Route path="/eventi/:id" element={<EventDetail />} />
              <Route path="/cerimonie" element={<Cerimonie />} />
              <Route path="/chi-siamo" element={<ChiSiamo />} />
              <Route path="/contatti" element={<Contatti />} />
              <Route path="/dona" element={<Dona />} />
              <Route path="/admin" element={<Admin />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
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
