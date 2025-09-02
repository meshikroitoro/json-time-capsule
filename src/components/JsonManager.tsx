import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import JsonEditorCard from "@/components/JsonEditorCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  JSON_MANAGER_COPIED_TITLE,
  JSON_MANAGER_COPIED_DESC,
  JSON_MANAGER_COPY_FAILED_TITLE,
  JSON_MANAGER_COPY_FAILED_DESC,
  JSON_MANAGER_SAVE_FAILED_TITLE,
  MICRO_SERVICE,
  JSON_MANAGER_CONFIG_SETTING_UPDATED,
  JSON_MANAGER_CONFIG_SETTING_UPDATED_FAILED,
  JSON_MANAGER_SAVE_SUCCESS_TITLE,
  MicroServiceApiKey,
} from "@/constants/MainConstants";

import { getJsonData, updateJsonData, getJsonLastUpdated } from "@/lib/jsonApi";

import { JsonManagerProps } from "@/utils/Interfaces";

const JsonManager: React.FC<JsonManagerProps> = ({
  editingAllowed,
  subName,
}) => {
  // Derive service keys from MICRO_SERVICE (e.g., Prov -> 'prov')
  const serviceKeys = MICRO_SERVICE.map((s) => s.toLowerCase());
  // State for each service's JSON and last updated
  const [jsonData, setJsonData] = useState<Record<string, string>>(() =>
    Object.fromEntries(serviceKeys.map((k) => [k, ""]))
  );
  const [lastUpdated, setLastUpdated] = useState<Record<string, Date>>(() =>
    Object.fromEntries(serviceKeys.map((k) => [k, new Date()]))
  );
  const [selectedTab, setSelectedTab] = useState(serviceKeys[0]);

  // Helper to update the Value for the matching object (works for string or object input)
  const updateSectionValue = (input: any) => {
    try {
      let data = input;
      if (typeof data === "string") {
        data = JSON.parse(data);
      }
      if (Array.isArray(data)) {
        for (const obj of data) {
          if (
            obj.Operation === "SET" &&
            obj.Version === "1" &&
            obj.Section === "sub" &&
            obj.KeyPermission === "test" &&
            obj.Key === "url"
          ) {
            obj.Value = subName;
          }
        }
      } else if (
        data.Operation === "SET" &&
        data.Version === "1" &&
        data.Section === "sub" &&
        data.KeyPermission === "test" &&
        data.Key === "url"
      ) {
        data.Value = subName;
      }
      return JSON.stringify(data, null, 2);
    } catch {
      return typeof input === "string" ? input : JSON.stringify(input, null, 2);
    }
  };

  // Fetch JSON data and last updated for the selected tab
  useEffect(() => {
    const fetchData = async () => {
      try {
        const key = selectedTab as MicroServiceApiKey;
        const data = await getJsonData(key);
        setJsonData((prev) => ({ ...prev, [key]: updateSectionValue(data) }));
        const meta = await getJsonLastUpdated(key);
        setLastUpdated((prev) => ({
          ...prev,
          [key]: new Date(meta.lastUpdatedUtc),
        }));
      } catch {}
    };
    fetchData();
  }, [selectedTab, subName]);

  // Parse subName from JSON when JSON changes manually (for each service)
  useEffect(() => {
    // No-op: subName is controlled from parent, but keep for future validation if needed
  }, [jsonData, subName]);

  const { toast } = useToast();
  const handleCopy = async (data: string, type: string) => {
    try {
      await navigator.clipboard.writeText(data);
      toast({
        title: JSON_MANAGER_COPIED_TITLE,
        description: JSON_MANAGER_COPIED_DESC.replace("{type}", type),
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: JSON_MANAGER_COPY_FAILED_TITLE,
        description: JSON_MANAGER_COPY_FAILED_DESC,
        variant: "destructive",
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

  // Save handler (dynamic)
  const handleSaveJson = async (key: string) => {
    try {
      const apiKey = key as MicroServiceApiKey;
      await updateJsonData(apiKey, JSON.parse(jsonData[apiKey]));
      toast({
        title: JSON_MANAGER_SAVE_SUCCESS_TITLE,
        description: JSON_MANAGER_CONFIG_SETTING_UPDATED,
        duration: 2000,
      });
    } catch {
      toast({
        title: JSON_MANAGER_SAVE_FAILED_TITLE,
        description: JSON_MANAGER_CONFIG_SETTING_UPDATED_FAILED,
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-4">
      <Tabs
        defaultValue={serviceKeys[0]}
        value={selectedTab}
        onValueChange={(v) => setSelectedTab(v)}
        className="w-full"
      >
        {MICRO_SERVICE.map((service, idx) => {
          const key = serviceKeys[idx];
          return (
            <TabsContent value={key} key={key}>
              <JsonEditorCard
                title={service}
                jsonData={jsonData[key]}
                setJsonData={(val) =>
                  setJsonData((prev) => ({ ...prev, [key]: val }))
                }
                lastUpdated={lastUpdated[key]}
                handleCopy={handleCopy}
                formatJson={formatJson}
                handleJsonChange={handleJsonChange}
                editingAllowed={editingAllowed}
                isValidJson={isValidJson}
                onSave={() => handleSaveJson(key)}
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
  // Removed Dialog/largeView feature as Dialog import was removed
};

export default JsonManager;
