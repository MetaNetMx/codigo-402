import assert from "node:assert/strict";
import test from "node:test";
import { decidirCobro } from "./decidir.js";

const DESTINO = "GCH2GWVOPSXXO7QLBFZ3C4TXESLOOMGVNR3ZCDQ7JTVEW34WOYSCAFAL";

test("acepta el cobro de 0.01 USDC dentro del tope", () => {
  const r = decidirCobro({ precio: "0.01", tope: "0.02", destino: DESTINO, destinoEsperado: DESTINO });
  assert.equal(r.pagar, true);
  assert.match(r.respuesta, /^Sí\./);
});

test("rechaza un cobro que supera el tope", () => {
  const r = decidirCobro({ precio: "0.05", tope: "0.02", destino: DESTINO, destinoEsperado: DESTINO });
  assert.equal(r.pagar, false);
  assert.match(r.respuesta, /supera el tope/);
});

test("rechaza un destinatario distinto", () => {
  const r = decidirCobro({
    precio: "0.01",
    tope: "0.02",
    destino: "GAMIGO",
    destinoEsperado: DESTINO,
  });
  assert.equal(r.pagar, false);
  assert.match(r.respuesta, /destinatario/);
});

test("rechaza un precio vacío", () => {
  const r = decidirCobro({ precio: "", tope: "0.02" });
  assert.equal(r.pagar, false);
});
