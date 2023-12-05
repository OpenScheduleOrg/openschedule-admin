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
  saveAccessToken(token: string): void {
    sessionStorage.setItem("access_token", token);
  }
  getAccessToken(): string | null {
    return sessionStorage.getItem("access_token");
  }
  removeAccessToken(): void {
    sessionStorage.removeItem("access_token");
  }
}

export default new LocalStorageManager();
