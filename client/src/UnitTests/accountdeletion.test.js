import { deleteAccount } from "../firebase";
import { describe, it, vi, expect } from "vitest";
import { getAuth } from "firebase/auth";

describe("Account Deletion", () => {
  it("should delete the current user account", async () => {
    const mockDelete = vi.fn().mockResolvedValueOnce(undefined);
    const mockUser = { delete: mockDelete };
    vi.spyOn(getAuth(), "currentUser", "get").mockReturnValue(mockUser);

    await deleteAccount();
    expect(mockDelete).toHaveBeenCalled();
  });
});
