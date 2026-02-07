import { Copy, Trash2, Edit2, Check } from "lucide-react";
import { useState } from "react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const SnippetCard = ({ snippet, onDelete, onEdit }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-5 hover:border-blue-500/50 transition-all group relative flex flex-col h-full shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="overflow-hidden">
          <h3
            className="text-lg font-bold text-white mb-1 truncate pr-2"
            title={snippet.title}
          >
            {snippet.title}
          </h3>
          <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded border border-blue-900/50 inline-block uppercase tracking-wider">
            {snippet.language}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(snippet)}
            className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-md transition-colors"
          >
            <Edit2 size={15} />
          </button>
          <button
            onClick={() => onDelete(snippet._id)}
            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
          >
            <Trash2 size={15} />
          </button>
          <button
            onClick={copyToClipboard}
            className="p-1.5 text-gray-400 hover:text-white bg-[#2d2d2d] rounded-md transition-colors"
          >
            {copied ? (
              <Check size={15} className="text-green-400" />
            ) : (
              <Copy size={15} />
            )}
          </button>
        </div>
      </div>

      {/* Syntax Highlighter Block */}
      <div className="rounded-lg overflow-hidden border border-gray-800/50 bg-[#0d1117] flex-1">
        <SyntaxHighlighter
          language={snippet.language.toLowerCase()}
          style={vscDarkPlus}
          customStyle={{
            padding: "16px",
            fontSize: "13px",
            lineHeight: "1.5",
            backgroundColor: "#0d1117", // Matches the container bg
            margin: 0,
            height: "100%",
          }}
          wrapLongLines={true}
        >
          {snippet.code}
        </SyntaxHighlighter>
      </div>

      {/* Footer Tags */}
      <div className="flex flex-wrap gap-2 mt-4">
        {snippet.tags &&
          snippet.tags.map((tag, index) => (
            <span
              key={index}
              className="text-[11px] text-gray-500 bg-gray-800/40 px-2 py-1 rounded-md border border-gray-800"
            >
              #{tag.trim()}
            </span>
          ))}
      </div>
    </div>
  );
};

export default SnippetCard;
