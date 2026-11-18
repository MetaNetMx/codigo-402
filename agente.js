import { x402Client, x402HTTPClient, wrapFetchWithPayment } from "@x402/fetch";
import { createEd25519Signer } from "@x402/stellar";
import { ExactStellarScheme } from "@x402/stellar/exact/client";

const API = "http://localhost:3001/dato";
const NETWORK = "stellar:testnet";
const TOPE = process.env.TOPE || "$0.02";
const INTENTOS = 3;

const signer = createEd25519Signer(process.env.AGENTE_SECRETA, NETWORK);
const client = x402Client.fromConfig({
  schemes: [{ network: "stellar:*", client: new ExactStellarScheme(signer, { url: "https://soroban-testnet.stellar.org" }) }],
  spendControls: { maxAmountPerPayment: TOPE },
});

const http = new x402HTTPClient(client);
const fetchQuePaga = wrapFetchWithPayment(fetch, client);
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

async function saldoUSDC() {
  const r = await fetch(`https://horizon-testnet.stellar.org/accounts/${signer.address}`);
  const b = (await r.json()).balances.find((x) => x.asset_code === "USDC");
  return b ? Math.round(Number(b.balance) * 1e7) : 0;
}

let precio;
for (let i = 1; ; i++) {
  try {
    const r = await fetch(API);
    if (r.status !== 402) {
      console.log(`La ruta no cobra (status ${r.status}).`);
      process.exit(0);
    }
    precio = Number(http.getPaymentRequiredResponse((h) => r.headers.get(h)).accepts[0].amount);
    break;
  } catch {
    if (i === INTENTOS) {
      console.log(`❌ La API no responde después de ${INTENTOS} intentos. No se pagó nada.`);
      process.exit(1);
    }
    console.log(`La API no responde (intento ${i}/${INTENTOS}), reintento en ${i}s…`);
    await esperar(i * 1000);
  }
}

const saldo = await saldoUSDC();
console.log(`🤖 Agente ${signer.address} · precio ${precio / 1e7} USDC · saldo ${saldo / 1e7} USDC · tope ${TOPE}`);
if (saldo < precio) {
  console.log("⛔ Saldo insuficiente. No se firmó nada.");
  process.exit(1);
}

try {
  const res = await fetchQuePaga(API);
  const pago = http.getPaymentSettleResponse((h) => res.headers.get(h));
  console.log(`Respuesta ${res.status}:`, await res.json());
  console.log(`Pagó: https://stellar.expert/explorer/testnet/tx/${pago.transaction}`);
} catch (e) {
  if (String(e.message).includes("maxAmountPerPayment")) {
    console.log(`⛔ Rechazado: la API cobra más que el tope (${TOPE}). No se firmó ni se envió ninguna transacción.`);
    process.exit(1);
  }
  const despues = await saldoUSDC();
  console.log(`❌ Falló el pago: ${e.message}`);
  console.log(
    despues < saldo
      ? "Ojo: el saldo sí bajó, el pago pudo liquidarse. Revisa la wallet antes de volver a intentar."
      : "El saldo no cambió: no se cobró nada. Puedes volver a intentar, que firmará una autorización nueva.",
  );
  process.exit(1);
}