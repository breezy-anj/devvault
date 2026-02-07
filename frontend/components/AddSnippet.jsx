import { useState, useEffect } from "react";
import axios from "axios";
import { X, Code, Terminal, Tag } from "lucide-react";

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "rust", label: "Rust" },
  { value: "go", label: "Go" },
  { value: "typescript", label: "TypeScript" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "sql", label: "SQL" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "bash", label: "Bash/Shell" },
  { value: "json", label: "JSON" },
  { value: "markdown", label: "Markdown" },
  { value: "zig", label: "Zig" },
  { value: "lua", label: "Lua" },
];

const AddSnippet = ({ onClose, onSnippetAdded, snippetToEdit = null }) => {
  const [formData, setFormData] = useState({
    title: "",
    language: "javascript",
    code: "",
    tags: "",
  });

  useEffect(() => {
    if (snippetToEdit) {
      setFormData({
        title: snippetToEdit.title,
        language: snippetToEdit.language,
        code: snippetToEdit.code,
        tags: snippetToEdit.tags ? snippetToEdit.tags.join(", ") : "",
      });
    }
  }, [snippetToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. GET THE TOKEN
    const token = localStorage.getItem("devvault_token");

    try {
      const formattedTags = formData.tags.split(",").map((tag) => tag.trim());
      const payload = { ...formData, tags: formattedTags };

      if (snippetToEdit) {
        // UPDATE Existing Snippet (With Token)
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/snippets/${snippetToEdit._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } },
        );
      } else {
        // CREATE New Snippet (With Token)
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/snippets/create`,
          payload,
          { headers: { Authorization: token } }, // <--- ATTACH TOKEN
        );
      }

      onSnippetAdded();
      onClose();
    } catch (err) {
      console.error("Error saving snippet:", err);
      alert(
        err.response?.data?.message ||
          "Failed to save snippet. Please try logging in again.",
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-[#1e1e1e] w-full max-w-2xl rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800 bg-[#252526]">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Terminal className="text-blue-400" size={20} />
            {snippetToEdit ? "Edit Snippet" : "Add New Snippet"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-white/10 p-1 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">
                Title
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Memory Allocation"
                className="w-full bg-[#0d1117] border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">
                Language
              </label>
              <select
                className="w-full bg-[#0d1117] border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none appearance-none"
                value={formData.language}
                onChange={(e) =>
                  setFormData({ ...formData, language: e.target.value })
                }
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1 uppercase flex items-center gap-2">
              <Code size={14} /> Code
            </label>
            <textarea
              required
              rows="8"
              placeholder="// Paste your code here..."
              className="w-full bg-[#0d1117] border border-gray-700 rounded-lg p-4 font-mono text-sm text-gray-300 focus:border-blue-500 outline-none resize-none"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1 uppercase flex items-center gap-2">
              <Tag size={14} /> Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="pointers, memory, algorithm"
              className="w-full bg-[#0d1117] border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
            />
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all mt-4">
            {snippetToEdit ? "Update Snippet" : "Save Snippet"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSnippet;
