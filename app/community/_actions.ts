"use server";
 
import { clerkClient } from "@clerk/nextjs/server";
 
export async function setRole(formData: FormData) {
 
  try {
    const res = await clerkClient.users.updateUser(
      formData.get("id") as string,
      {
        publicMetadata: { role: formData.get("role") },
      }
    );
    return { message: res.publicMetadata };
  } catch (err) {
    return { message: err };
  }
}