import { describe, it, expect } from "vitest";
import {
  auth,
  saveUserProfile,
  loadUserProfile
} from "../firebase";

import { signInWithEmailAndPassword } from "firebase/auth";

describe("User Profile Edit and Revert", () => {
  const testEmail = "cjli0430@gmail.com";
  const testPassword = "123456";
  let userId = null;

  it("signs in, edits profile, and reverts changes", async () => {
    // Step 1: Sign in
    const userCredential = await signInWithEmailAndPassword(auth, testEmail, testPassword);
    const user = userCredential.user;
    expect(user).toBeDefined();
    userId = user.uid;

    // Step 2: Load original profile
    const originalProfile = await loadUserProfile(userId);
    expect(originalProfile).toBeDefined();

    // Step 3: Modify the profile
    const modifiedProfile = {
      ...originalProfile,
      name: "Changed Name",
      major: "Testing",
    };

    await saveUserProfile(userId, modifiedProfile);

    const updatedProfile = await loadUserProfile(userId);
    expect(updatedProfile.name).toBe("Changed Name");
    expect(updatedProfile.major).toBe("Testing");

    // Step 4: Revert the profile
    await saveUserProfile(userId, originalProfile);
    const revertedProfile = await loadUserProfile(userId);
    expect(revertedProfile.name).toBe(originalProfile.name);
    expect(revertedProfile.major).toBe(originalProfile.major);
  });
});
