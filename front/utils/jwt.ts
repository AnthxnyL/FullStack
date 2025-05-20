"use server";
 
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
 
const key = new TextEncoder().encode(process.env.JWT_SECRET);
 
// Read the JWT
export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log(error)
    return false; // Session expired
  }
}
 
// Create the cookie
export async function createCookie(token: string) {
  const cookie = await cookies();
 
  cookie.set("token", token, {
    httpOnly: true,
    secure: false,
    path: "/",
  });
}
 
// Destroy the cookie
export async function logout() {
  const cookie = await cookies();
  // Destroy the session
  cookie.set("token", "", { expires: new Date(0) });
}
 
// Read the cookie
export async function getToken() {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;
  if (!token) return null;
  return token;
}
 
// Read the cookie
export async function getSession() {
  const token = await getToken();
  if (!token) return null;
  return await decrypt(token);
}

