import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import JsonEditorCard from "@/components/JsonEditorCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import { getJsonData, updateJsonData, getJsonLastUpdated } from "@/lib/jsonApi";

interface JsonManagerProps {
  editingAllowed: boolean;
  subName: string;
}

const JsonManager: React.FC<JsonManagerProps> = ({ editingAllowed, subName }) => {
  // When subName changes, update the JSON section value in state only (no API call)
  useEffect(() => {
    if (typeof subName !== 'string') return;
    setJsonXData(j => updateSectionValue(j));
    setJsonYData(j => updateSectionValue(j));
    setJsonZData(j => updateSectionValue(j));
  }, [subName]);
  const [jsonXData, setJsonXData] = useState<string>("");
  const [jsonYData, setJsonYData] = useState<string>("");
  const [jsonZData, setJsonZData] = useState<string>("");

  // Tab state
  const [selectedTab, setSelectedTab] = useState<'x' | 'y' | 'z'>('x');

  // Helper to update the Value for the matching object (works for string or object input)
  const updateSectionValue = (input: any) => {
    try {
      let data = input;
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      if (Array.isArray(data)) {
        for (const obj of data) {
          if (
            obj.Operation === 'SET' &&
            obj.Version === '1' &&
            obj.Section === 'sub' &&
            obj.KeyPermission === 'test' &&
            obj.Key === 'url'
          ) {
            obj.Value = subName;
          }
        }
      } else if (
        data.Operation === 'SET' &&
        data.Version === '1' &&
        data.Section === 'sub' &&
        data.KeyPermission === 'test' &&
        data.Key === 'url'
      ) {
        data.Value = subName;
      }
      return JSON.stringify(data, null, 2);
    } catch {
      return typeof input === 'string' ? input : JSON.stringify(input, null, 2);
    }
  };

  // Fetch JSON data and last updated for the selected tab
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedTab === 'x') {
          const data = await getJsonData('prov');
          setJsonXData(updateSectionValue(data));
          const meta = await getJsonLastUpdated('prov');
          setLastUpdatedX(new Date(meta.lastUpdatedUtc));
        } else if (selectedTab === 'y') {
          const dataY = await getJsonData('uob');
          setJsonYData(updateSectionValue(dataY));
          const meta = await getJsonLastUpdated('uob');
          setLastUpdatedY(new Date(meta.lastUpdatedUtc));
        } else if (selectedTab === 'z') {
          const data = await getJsonData('core');
          setJsonZData(updateSectionValue(data));
          const meta = await getJsonLastUpdated('core');
          setLastUpdatedZ(new Date(meta.lastUpdatedUtc));
        }
      } catch {}
    };
    fetchData();
  }, [selectedTab, subName]);
  const [lastUpdatedZ, setLastUpdatedZ] = useState<Date>(new Date());
  const [lastUpdatedX, setLastUpdatedX] = useState<Date>(new Date());
  const [lastUpdatedY, setLastUpdatedY] = useState<Date>(new Date());

  // Parse subName from JSON when JSON changes manually (for JSON X)
  useEffect(() => {
    try {
      const parsedJson = JSON.parse(jsonXData);
  // subName is controlled from parent, do not update here
    } catch (error) {
      // If JSON is invalid, don't update
    }
  }, [jsonXData]);

  // Parse subName from JSON when JSON changes manually (for JSON Z)
  useEffect(() => {
    try {
      const parsedJson = JSON.parse(jsonZData);
  // subName is controlled from parent, do not update here
    } catch (error) {
      // If JSON is invalid, don't update
    }
  }, [jsonZData]);
  useEffect(() => {
    try {
      const parsedJson = JSON.parse(jsonYData);
  // subName is controlled from parent, do not update here
    } catch (error) {
      // If JSON is invalid, don't update
    }
  }, [jsonYData]);

  const { toast } = useToast();
  const handleCopy = async (data: string, type: string) => {
    try {
      await navigator.clipboard.writeText(data);
      toast({
        title: 'Copied!',
        description: `${type} copied to clipboard.`,
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: 'Copy failed',
        description: 'Could not copy to clipboard.',
        variant: 'destructive',
        duration: 2000,
      });
    }
  };

  const isValidJson = (str: string) => {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  };

  const formatJson = (
    data: string,
    setter: (value: string) => void,
    type: string
  ) => {
    try {
      const formatted = JSON.stringify(JSON.parse(data), null, 2);
      setter(formatted);
    } catch {
      // Invalid JSON, do nothing
    }
  };

  const handleJsonChange = (
    value: string,
    setter: (value: string) => void,
    type: string
  ) => {
    setter(value);
  };

  // Save handlers
  const handleSaveJsonX = async () => {
    try {
      await updateJsonData('prov', JSON.parse(jsonXData));
  toast({ title: 'Saved!', description: 'Prov updated.', duration: 2000 });
    } catch {
  toast({ title: 'Save failed', description: 'Could not update Prov.', variant: 'destructive', duration: 2000 });
    }
  };
  const handleSaveJsonY = async () => {
    try {
    await updateJsonData('uob', JSON.parse(jsonYData));
  toast({ title: 'Saved!', description: 'UOB updated.', duration: 2000 });
    } catch {
  toast({ title: 'Save failed', description: 'Could not update UOB.', variant: 'destructive', duration: 2000 });
    }
  };
  const handleSaveJsonZ = async () => {
    try {
  await updateJsonData('core', JSON.parse(jsonZData));
  toast({ title: 'Saved!', description: 'Core updated.', duration: 2000 });
    } catch {
  toast({ title: 'Save failed', description: 'Could not update Core.', variant: 'destructive', duration: 2000 });
    }
  };

  return (
    <>
      <div className="w-full max-w-3xl mx-auto mt-4">
  <Tabs defaultValue="x" value={selectedTab} onValueChange={v => setSelectedTab(v as 'x' | 'y' | 'z')} className="w-full">
          <TabsList className="grid grid-cols-3 bg-white rounded-lg shadow mb-4 h-12 text-xl">
            <TabsTrigger value="x" className={selectedTab === 'x' ? 'bg-blue-600 text-white font-bold shadow' : ''}>Prov</TabsTrigger>
            <TabsTrigger value="y" className={selectedTab === 'y' ? 'bg-blue-600 text-white font-bold shadow' : ''}>UOB</TabsTrigger>
            <TabsTrigger value="z" className={selectedTab === 'z' ? 'bg-blue-600 text-white font-bold shadow' : ''}>Core</TabsTrigger>
          </TabsList>
          <TabsContent value="x">
            <JsonEditorCard
              title="Prov"
              jsonData={jsonXData}
              setJsonData={setJsonXData}
              lastUpdated={lastUpdatedX}
              handleCopy={handleCopy}
              formatJson={formatJson}
              handleJsonChange={handleJsonChange}
              editingAllowed={editingAllowed}
              isValidJson={isValidJson}
              onSave={handleSaveJsonX}
            />
          </TabsContent>
          <TabsContent value="y">
            <JsonEditorCard
              title="UOB"
              jsonData={jsonYData}
              setJsonData={setJsonYData}
              lastUpdated={lastUpdatedY}
              handleCopy={handleCopy}
              formatJson={formatJson}
              handleJsonChange={handleJsonChange}
              editingAllowed={editingAllowed}
              isValidJson={isValidJson}
              onSave={handleSaveJsonY}
            />
          </TabsContent>
          <TabsContent value="z">
            <JsonEditorCard
              title="Core"
              jsonData={jsonZData}
              setJsonData={setJsonZData}
              lastUpdated={lastUpdatedZ}
              handleCopy={handleCopy}
              formatJson={formatJson}
              handleJsonChange={handleJsonChange}
              editingAllowed={editingAllowed}
              isValidJson={isValidJson}
              onSave={handleSaveJsonZ}
            />
          </TabsContent>
        </Tabs>
      </div>
  {/* Removed Dialog/largeView feature as Dialog import was removed */}
     
    </>
  );
};

export default JsonManager;
