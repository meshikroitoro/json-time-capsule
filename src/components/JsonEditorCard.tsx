import React, { ReactNode, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, FileJson, Calendar, Expand, Save, Search } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { formatDistanceToNow } from "date-fns";

interface JsonEditorCardProps {
  title: string;
  jsonData: string;
  setJsonData: (value: string) => void;
  lastUpdated: Date;
  handleCopy: (data: string, type: string) => void;
  formatJson: (
    data: string,
    setter: (value: string) => void,
    type: string
  ) => void;
  handleJsonChange: (
    value: string,
    setter: (value: string) => void,
    type: string
  ) => void;
  editingAllowed: boolean;
  isValidJson: (str: string) => boolean;
  extraButton?: ReactNode;
  onSave?: () => void | Promise<void>;
}


const getRelativeTime = (date: Date) => {
  return formatDistanceToNow(date, { addSuffix: true });
};


const JsonEditorCard: React.FC<JsonEditorCardProps> = ({
  title,
  jsonData,
  setJsonData,
  lastUpdated,
  handleCopy,
  formatJson,
  handleJsonChange,
  editingAllowed,
  isValidJson,
  extraButton,
  onSave,
}) => {
  const [search, setSearch] = useState("");
  const [showRaw, setShowRaw] = useState(false);

  // Filtered JSON for search
  const filteredJson = useMemo(() => {
    if (!search.trim()) return jsonData;
    try {
      const obj = JSON.parse(jsonData);
      const str = JSON.stringify(obj, null, 2);
      return str
        .split("\n")
        .filter((line) => line.toLowerCase().includes(search.toLowerCase()))
        .join("\n");
    } catch {
      return jsonData;
    }
  }, [jsonData, search]);

  return (
  <Card className="shadow-lg border-0 backdrop-blur-sm rounded-2xl transition-all">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-slate-700">
            <FileJson className="h-5 w-5" />
            {title}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={() => handleCopy(jsonData, title)}
              variant="ghost"
              size="icon"
              className="hover:bg-blue-100/70 focus:bg-blue-200/80 transition-colors"
              title="Copy JSON"
            >
              <Copy className="h-5 w-5 text-blue-500" />
            </Button>
            {/* If extraButton is a React element, clone it and add icon style. Otherwise, render as is. */}
            {extraButton &&
              React.isValidElement(extraButton)
                ? React.cloneElement(extraButton, {
                    className: `${extraButton.props.className || ''} hover:bg-teal-100/70 focus:bg-teal-200/80 transition-colors`,
                    variant: 'ghost',
                    size: 'icon',
                    title: 'Expand/View Large',
                    children: <Expand className="h-5 w-5 text-teal-500" />,
                  })
                : extraButton}
          </div>
        </div>
      </CardHeader>
  <CardContent className="space-y-4 bg-white/80 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Quick search/filter..."
            className="w-full px-2 py-1 rounded border border-slate-200 bg-slate-50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div className="relative group">
          {editingAllowed && !showRaw ? (
            <textarea
              value={jsonData}
              onChange={(e) => handleJsonChange(e.target.value, setJsonData, title)}
              className={`w-full min-h-[400px] p-4 rounded-xl border-2 font-mono text-sm leading-relaxed resize-y transition-colors
                ${isValidJson(jsonData)
                  ? "border-green-200 focus:border-green-400 bg-green-50/70 text-black"
                  : "border-red-200 focus:border-red-400 bg-red-50/70 text-black"}
                focus:outline-none
                ${isValidJson(jsonData)
                  ? "focus:ring-2 focus:ring-offset-2 focus:ring-green-300"
                  : "focus:ring-2 focus:ring-offset-2 focus:ring-red-300"}
              `}
              placeholder={`Enter ${title} data here...`}
              spellCheck={false}
              readOnly={!editingAllowed}
              style={{ fontFamily: 'Fira Mono, Menlo, monospace' }}
            />
          ) : (
            <SyntaxHighlighter
              language="json"
              style={oneLight}
              customStyle={{
                borderRadius: '1rem',
                fontSize: 14,
                minHeight: 520,
                background: '#f6faff',
                padding: 18,
                margin: 0,
                border: '1.5px solid #e2e8f0',
                fontFamily: 'Fira Mono, Menlo, monospace',
              }}
              wrapLines
            >
              {filteredJson}
            </SyntaxHighlighter>
          )}

          {editingAllowed && (
            <div className="absolute bottom-2 right-2">
              <div
                className={`px-2 py-1 rounded text-xs font-medium ${
                  isValidJson(jsonData)
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-red-100 text-red-700 border border-red-200"
                }`}
              >
                {isValidJson(jsonData) ? "Valid JSON" : "Invalid JSON"}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-slate-600 text-xs">
          <Calendar className="h-4 w-4" />
          <span>Last updated {getRelativeTime(lastUpdated)}</span>
        </div>
        {editingAllowed && (
          <>
            <Button
              variant="default"
              size="sm"
              className="w-full mt-2 bg-blue-500/90 hover:bg-blue-600/90 focus:bg-blue-700/90 text-white flex items-center gap-2 shadow-sm transition-colors"
              onClick={() => formatJson(jsonData, setJsonData, title)}
              disabled={!isValidJson(jsonData)}
            >
              <Save className="h-4 w-4" />
              Format JSON
            </Button>
            <Button
              variant="default"
              size="sm"
              className="w-full mt-2 bg-teal-500/90 hover:bg-teal-600/90 focus:bg-teal-700/90 text-white flex items-center gap-2 shadow-sm transition-colors"
              onClick={onSave}
              disabled={!isValidJson(jsonData)}
            >
              <Save className="h-4 w-4" />
              Save JSON
            </Button>
          </>
        )}
        {extraButton && <div className="pt-2">{extraButton}</div>}
      </CardContent>
    </Card>
  );
};

export default JsonEditorCard;
