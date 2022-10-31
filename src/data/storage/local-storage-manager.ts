class LocalStorageManager {
  saveSessionToken(token: string): void {
    localStorage.setItem("session_token", token);
  }
  getSessionToken(): string | null {
    return localStorage.getItem("session_token");
  }
  removeSessionToken(): void {
    localStorage.removeItem("session_token");
  }
}

export default new LocalStorageManager();
