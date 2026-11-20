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
- Resumen Sesión 3 (agente): `contexto/RESUMEN-SESION-3.md`
- Checklist Sesión 3: `contexto/CONTEXTO-SESION-3.md`
- Guía Sesión 4: `contexto/Codigo-402-Sesion-4-Guia.md`
- Duda técnica Stellar / x402: usar **Stellar Raven MCP** (`https://raven.stellar.org/mcp`) antes de inventar APIs.

## Estructura

| Archivo | Rol |
|---------|-----|
| `crear-cuentas.js` | Cuentas, Friendbot, trustline USDC |
| `conseguir-usdc.js` | 5 USDC testnet |
| `primer-pago.js` | Primer pago USDC + memo |
| `server.js` / `cliente.js` | API x402 y cliente manual |
| `crear-agente.js` / `agente.js` | Wallet del agente y cliente autónomo |
| `verificar.js` | Consulta un hash en la RPC y valida USDC, monto y destinatario |
| `README.md` | Hashes de pagos (Stellar Expert) |

## Sesiones

1. ✅ Cuentas y primer pago (este repo).
2. ✅ API con **x402** (`server.js`, `cliente.js`, hash en README).
3. ✅ Agente con wallet propia, tope y reintentos (`agente.js`, hash en README).
4. ✅ Verificador on-chain (`verificar.js`, pruebas, hash en README).

## Entorno local

- `node_modules` no va a git. En Windows + Google Drive, preferir **Codespaces** o clon en disco local para `npm install`.
