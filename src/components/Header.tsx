import React, { useState } from 'react';
import { FileJson, Settings } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

export interface HeaderProps {
  onAdminMode?: () => void;
  subName?: string;
  onSubNameChange?: (val: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onAdminMode, subName, onSubNameChange }) => {
  const [subDialogOpen, setSubDialogOpen] = useState(false);
  const [inputValue, setInputValue] = useState(subName || "");

  const handleSave = () => {
    if (onSubNameChange) onSubNameChange(inputValue);
    setSubDialogOpen(false);
  };

  return (
    <div className="relative text-center space-y-2">
      <div className="flex items-center justify-center gap-2 mb-4">
        <h1
          className="text-3xl font-bold text-blue-600 drop-shadow-lg"
        >
          JSON Editor
        </h1>
        <div className="absolute right-0 top-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-full hover:bg-slate-100 focus:outline-none">
                <Settings className="h-6 w-6 text-slate-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onAdminMode} className="flex items-center gap-2">
                <span>Admin Mode</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2" onClick={() => setSubDialogOpen(true)}>
                <span>Subscription Name</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Subname Dialog */}
      {onSubNameChange && subDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSubDialogOpen(false)} />
          {/* Modal */}
          <div className="relative bg-white rounded-xl shadow-2xl p-8 w-full max-w-md sm:max-w-lg mx-4 animate-fade-in">
            <div className="mb-4 text-xl font-bold text-slate-800">Edit Subscription Name</div>
            <input
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Enter Subscription Name"
              className="border-2 border-slate-200 rounded-lg px-4 py-2 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-blue-200 text-lg"
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow">Save</button>
              <button onClick={() => setSubDialogOpen(false)} className="bg-gray-100 hover:bg-gray-200 text-slate-700 px-6 py-2 rounded-lg font-semibold border border-slate-200">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
