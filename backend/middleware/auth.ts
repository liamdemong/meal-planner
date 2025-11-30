import { Request, Response, NextFunction } from "express";
import { getAuth } from "firebase-admin/auth";

export interface AuthRequest extends Request {
  userId?: string;
}


// verify Firebase ID token and attach userId to request
export async function authenticateUser(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid authorization header" });
    }

    const idToken = authHeader.split("Bearer ")[1];

    // Verify the ID token
    const decodedToken = await getAuth().verifyIdToken(idToken);
    
    // Attach userId to request
    req.userId = decodedToken.uid;

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
