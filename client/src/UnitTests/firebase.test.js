import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";
import { pingBackend } from "../firebase"; // Update the path to the correct location of pingBackend
import { describe, it, expect, vi } from "vitest";

const firebaseConfig = {
    apiKey: "AIzaSyCHRw0E0QyJdCKg3x6110qcCv6CN0aSpm0",
    authDomain: "clsf-100903.firebaseapp.com",
    projectId: "clsf-100903",
    databaseURL: "https://clsf-100903-default-rtdb.firebaseio.com",
    storageBucket: "clsf-100903.firebasestorage.com",
    messagingSenderId: "771126443973",
    appId: "1:771126443973:web:65bb6d3e4a5205336a15ac",
    measurementId: "G-S72EE3YEDX"
  };

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

describe("Firebase Connection", () => {
    it("should verify that pingBackend exists", () => {
        expect(pingBackend).toBeDefined();
        expect(typeof pingBackend).toBe("function");
    });

    it("should initialize Firebase app", () => {
        expect(app).toBeDefined();
    });

    it("should connect to Firebase database", async () => {
        const testRef = ref(db, "testConnection");
        const testData = { message: "Firebase connection test" };

        // Write data to Firebase
        await set(testRef, testData);

        // Read data back from Firebase
        const snapshot = await get(testRef);
        expect(snapshot.exists()).toBe(true);
        expect(snapshot.val()).toEqual(testData);
    });

    it("should successfully ping backend", async () => {
        const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
        await pingBackend(); // Ensure pingBackend returns a promise
        consoleSpy.mock.calls.forEach((call, index) => {
          console.log(`Log call ${index + 1}:`, call);
        });
        expect(consoleSpy).toHaveBeenCalledWith("Ping successful");
        consoleSpy.mockRestore();
    });
});