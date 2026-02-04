import { useEffect, useState, useRef } from "react";
import axios from "axios";
import SnippetCard from "./SnippetCard";
import AddSnippet from "./AddSnippet";
import { LogOut, Search, Plus, Undo2 } from "lucide-react";

const Dashboard = ({ onLogout }) => {
  const [snippets, setSnippets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState(null);

  const username = localStorage.getItem("devvault_user") || "Developer";

  // Undo State
  const [lastDeleted, setLastDeleted] = useState(null);
  const [showUndo, setShowUndo] = useState(false);
  const undoTimeoutRef = useRef(null);

  const fetchSnippets = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/snippets/all?q=${searchQuery}`,
      );
      setSnippets(res.data);
    } catch (err) {
      console.error("Failed to fetch snippets", err);
    }
  };

  useEffect(() => {
    fetchSnippets();
  }, [searchQuery]);

  // Global Undo Listener (Ctrl + Z)
  useEffect(() => {
    const handleKeyDown = async (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        if (lastDeleted) {
          e.preventDefault();
          await handleUndo();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lastDeleted]);

  const handleUndo = async () => {
    if (!lastDeleted) return;

    // Stop the timer so the toast doesn't disappear while clicking it
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/snippets/create`,
        lastDeleted,
      );
      setLastDeleted(null);
      setShowUndo(false);
      fetchSnippets();
    } catch (err) {
      alert("Failed to restore snippet");
    }
  };

  const handleDelete = async (id) => {
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);

    try {
      const snippetToDelete = snippets.find((s) => s._id === id);

      await axios.delete(`${import.meta.env.VITE_API_URL}/api/snippets/${id}`);

      setLastDeleted(snippetToDelete);
      setShowUndo(true);
      fetchSnippets();

      // Start 5-second timer to hide the undo button
      undoTimeoutRef.current = setTimeout(() => {
        setShowUndo(false);
        setLastDeleted(null);
      }, 5000);
    } catch (err) {
      console.error("Error deleting", err);
      alert("Failed to delete snippet");
    }
  };

  const handleEdit = (snippet) => {
    setEditingSnippet(snippet);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSnippet(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Undo Toast */}
      {showUndo && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#2d2d2d] border border-blue-500/50 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 z-50 animate-bounce-in">
          <span>Snippet deleted.</span>
          <button
            onClick={handleUndo}
            className="text-blue-400 font-bold hover:underline flex items-center gap-1"
          >
            <Undo2 size={16} /> Undo (Ctrl+Z)
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            DevVault
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Welcome back,{" "}
            <span className="text-blue-400 font-mono">{username}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-all"
          >
            <Plus size={18} /> New Snippet
          </button>
          <button
            onClick={onLogout}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="relative mb-8">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          size={20}
        />
        <input
          type="text"
          placeholder="Search by title, language, or tag..."
          className="w-full bg-[#1e1e1e] border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 outline-none transition-all shadow-inner"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {snippets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {snippets.map((s) => (
            <SnippetCard
              key={s._id}
              snippet={s}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-gray-800 rounded-3xl">
          <p className="text-gray-500">No snippets found.</p>
        </div>
      )}

      {isModalOpen && (
        <AddSnippet
          onClose={handleCloseModal}
          onSnippetAdded={fetchSnippets}
          snippetToEdit={editingSnippet}
        />
      )}
    </div>
  );
};

export default Dashboard;
