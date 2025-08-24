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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <Header onAdminMode={() => setIsAdminDialogOpen(true)} subName={subName} onSubNameChange={setSubName} />
        <AdminDialog
          open={isAdminDialogOpen}
          onOpenChange={setIsAdminDialogOpen}
          onChangeEditingAllowed={setEditingAllowed}
        />
        <JsonManager editingAllowed={editingAllowed} subName={subName} />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
