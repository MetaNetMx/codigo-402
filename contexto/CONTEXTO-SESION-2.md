# Contexto para hackathon — Sesión 2 · API con x402

> Documento de trabajo local. Combina la guía oficial, el estado del repo y la grabación de la charla.

## 1. Prerrequisitos (Sesión 1)

- Repo `codigo-402` con `.env` (`MI_PUBLICA`, `MI_SECRETA`, `AMIGO_PUBLICA`, `AMIGO_SECRETA`).
- Amigo con **≥ 1 USDC** testnet (`npm run pagar` si falta saldo).
- Codespace o copia local en `C:\Users\Administrator\codigo-402` (evitar `npm install` en Google Drive).

Guía oficial local: `Código 402 · Sesión 2 · Guía para participantes (Codespaces).md`

---

## 2. Checklist técnico (Entregable 2)

### Dependencias y scripts

```bash
npm install express@5.3.0 @x402/core@2.30.0 @x402/express@2.30.0 @x402/fetch@2.30.0 @x402/stellar@2.30.0
# scripts en package.json:
#   npm run api     → node --env-file=.env server.js
#   npm run cliente → node --env-file=.env cliente.js
```

### `server.js` (resumen)

| Fase | Comportamiento |
|------|----------------|
| Commit 1 | `GET /dato` → JSON con `gratis: true`, HTTP **200** |
| Commit 2+ | Middleware x402: sin pago → **402** + `PAYMENT-REQUIRED`; con pago verificado → **200**, `pagado: true` |

Constantes típicas del taller:

- `PRICE = "$0.01"` · `NETWORK = "stellar:testnet"`
- `FACILITATOR_URL = "https://www.x402.org/facilitator"`
- `PAY_TO = process.env.MI_PUBLICA`

### `cliente.js` (resumen)

1. `fetch(/dato)` → recibe **402**.
2. Lee instrucciones, firma pago con `AMIGO_SECRETA` (ExactStellarScheme).
3. Segunda petición con cabeceras de pago → **200** y dato.
4. Opcional: ajuste de fee Soroban (1 stroop) como en el quickstart.

### README

Sección **Mi API cobra con x402** con hash de la transacción de 0.01 USDC y link Stellar Expert testnet.

### Commits esperados (mensajes de la guía)

1. `feat: API en Express con la ruta todavía gratis`
2. `feat: ruta protegida; curl -i devuelve 402`
3. `test: pago con el cliente de ejemplo, con el hash en el README`

**Estado en este repo (MetaNetMx/codigo-402):** los tres commits ya están en `main`; hash de ejemplo en `README.md`.

---

## 3. Comandos en terminal

```bash
# Terminal 1 — API
pkill -f "server.js" || true
npm run api > api.log 2>&1 &

# Probar sin pagar (debe ser 402 tras commit 2)
curl -i http://localhost:3001/dato

# Terminal 2 — cliente (API prendida)
npm run cliente
```

---

## 4. Conceptos (charla)

| Término | Idea |
|---------|------|
| **HTTP 402** | “Payment Required”; la API no entrega el recurso hasta cobrar. |
| **x402** | Estándar que estandariza el 402: precio, red, destino y firma del pago. |
| **Facilitador** | Servicio que valida y liquida en Stellar; no sustituye tu lógica de negocio. |
| **Puerto 3001** | Solo existe `/dato`; `/` puede mostrar metadatos de precio (según versión del `server.js`). |

---

## 5. Grabación y transcripción (local)

| Item | Ruta |
|------|------|
| Video | `G:\Mi unidad\Stellar codigo-402\contexto\S2-Codigo-402.mp4` |
| Copia de trabajo | `C:\Users\Administrator\codigo-402\contexto\S2-Codigo-402.mp4` |
| Audio 16 kHz | `C:\Users\Administrator\codigo-402\contexto\audio-16k-s2.wav` |
| Transcripción | `contexto/transcripcion-sesion-2-completa.md` |
| Segmentos JSON | `contexto/transcript-segments-s2.json` |

**Drive:** archivo `S2 - Código 402.mp4` · ID `1Hy6LzeduUdWE3IMt5pGfkHrodx5iHsvm`

---

## 6. Puente a Sesión 3

API x402 operativa → agente autónomo con **límite de gasto** (martes siguiente en el calendario del bootcamp).

Referencias:

- x402 Stellar: https://github.com/stellar/x402-stellar
- Docs: https://developers.stellar.org/docs/build/agentic-payments/x402
- Raven MCP: https://raven.stellar.org/mcp

---

## 7. Troubleshooting (de la guía)

| Síntoma | Acción |
|---------|--------|
| `curl: (7) Failed to connect` | Reiniciar API (`npm run api`). |
| `EADDRINUSE` | `pkill -f "server.js"` y volver a prender. |
| `curl` devuelve 200 en bloque 6 | API vieja en memoria; matar proceso y reiniciar. |
| `MI_PUBLICA` / `AMIGO_SECRETA` undefined | Completar Sesión 1 / `.env`. |
| Client failed — saldo | `npm run pagar` y repetir cliente. |
