import { useEffect } from "react";
import { db } from "../../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function CreateTestUser() {
  useEffect(() => {
    async function createUser() {
      const companyId = "CID-XYX-V1Z4-NOI";
      const uniqueId = "AID-NEH-9W68-210";
      await setDoc(doc(db, "users", companyId), {
        companyId,
        uniqueId,
        name: "Test User",
        status: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      alert("Test user created! Now you can login with these credentials.");
    }
    createUser();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h2>Test User Created</h2>
      <p>
        <b>Company ID:</b> CID-XYX-V1Z4-NOI<br />
        <b>Unique ID:</b> AID-NEH-9W68-210<br />
        <br />
        Ab aap login page par in credentials se login kar sakte hain.
      </p>
    </div>
  );
} 