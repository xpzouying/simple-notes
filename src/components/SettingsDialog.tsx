import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { gistService } from "@/services/gist";
import { CheckCircle, XCircle, Info } from "lucide-react";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfigured?: () => void;
}

export function SettingsDialog({ open, onOpenChange, onConfigured }: SettingsDialogProps) {
  const [token, setToken] = useState("");
  const [gistId, setGistId] = useState("");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);

  useEffect(() => {
    const config = gistService.getConfig();
    if (config) {
      setToken(config.token);
      setGistId(config.gistId || "");
    }
  }, [open]);

  const handleTest = async () => {
    if (!token) return;

    setTesting(true);
    setTestResult(null);

    try {
      // Save token temporarily for testing
      gistService.saveConfig({ token, gistId });
      const result = await gistService.testConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult(false);
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    gistService.saveConfig({ token, gistId });
    onConfigured?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>GitHub Gist Configuration</DialogTitle>
          <DialogDescription>
            Configure your GitHub Personal Access Token to sync notes with Gist.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="token">GitHub Personal Access Token</Label>
            <Input
              id="token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            />
            <p className="text-xs text-muted-foreground">
              Create a token at{" "}
              <a
                href="https://github.com/settings/tokens/new?scopes=gist"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                GitHub Settings
              </a>{" "}
              with "gist" scope.
            </p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="gistId">Gist ID (Optional)</Label>
            <Input
              id="gistId"
              value={gistId}
              onChange={(e) => setGistId(e.target.value)}
              placeholder="Leave empty to create a new Gist"
            />
            <p className="text-xs text-muted-foreground">
              If you have an existing Gist, enter its ID. Otherwise, a new one will be created.
            </p>
          </div>

          {testResult !== null && (
            <Alert variant={testResult ? "default" : "destructive"}>
              {testResult ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                {testResult
                  ? "Connection successful! Token is valid."
                  : "Connection failed. Please check your token."}
              </AlertDescription>
            </Alert>
          )}

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Your notes will be saved in a private Gist. Only you can access them.
            </AlertDescription>
          </Alert>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleTest}
            disabled={!token || testing}
          >
            {testing ? "Testing..." : "Test Connection"}
          </Button>
          <Button onClick={handleSave} disabled={!token}>
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}