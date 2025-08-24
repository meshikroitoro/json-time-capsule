import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Shield } from 'lucide-react';


// import admin credentials dynamically from JSON
import { useState, useEffect } from 'react';

interface AdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChangeEditingAllowed: (editingAllowed: boolean) => void;
  clearPasswordSignal?: boolean;
}


const AdminDialog: React.FC<AdminDialogProps> = ({ open, onOpenChange, onChangeEditingAllowed, clearPasswordSignal }) => {
  // Clear password when parent signals
  useEffect(() => {
    if (clearPasswordSignal) {
      setAdminPassword("");
    }
  }, [clearPasswordSignal]);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [authorizedAdmin, setAuthorizedAdmin] = useState('admin');
  const [authorizedPassword, setAuthorizedPassword] = useState('admin');

  // Set admin credentials directly (no longer loaded from JSON)
  useEffect(() => {
    setAuthorizedAdmin('admin');
    setAuthorizedPassword('admin');
  }, []);

  useEffect(() => {
    const savedAdminMode = localStorage.getItem('json-editor-admin-mode');
    const savedAdminUsername = localStorage.getItem('json-editor-admin-username');
    if (savedAdminUsername) setAdminUsername(savedAdminUsername);
    if (savedAdminMode && savedAdminUsername === authorizedAdmin) {
      setIsAdminMode(savedAdminMode === 'true');
    }
  }, [authorizedAdmin]);

  useEffect(() => {
    localStorage.setItem('json-editor-admin-username', adminUsername);
  }, [adminUsername]);

  useEffect(() => {
    if (adminUsername === authorizedAdmin && adminPassword === authorizedPassword && !isAdminMode) {
      setIsAdminMode(true);
    }
    if (!(adminUsername === authorizedAdmin && adminPassword === authorizedPassword) && isAdminMode) {
      setIsAdminMode(false);
    }
  }, [adminUsername, adminPassword, isAdminMode, authorizedAdmin, authorizedPassword]);

  useEffect(() => {
    if (adminUsername === authorizedAdmin && adminPassword === authorizedPassword) {
      localStorage.setItem('json-editor-admin-mode', isAdminMode.toString());
    } else {
      localStorage.setItem('json-editor-admin-mode', 'false');
    }
    onChangeEditingAllowed(isAdminMode && adminUsername === authorizedAdmin && adminPassword === authorizedPassword);
  }, [isAdminMode, adminUsername, adminPassword, authorizedAdmin, authorizedPassword, onChangeEditingAllowed]);

  const isAuthorizedAdmin = adminUsername === authorizedAdmin && adminPassword === authorizedPassword;

  const handleAdminModeToggle = (checked: boolean) => {
    if (!isAuthorizedAdmin) return;
    setIsAdminMode(checked);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] flex flex-col justify-between min-h-[300px]">
        <div>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Administrator Mode
            </DialogTitle>
            <DialogDescription>
              Enter valid admin credentials to enable admin mode.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
              <div className="space-y-2">
                <Label htmlFor="admin-username" className="text-sm font-medium text-slate-600">
                  Admin Username
                </Label>
                <Input
                  id="admin-username"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-sm font-medium text-slate-600">
                  Admin Password
                </Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="text-sm"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Switch
                id="admin-mode"
                checked={isAdminMode && isAuthorizedAdmin}
                onCheckedChange={handleAdminModeToggle}
                disabled={!isAuthorizedAdmin}
              />
              <Label htmlFor="admin-mode" className="text-sm font-medium text-slate-600">
                {isAuthorizedAdmin
                  ? (isAdminMode ? 'Admin mode enabled - JSON editing allowed' : 'Admin mode disabled - JSON editing restricted')
                  : 'Enter valid admin username and password to enable admin mode'}
              </Label>
            </div>
            {!isAuthorizedAdmin && (adminUsername && adminPassword) && (
              <p className="text-sm text-red-600">Invalid admin credentials. Access denied.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminDialog;
