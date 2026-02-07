import { Copy, Trash2, Edit2, Check } from "lucide-react";
import { useState } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

const SnippetCard = ({ snippet, onDelete, onEdit }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset icon after 2s
  };

  return (
    <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all group relative flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3
            className="text-lg font-bold text-white mb-1 truncate max-w-[180px]"
            title={snippet.title}
          >
            {snippet.title}
          </h3>
          <span className="text-xs font-mono text-blue-400 bg-blue-400/10 px-2 py-1 rounded inline-block">
            {snippet.language}
          </span>
        </div>

        {/* Action Buttons (Now visible on hover) */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(snippet)}
            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
            title="Edit Snippet"
          >
            <Edit2 size={16} />
          </button>

          <button
            onClick={() => onDelete(snippet._id)}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
            title="Delete Snippet"
          >
            <Trash2 size={16} />
          </button>

          <button
            onClick={copyToClipboard}
            className="p-2 text-gray-400 hover:text-white bg-[#2d2d2d] rounded-lg transition-colors"
            title="Copy Code"
          >
            {copied ? (
              <Check size={16} className="text-green-400" />
            ) : (
              <Copy size={16} />
            )}
          </button>
        </div>
      </div>

      {/*  Syntax Highlighter Block */}
      <div className="bg-[#0d1117] rounded-lg overflow-hidden border border-gray-800 mb-4 flex-1">
        <SyntaxHighlighter
          language={snippet.language.toLowerCase()}
          style={atomOneDark}
          customStyle={{
            padding: "1rem",
            fontSize: "0.875rem",
            lineHeight: "1.5",
            backgroundColor: "transparent", // Inherit bg from parent
            margin: 0,
            maxHeight: "300px", // Prevent super long cards
          }}
          wrapLongLines={true}
        >
          {snippet.code}
        </SyntaxHighlighter>
      </div>

      {/* Footer Tags */}
      <div className="flex flex-wrap gap-2 mt-auto">
        {snippet.tags &&
          snippet.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded-full"
            >
              #{tag.trim()}
            </span>
          ))}
      </div>
    </div>
  );
};

export default SnippetCard;
