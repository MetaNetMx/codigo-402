// El mostrador deja que el tendero ponga el cobro y el cliente ponga el tope.
// Solo firma si el cobro cabe. El dinero sale de la cartera del cliente y llega a la del tendero.
import { Keypair, Horizon, TransactionBuilder, Networks, Operation, Asset, BASE_FEE, Memo } from "@stellar/stellar-sdk";
import { decidirCobro } from "./partes/MetaNetMx/decidir.js";

export const COBRO_MAXIMO = 0.2;
const USDC_EMISOR = "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5";
const USDC = new Asset("USDC", USDC_EMISOR);
const horizon = new Horizon.Server("https://horizon-testnet.stellar.org");

let ocupado = false;

export function prepararMostrador({ precio, tope, destino, destinoEsperado, maximo = COBRO_MAXIMO } = {}) {
  const cobro = centavos(precio);
  const limite = centavos(tope);
  if (cobro === null || limite === null) {
    return { pagar: false, monto: null, respuesta: "No. El cobro y el tope se escriben en centavos." };
  }
  if (Number(cobro) > maximo) {
    return {
      pagar: false,
      monto: null,
      respuesta: `No. En la tiendita el cobro máximo de práctica es ${maximo.toFixed(2)} USDC.`,
    };
  }
  const decision = decidirCobro({ precio: cobro, tope: limite, destino, destinoEsperado });
  if (!decision.pagar) return { ...decision, monto: null };
  return { ...decision, monto: cobro };
}

export async function leerCarteras() {
  const cliente = Keypair.fromSecret(process.env.AGENTE_SECRETA).publicKey();
  const tendero = process.env.MI_PUBLICA;
  const [carteraCliente, carteraTendero] = await Promise.all([leerCuenta(cliente), leerCuenta(tendero)]);
  return { red: "stellar:testnet", cliente: carteraCliente, tendero: carteraTendero, maximo: COBRO_MAXIMO.toFixed(2) };
}

export async function cobrar({ precio, tope } = {}) {
  const destino = process.env.MI_PUBLICA;
  const preparado = prepararMostrador({ precio, tope, destino, destinoEsperado: destino });
  if (!preparado.pagar) return { ...preparado, firmado: false };
  if (!process.env.AGENTE_SECRETA || !destino) {
    return { pagar: false, firmado: false, monto: null, respuesta: "Falta una cartera en el servidor. No se firmó nada." };
  }
  if (ocupado) {
    return { pagar: false, firmado: false, monto: null, respuesta: "Espera a que termine el cobro anterior." };
  }

  ocupado = true;
  try {
    const yo = Keypair.fromSecret(process.env.AGENTE_SECRETA);
    const cuenta = await horizon.loadAccount(yo.publicKey());
    const usdc = saldo(cuenta.balances, "USDC");
    const xlm = saldo(cuenta.balances, "native");
    if (usdc === null) {
      return { pagar: false, firmado: false, monto: null, respuesta: "La cartera del cliente no puede recibir USDC. No se firmó nada." };
    }
    if (Number(usdc) < Number(preparado.monto)) {
      return {
        pagar: false,
        firmado: false,
        monto: null,
        respuesta: `Sí cabe en el tope, pero el cliente solo tiene ${usdc} USDC. No se firmó nada.`,
      };
    }
    if (xlm === null || Number(xlm) < 2) {
      return { pagar: false, firmado: false, monto: null, respuesta: "La cartera del cliente no tiene comisión para enviar. No se firmó nada." };
    }

    const tx = new TransactionBuilder(cuenta, { fee: BASE_FEE, networkPassphrase: Networks.TESTNET })
      .addOperation(Operation.payment({ destination: destino, asset: USDC, amount: preparado.monto }))
      .addMemo(Memo.text("Tiendita 402"))
      .setTimeout(60)
      .build();
    tx.sign(yo);
    const res = await horizon.submitTransaction(tx);
    return {
      pagar: true,
      firmado: true,
      monto: preparado.monto,
      hash: res.hash,
      enlace: `https://stellar.expert/explorer/testnet/tx/${res.hash}`,
      respuesta: `Sí. El cliente pagó ${preparado.monto} USDC al tendero.`,
    };
  } catch (e) {
    return { pagar: false, firmado: false, monto: null, respuesta: mensajeDeRed(e) };
  } finally {
    ocupado = false;
  }
}

function centavos(valor) {
  const n = Number(String(valor ?? "").replace("$", "").trim());
  if (!Number.isFinite(n) || n <= 0) return null;
  const c = Math.round(n * 100);
  if (Math.abs(n * 100 - c) > 1e-6) return null;
  return (c / 100).toFixed(2);
}

async function leerCuenta(cuenta) {
  const r = await fetch(`https://horizon-testnet.stellar.org/accounts/${cuenta}`);
  if (!r.ok) return { cuenta, usdc: null };
  const balances = (await r.json()).balances;
  return { cuenta, usdc: saldo(balances, "USDC") };
}

function saldo(balances, cual) {
  const b =
    cual === "native"
      ? balances.find((x) => x.asset_type === "native")
      : balances.find((x) => x.asset_code === "USDC" && x.asset_issuer === USDC_EMISOR);
  return b ? b.balance : null;
}

function mensajeDeRed(e) {
  const codes = e?.response?.data?.extras?.result_codes;
  const code = codes?.operations?.[0] || codes?.transaction || "";
  if (code === "op_underfunded") return "El cliente no tiene suficiente USDC. No se completó el pago.";
  if (code === "op_no_trust" || code === "op_no_destination") return "La cartera del tendero no puede recibir este USDC. No se completó el pago.";
  if (code === "tx_bad_seq") return "La red estaba ocupada. Inténtalo otra vez. No se completó el pago.";
  return "La red de práctica no aceptó el pago. No se completó.";
}
