import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileJson } from "lucide-react";
import AdminDialog from "@/components/AdminDialog";
import JsonManager from "@/components/JsonManager";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [editingAllowed, setEditingAllowed] = useState(false);
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [subName, setSubName] = useState("");
  const [clearPasswordSignal, setClearPasswordSignal] = useState(false);

  // Load subName from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('subName');
    if (saved) setSubName(saved);
  }, []);

  // Save subName to localStorage whenever it changes
  useEffect(() => {
    if (subName) {
      localStorage.setItem('subName', subName);
    } else {
      localStorage.removeItem('subName');
    }
  }, [subName]);

  const handleExitAdminMode = () => {
    localStorage.setItem('json-editor-admin-mode', 'false');
    localStorage.setItem('json-editor-admin-password', '');
    setEditingAllowed(false);
    setClearPasswordSignal(true);
    setIsAdminDialogOpen(false);
  };

  // Reset the clearPasswordSignal after triggering
  useEffect(() => {
    if (clearPasswordSignal) {
      setClearPasswordSignal(false);
    }
  }, [clearPasswordSignal]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <Header onAdminMode={() => setIsAdminDialogOpen(true)} subName={subName} onSubNameChange={setSubName} />
        <AdminDialog
          open={isAdminDialogOpen}
          onOpenChange={setIsAdminDialogOpen}
          onChangeEditingAllowed={setEditingAllowed}
          clearPasswordSignal={clearPasswordSignal}
        />
        <JsonManager editingAllowed={editingAllowed} subName={subName} />
        <Footer />
        {editingAllowed && (
          <div className="flex justify-center mt-2">
            <Button
              className="w-full max-w-[720px] bg-red-600/90 hover:bg-red-700/90 focus:bg-red-800/90 text-white flex items-center gap-2 shadow-sm transition-colors"
              size="sm"
              onClick={handleExitAdminMode}
            >
              Exit Admin Mode
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
