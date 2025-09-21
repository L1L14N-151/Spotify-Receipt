export interface IAuthService {
  login(): Promise<void>;
  handleCallback(code: string, state: string): Promise<AuthResult>;
  getAuthStatus(): AuthStatus;
  logout(): void;
  getAccessToken(): string | null;
  generateCodeVerifier(): string;
  generateCodeChallenge(verifier: string): Promise<string> | string;
  storeCodeVerifier(verifier: string): void;
  getStoredCodeVerifier(): string | null;
  generateState(): string;
  storeState(state: string): void;
  storeTokens(tokens: TokenData): void;
  getRedirectUri(): string;
  buildAuthorizationUrl(scopes?: string[]): string | Promise<string>;
}

export interface AuthResult {
  success: boolean;
  accessToken?: string;
  expiresIn?: number;
  error?: string;
}

export interface AuthStatus {
  isAuthenticated: boolean;
  expiresAt?: number;
  userId?: string;
}

export interface TokenData {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

export class AuthService implements IAuthService {
  constructor(config?: { clientId: string }) {}

  async login(): Promise<void> {
    throw new Error('Not implemented');
  }

  async handleCallback(code: string, state: string): Promise<AuthResult> {
    throw new Error('Not implemented');
  }

  getAuthStatus(): AuthStatus {
    throw new Error('Not implemented');
  }

  logout(): void {
    throw new Error('Not implemented');
  }

  getAccessToken(): string | null {
    throw new Error('Not implemented');
  }

  generateCodeVerifier(): string {
    throw new Error('Not implemented');
  }

  generateCodeChallenge(verifier: string): string {
    throw new Error('Not implemented');
  }

  storeCodeVerifier(verifier: string): void {
    throw new Error('Not implemented');
  }

  getStoredCodeVerifier(): string | null {
    throw new Error('Not implemented');
  }

  generateState(): string {
    throw new Error('Not implemented');
  }

  storeState(state: string): void {
    throw new Error('Not implemented');
  }

  storeTokens(tokens: TokenData): void {
    throw new Error('Not implemented');
  }

  getRedirectUri(): string {
    throw new Error('Not implemented');
  }

  buildAuthorizationUrl(scopes?: string[]): string {
    throw new Error('Not implemented');
  }
}