import { decidirCobro } from "./decidir.js";

const decision = decidirCobro({
  precio: process.env.PRECIO || "0.01",
  tope: (process.env.TOPE || "$0.02").replace("$", ""),
  destino: process.env.DESTINO,
  destinoEsperado: process.env.MI_PUBLICA,
});

console.log(decision.respuesta);
process.exit(decision.pagar ? 0 : 1);
