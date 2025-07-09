import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ReactMarkdown from "react-markdown";
import { Save, Edit, Eye, Settings, Cloud, CloudOff } from "lucide-react";
import { gistService } from "@/services/gist";
import { SettingsDialog } from "./SettingsDialog";
import { listen } from "@tauri-apps/api/event";

interface NoteData {
  content: string;
  lastSaved?: Date;
}

export function NotePanel() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Load note from localStorage and check Gist config on mount
  useEffect(() => {
    const loadInitialContent = async () => {
      // Check if Gist is configured
      setIsOnline(gistService.isConfigured());
      
      // Try to load from Gist first if configured
      if (gistService.isConfigured()) {
        try {
          const gistContent = await gistService.loadFromGist();
          setNoteContent(gistContent);
          setSyncError(null);
        } catch (error) {
          console.error("Failed to load from Gist:", error);
          setSyncError("Failed to load from Gist. Using local content.");
          
          // Fall back to local storage
          const savedNote = localStorage.getItem("simple-notes-content");
          if (savedNote) {
            const noteData = JSON.parse(savedNote) as NoteData;
            setNoteContent(noteData.content);
            setLastSaved(noteData.lastSaved ? new Date(noteData.lastSaved) : null);
          }
        }
      } else {
        // Load from local storage if Gist not configured
        const savedNote = localStorage.getItem("simple-notes-content");
        if (savedNote) {
          const noteData = JSON.parse(savedNote) as NoteData;
          setNoteContent(noteData.content);
          setLastSaved(noteData.lastSaved ? new Date(noteData.lastSaved) : null);
        }
      }
    };

    loadInitialContent();

    // Listen for settings event from system tray
    const unlisten = listen("open-settings", () => {
      setSettingsOpen(true);
    });

    return () => {
      unlisten.then(fn => fn());
    };
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      if (noteContent) {
        const noteData: NoteData = {
          content: noteContent,
          lastSaved: new Date()
        };
        localStorage.setItem("simple-notes-content", JSON.stringify(noteData));
        setLastSaved(new Date());
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [noteContent]);

  const handleSave = async () => {
    setIsSaving(true);
    setSyncError(null);
    try {
      if (gistService.isConfigured()) {
        await gistService.saveToGist(noteContent);
        setLastSaved(new Date());
        setIsOnline(true);
      } else {
        // Just save locally if not configured
        setLastSaved(new Date());
        setSettingsOpen(true); // Prompt to configure
      }
    } catch (error) {
      console.error("Failed to save:", error);
      setSyncError("Failed to save to Gist. Content saved locally.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfigured = () => {
    setIsOnline(gistService.isConfigured());
    if (gistService.isConfigured() && noteContent) {
      handleSave(); // Auto-save after configuration
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  return (
    <>
      <Card className="h-screen flex flex-col border-0 rounded-none shadow-none">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleEditMode}
              className="gap-2"
            >
              {isEditMode ? (
                <>
                  <Eye className="h-4 w-4" />
                  Preview
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  Edit
                </>
              )}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Cloud className="h-4 w-4 text-green-500" />
            ) : (
              <CloudOff className="h-4 w-4 text-muted-foreground" />
            )}
            {lastSaved && (
              <span className="text-xs text-muted-foreground">
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        {syncError && (
          <Alert variant="destructive" className="mx-4 mt-4">
            <AlertDescription>{syncError}</AlertDescription>
          </Alert>
        )}

      <ScrollArea className="flex-1 p-4">
        {isEditMode ? (
          <Textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Start typing your notes here..."
            className="min-h-full resize-none border-0 focus-visible:ring-0 font-mono text-sm"
            autoFocus
          />
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {noteContent ? (
              <ReactMarkdown>{noteContent}</ReactMarkdown>
            ) : (
              <p className="text-muted-foreground italic">
                Double-click or press Edit to start writing...
              </p>
            )}
          </div>
        )}
      </ScrollArea>
    </Card>
    
    <SettingsDialog
      open={settingsOpen}
      onOpenChange={setSettingsOpen}
      onConfigured={handleConfigured}
    />
    </>
  );
}