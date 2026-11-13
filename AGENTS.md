# Agente — Código 402 (Stellar testnet)

Bootcamp **Código 402: Agentes que pagan** (BAF × Embajadores Stellar). Este repo es el portafolio por sesión.

## Reglas

- Red: **Stellar testnet** solo (sin mainnet ni dinero real).
- **Nunca** commitear `.env` ni pegar `MI_SECRETA` / `AMIGO_SECRETA` en respuestas.
- Comandos: `npm run cuentas` → `npm run usdc` → `npm run pagar` (requieren `.env` local).

## Contexto del taller

- Resumen Sesión 1: `contexto/RESUMEN-CHARLA.md` (o `RESUMEN-SESION-1` en local)
- Resumen Sesión 2 (x402): `contexto/RESUMEN-SESION-2.md`
- Checklist Sesión 2: `contexto/CONTEXTO-SESION-2.md`
- Duda técnica Stellar / x402: usar **Stellar Raven MCP** (`https://raven.stellar.org/mcp`) antes de inventar APIs.

## Estructura

| Archivo | Rol |
|---------|-----|
| `crear-cuentas.js` | Cuentas, Friendbot, trustline USDC |
| `conseguir-usdc.js` | 5 USDC testnet |
| `primer-pago.js` | Primer pago USDC + memo |
| `README.md` | Hash del primer pago (Stellar Expert) |

## Sesiones

1. ✅ Cuentas y primer pago (este repo).
2. ✅ API con **x402** (`server.js`, `cliente.js`, hash en README).
3. ⏳ Sesión 3: agente con tope de gasto.

## Entorno local

- `node_modules` no va a git. En Windows + Google Drive, preferir **Codespaces** o clon en disco local para `npm install`.
