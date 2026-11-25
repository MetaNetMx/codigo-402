import express from "express";
import { readFileSync } from "node:fs";
import { paymentMiddlewareFromConfig } from "@x402/express";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { ExactStellarScheme } from "@x402/stellar/exact/server";
import { decidirCobro } from "./partes/MetaNetMx/decidir.js";
import { prepararMostrador, leerCarteras, cobrar } from "./mostrador.js";

const PORT = process.env.PORT || 3001;
const ROUTE = "/dato";
const PRICE = "$0.01"; // precio en USDC
const NETWORK = "stellar:testnet";
const FACILITATOR_URL = "https://www.x402.org/facilitator";
const PAY_TO = process.env.MI_PUBLICA; // tu cuenta de la sesión 1 recibe el pago
const TOPE = "0.02";
const PRUEBA = "af936bedf8aba96c4de5bc13a9ad9655fd9615d20019a9d8bda10aeaa8702ef4";

const app = express();

const PAGE = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Caja del agente</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #f3efe6; color: #1c1915; font-family: Georgia, "Iowan Old Style", serif; }
    main { width: min(420px, calc(100% - 32px)); background: #fffdf8; border: 1px solid #d8d0c4; padding: 28px 28px 24px; }
    .kicker { margin: 0 0 8px; font: 600 12px/1 "Segoe UI", sans-serif; letter-spacing: .14em; text-transform: uppercase; color: #6d645b; }
    h1 { margin: 0 0 18px; font-size: 32px; font-weight: 500; }
    .cobro { display: flex; justify-content: space-between; gap: 16px; border-top: 1px solid #e5ddd1; border-bottom: 1px solid #e5ddd1; padding: 16px 0; font: 16px/1.4 "Segoe UI", sans-serif; }
    .cobro b { font-size: 22px; }
    .acciones { display: grid; gap: 10px; margin-top: 22px; }
    button { height: 48px; border: 0; background: #1c1915; color: #fffdf8; font: 600 16px "Segoe UI", sans-serif; cursor: pointer; }
    button.secundario { background: transparent; color: #1c1915; border: 1px solid #1c1915; }
    button:disabled { cursor: wait; opacity: .6; }
    #resultado { min-height: 4.4em; margin: 16px 0 0; font: 16px/1.45 "Segoe UI", sans-serif; }
    .si { color: #0d6b3d; }
    .no { color: #8a2e1b; }
    .prueba { margin: 18px 0 0; font: 14px/1.4 "Segoe UI", sans-serif; }
    .prueba a { color: #1c1915; }
  </style>
</head>
<body>
  <main>
    <p class="kicker">Caja del agente</p>
    <h1>Alguien dice que ya pagó.</h1>
    <div class="cobro"><span>Cobro en Stellar testnet</span><b>$0.01</b></div>
    <div class="cobro"><span>Tope del agente</span><b>$0.02</b></div>
    <div class="acciones">
      <button id="confirmar" type="button">Confirmar 0.01</button>
      <button id="pasar" class="secundario" type="button">Probar un cobro de 0.05</button>
    </div>
    <p id="resultado">Confirmar revisa el tope y si el pago ya llegó.</p>
    <p class="prueba"><a href="https://stellar.expert/explorer/testnet/tx/${PRUEBA}">Ver el pago de prueba en Stellar Expert</a></p>
    <p class="prueba"><a href="/tienda">Abrir la tiendita: mover el cobro y el tope</a></p>
  </main>
  <script>
    const resultado = document.getElementById("resultado");
    const botones = [...document.querySelectorAll("button")];
    async function confirmar(precio) {
      botones.forEach((b) => (b.disabled = true));
      resultado.className = "";
      resultado.textContent = "Revisando el cobro…";
      try {
        const decision = await fetch("/decidir?precio=" + precio).then((r) => r.json());
        if (!decision.pagar) {
          resultado.className = "no";
          resultado.textContent = decision.respuesta;
          return;
        }
        const respuesta = await fetch("/dato", { headers: { Accept: "application/json" } });
        if (respuesta.status === 402) {
          resultado.className = "si";
          resultado.textContent = decision.respuesta + " Esta visita todavía no está pagada.";
        } else if (respuesta.ok) {
          resultado.className = "si";
          resultado.textContent = "Sí. El cobro está confirmado.";
        } else {
          resultado.className = "no";
          resultado.textContent = "No se pudo confirmar el cobro. Inténtalo otra vez.";
        }
      } catch {
        resultado.className = "no";
        resultado.textContent = "No se pudo confirmar el cobro. Inténtalo otra vez.";
      } finally {
        botones.forEach((b) => (b.disabled = false));
      }
    }
    document.getElementById("confirmar").addEventListener("click", () => confirmar("0.01"));
    document.getElementById("pasar").addEventListener("click", () => confirmar("0.05"));
  </script>
</body>
</html>`;

// El navegador ve la caja. Quien pide JSON sigue recibiendo la ficha del cobro.
app.get("/", (req, res) => {
  if ((req.get("accept") || "").includes("text/html")) {
    res.type("html").send(PAGE);
    return;
  }
  res.json({ route: ROUTE, price: PRICE, network: NETWORK });
});

// La demo pregunta el tope antes de mirar si el pago llegó. No firma nada.
app.get("/decidir", (req, res) => {
  const precio = String(req.query.precio || "0.01");
  res.json(decidirCobro({ precio, tope: TOPE, destino: PAY_TO, destinoEsperado: PAY_TO }));
});

// La tiendita deja mover el cobro y el tope. La caja fija de arriba no cambia.
app.get("/tienda", (_req, res) => {
  res.type("html").send(readFileSync(new URL("./mostrador.html", import.meta.url), "utf8"));
});

app.get("/tienda/estado", async (_req, res) => {
  try {
    res.json(await leerCarteras());
  } catch {
    res.status(500).json({ respuesta: "No se pudieron leer las carteras." });
  }
});

app.get("/tienda/decidir", (req, res) => {
  res.json(prepararMostrador({
    precio: String(req.query.precio || ""),
    tope: String(req.query.tope || ""),
    destino: PAY_TO,
    destinoEsperado: PAY_TO,
  }));
});

app.post("/tienda/cobrar", express.json({ limit: "2kb" }), async (req, res) => {
  res.json(await cobrar({ precio: req.body?.precio, tope: req.body?.tope }));
});

// x402: sin pago, la ruta responde 402 con las instrucciones para pagar.
app.use(
  paymentMiddlewareFromConfig(
    {
      [`GET ${ROUTE}`]: {
        accepts: { scheme: "exact", price: PRICE, network: NETWORK, payTo: PAY_TO },
      },
    },
    new HTTPFacilitatorClient({ url: FACILITATOR_URL }),
    [{ network: NETWORK, server: new ExactStellarScheme() }],
  ),
);

// Esto solo se entrega cuando el pago ya se verificó y se liquidó.
app.get(ROUTE, (_, res) =>
  res.json({ dato: "El código HTTP 402 significa Payment Required", pagado: true }),
);

app.listen(PORT, "0.0.0.0", () => console.log(`API lista en http://0.0.0.0:${PORT}${ROUTE}`));
