import {
  Transaction as tns,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import axios from "axios";
import { useState } from "react";

export function Transaction() {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState<string | null>("");

  const connectionString = import.meta.env.VITE_ALCHEMY_URL;

  const connection = new Connection(connectionString);
  const fromPublicKey = new PublicKey(
    "Cw9dZmWDw1cfUY9ezqiaeCsB7a1meEfj9YVTguwscPjK"
  );

  async function sendSOL() {
    try {
      const ix = SystemProgram.transfer({
        fromPubkey: fromPublicKey,
        toPubkey: new PublicKey(address),
        lamports: Number(amount) * LAMPORTS_PER_SOL,
      });

      const tx = new tns().add(ix);

      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = fromPublicKey;

      const serializedTx = tx.serialize({
        requireAllSignatures: false,
        verifySignatures: false,
      });

      console.log(serializedTx);

      await axios.post("http://localhost:3000/api/v1/txn/sign", {
        message: serializedTx.toString("base64"),
        // message:serializedTx,
        retry: false,
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div>
        <input
          type="text"
          placeholder="Amount"
          value={amount || ""}
          onChange={(e) => {
            setAmount(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
          }}
        />
        <button onClick={sendSOL}>Submit</button>
      </div>
    </>
  );
}
