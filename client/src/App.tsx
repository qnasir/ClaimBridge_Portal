
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {TooltipProvider} from "@/components/ui/tooltip"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <div>Hello World</div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
