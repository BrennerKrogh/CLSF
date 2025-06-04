import { describe, it, expect } from "vitest";
import {
  auth,
  joinGroup,
  leaveGroup,
  getUserGroups,
} from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

describe("Study Group Membership", () => {
  const testEmail = "testuser@gmail.com";
  const testPassword = "testuser";
  const testGroupId = "Mech"; // This should exist in your database already


  it("should join and then leave a group successfully", async () => {
    // Step 1: Sign in
    const userCredential = await signInWithEmailAndPassword(auth, testEmail, testPassword);
    const user = userCredential.user;
    expect(user).toBeDefined();
    const userId = user.uid;

    // Step 2: Join the group
    const joinResult = await joinGroup(testGroupId, userId);
    expect(joinResult.members).toContain(userId);

    // Step 3: Confirm group is in user’s group list
    const userGroups = await getUserGroups(userId);
    const joined = userGroups.find(group => group.id === testGroupId);
    expect(joined).toBeDefined();

    // Step 4: Leave the group
    const leaveResult = await leaveGroup(testGroupId, userId);
    expect(leaveResult.members).not.toContain(userId);

    // Step 5: Confirm group is no longer in user’s group list
    const updatedGroups = await getUserGroups(userId);
    const stillJoined = updatedGroups.find(group => group.id === testGroupId);
    expect(stillJoined).toBeUndefined();
  });
});
