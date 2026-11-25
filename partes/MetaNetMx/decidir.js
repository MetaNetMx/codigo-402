// Decide si el agente puede pagar un cobro. No firma ni envía nada.
export function decidirCobro({ precio = "0.01", tope = "0.02", destino, destinoEsperado } = {}) {
  const precioN = numero(precio);
  const topeN = numero(tope);

  if (precioN === null || precioN <= 0) {
    return { pagar: false, respuesta: "No. El cobro no tiene un precio válido." };
  }
  if (topeN === null || precioN > topeN) {
    return {
      pagar: false,
      respuesta: `No. El cobro de ${precioN} USDC supera el tope de ${topeN ?? "—"} USDC. No se firma nada.`,
    };
  }
  if (destinoEsperado && destino !== destinoEsperado) {
    return { pagar: false, respuesta: "No. El destinatario no es la cuenta del cobro." };
  }
  return { pagar: true, respuesta: `Sí. El agente puede pagar ${precioN} USDC.` };
}

function numero(valor) {
  const n = Number(String(valor ?? "").replace("$", "").trim());
  return Number.isFinite(n) ? n : null;
}
