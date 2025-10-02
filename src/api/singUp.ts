import { mockRequest } from "./mockRequest"

type Response = { 
  token: string, 
  user: { 
    id: string, 
    email: string, 
    totalSessions: number, 
    currentStreak: number, 
    accuracyPercentage: number 
  } 
}

export function signUp(email: string, password: string): Promise<Response> {
  const response: Response = {
    token: 'token', 
    user: { 
      id: 'id', 
      email, 
      totalSessions: 0, 
      currentStreak: 0, 
      accuracyPercentage: 0 
    } 
  }

  return mockRequest(response)
}