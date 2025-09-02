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
  const [activeTab, setActiveTab] = useState<
    "project1" | "project2" | "project3" | "docker"
  >("project1");

  // Load subName from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("subName");
    if (saved) setSubName(saved);
  }, []);

  // Save subName to localStorage whenever it changes
  useEffect(() => {
    if (subName) {
      localStorage.setItem("subName", subName);
    } else {
      localStorage.removeItem("subName");
    }
  }, [subName]);

  const handleExitAdminMode = () => {
    localStorage.setItem("json-editor-admin-mode", "false");
    localStorage.setItem("json-editor-admin-password", "");
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

  const renderTabContent = () => {
    switch (activeTab) {
      case "project1":
        return (
          <div>
            <JsonManager editingAllowed={editingAllowed} subName={subName} />
          </div>
        );
      case "docker":
        return (
          <div className="p-4">
            {/* Docker tab content goes here */}
            <h2 className="text-lg font-semibold mb-2">Docker</h2>
            <p>Docker setup and instructions...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Header
          onAdminMode={() => setIsAdminDialogOpen(true)}
          subName={subName}
          onSubNameChange={setSubName}
        />
        <div className="bg-white rounded shadow p-2 mb-4">
          <div className="flex border-b">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "project1"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("project1")}
            >
              Project1
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "project2"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("project2")}
            >
              Project2
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "project3"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("project3")}
            >
              Project3
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === "docker"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("docker")}
            >
              Docker
            </button>
          </div>
          {renderTabContent()}
        </div>
        <AdminDialog
          open={isAdminDialogOpen}
          onOpenChange={setIsAdminDialogOpen}
          onChangeEditingAllowed={setEditingAllowed}
          clearPasswordSignal={clearPasswordSignal}
        />
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
