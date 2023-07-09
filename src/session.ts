export class SessionCache {
    private static instance: SessionCache;
    private session: any; // Replace `any` with the type of your session object
  
    private constructor() {
      this.session = null;
    }
  
    public static getInstance(): SessionCache {
      if (!SessionCache.instance) {
        SessionCache.instance = new SessionCache();
        console.log('New session');
        
      }
      return SessionCache.instance;
    }
  
    public getSession(): any {
      return this.session;
    }
  
    public setSession(session: any): void {
      this.session = session;
    }
  }
  