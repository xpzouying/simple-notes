import { Octokit } from "@octokit/rest";

interface GistConfig {
  token: string;
  gistId?: string;
}


const GIST_FILENAME = "simple-notes.md";
const CONFIG_KEY = "simple-notes-config";

export class GistService {
  private octokit: Octokit | null = null;
  private config: GistConfig | null = null;

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    const configStr = localStorage.getItem(CONFIG_KEY);
    if (configStr) {
      this.config = JSON.parse(configStr);
      if (this.config?.token) {
        this.octokit = new Octokit({
          auth: this.config.token,
        });
      }
    }
  }

  saveConfig(config: GistConfig) {
    this.config = config;
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    if (config.token) {
      this.octokit = new Octokit({
        auth: config.token,
      });
    }
  }

  getConfig(): GistConfig | null {
    return this.config;
  }

  isConfigured(): boolean {
    return !!(this.config?.token && this.config?.gistId);
  }

  async createGist(content: string): Promise<string> {
    if (!this.octokit) {
      throw new Error("GitHub token not configured");
    }

    const response = await this.octokit.gists.create({
      description: "Simple Notes - Your personal notes",
      public: false,
      files: {
        [GIST_FILENAME]: {
          content,
        },
      },
    });

    const gistId = response.data.id;
    if (gistId) {
      this.saveConfig({ ...this.config!, gistId });
      return gistId;
    }
    throw new Error("Failed to create Gist");
  }

  async loadFromGist(): Promise<string> {
    if (!this.octokit || !this.config?.gistId) {
      throw new Error("Gist not configured");
    }

    const response = await this.octokit.gists.get({
      gist_id: this.config.gistId,
    });

    const file = response.data.files?.[GIST_FILENAME];
    if (!file || !file.content) {
      throw new Error("Note file not found in Gist");
    }

    return file.content;
  }

  async saveToGist(content: string): Promise<void> {
    if (!this.octokit) {
      throw new Error("GitHub token not configured");
    }

    if (!this.config?.gistId) {
      // Create new gist if none exists
      await this.createGist(content);
      return;
    }

    // Update existing gist
    await this.octokit.gists.update({
      gist_id: this.config.gistId,
      files: {
        [GIST_FILENAME]: {
          content,
        },
      },
    });
  }

  async testConnection(): Promise<boolean> {
    if (!this.octokit) {
      return false;
    }

    try {
      await this.octokit.users.getAuthenticated();
      return true;
    } catch {
      return false;
    }
  }
}

export const gistService = new GistService();