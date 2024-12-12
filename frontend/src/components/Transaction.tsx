import {
  Transaction as tns,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import axios from "axios";

export function Transaction() {
  const connectionString = import.meta.env.VITE_ALCHEMY_URL;

  const connection = new Connection(connectionString);
  const fromPublicKey = new PublicKey(
    "Er5Wm5aEBhqaA1ypkVz7oizasdC7dUmVyAMSMy1Kmmjy"
  );

  async function sendSOL() {

    try {
    const ix = SystemProgram.transfer({
      fromPubkey: fromPublicKey,
      toPubkey: new PublicKey("Cw9dZmWDw1cfUY9ezqiaeCsB7a1meEfj9YVTguwscPjK"),
      lamports: 0.01 * LAMPORTS_PER_SOL,
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
      message: serializedTx,
      retry: false,
    });
} catch(error){
  console.log(error); 
}
  }
  return (
    <>
      <div>
        <input type="text" placeholder="Amount" />
        <input type="text" placeholder="Address" />
        <button onClick={sendSOL}>Submit</button>
      </div>
    </>
  );
}
