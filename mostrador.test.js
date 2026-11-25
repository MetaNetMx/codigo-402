import assert from "node:assert/strict";
import test from "node:test";
import { prepararMostrador } from "./mostrador.js";

const DESTINO = "GCH2GWVOPSXXO7QLBFZ3C4TXESLOOMGVNR3ZCDQ7JTVEW34WOYSCAFAL";

test("prepara el cobro de 0.01 cuando cabe en el tope", () => {
  const r = prepararMostrador({ precio: "0.01", tope: "0.02", destino: DESTINO, destinoEsperado: DESTINO });
  assert.equal(r.pagar, true);
  assert.equal(r.monto, "0.01");
});

test("no prepara un cobro por encima del tope", () => {
  const r = prepararMostrador({ precio: "0.05", tope: "0.02", destino: DESTINO, destinoEsperado: DESTINO });
  assert.equal(r.pagar, false);
  assert.equal(r.monto, null);
  assert.match(r.respuesta, /No se firma nada/);
});

test("no prepara un cobro mayor al máximo de la tiendita", () => {
  const r = prepararMostrador({ precio: "0.50", tope: "1.00", destino: DESTINO, destinoEsperado: DESTINO });
  assert.equal(r.pagar, false);
  assert.match(r.respuesta, /máximo/);
});

test("no prepara un precio vacío", () => {
  const r = prepararMostrador({ precio: "", tope: "0.02", destino: DESTINO, destinoEsperado: DESTINO });
  assert.equal(r.pagar, false);
  assert.equal(r.monto, null);
});
