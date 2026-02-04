import { Copy, Trash2, Edit2 } from "lucide-react";

const SnippetCard = ({ snippet, onDelete, onEdit }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(snippet.code);
    alert("Code copied!");
  };

  return (
    <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all group relative">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">{snippet.title}</h3>
          <span className="text-xs font-mono text-blue-400 bg-blue-400/10 px-2 py-1 rounded">
            {snippet.language}
          </span>
        </div>

        {/* Action Buttons (Visible on Hover) */}
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
            className="p-2 text-gray-400 hover:text-white bg-[#2d2d2d] rounded-lg"
            title="Copy Code"
          >
            <Copy size={16} />
          </button>
        </div>
      </div>

      <div className="bg-[#0d1117] rounded-lg p-4 font-mono text-sm text-gray-300 overflow-x-auto mb-4 border border-gray-800 max-h-64 scrollbar-thin">
        <pre>{snippet.code}</pre>
      </div>

      <div className="flex flex-wrap gap-2">
        {snippet.tags &&
          snippet.tags.map((tag, index) => (
            <span key={index} className="text-xs text-gray-500">
              #{tag}
            </span>
          ))}
      </div>
    </div>
  );
};

export default SnippetCard;
