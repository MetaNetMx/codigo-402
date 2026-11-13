# Contexto — Sesión 2 · Cobrar API con x402

Bootcamp **Código 402** (mismo repo `codigo-402`). Prerrequisito: Sesión 1 (`.env`, cuentas, USDC, amigo con 1 USDC).

## Entregable 2 (checklist)

- [ ] `server.js` — ruta `/dato` con **x402** (0.01 USDC testnet → `MI_PUBLICA`)
- [ ] `cliente.js` — paga con `AMIGO_SECRETA`
- [ ] README — sección **Mi API cobra con x402** (hash + Stellar Expert)
- [ ] 3 commits: API gratis → 402 → cliente + hash

## Comandos clave

```bash
npm run api          # servidor en :3001
curl -i localhost:3001/dato   # sin pago → 402
npm run cliente      # amigo paga → 200
```

## Conceptos

| Término | Idea |
|---------|------|
| HTTP 402 | “Payment Required” |
| x402 | Estándar: 402 + instrucciones de pago en cabeceras |
| Facilitador | Verifica y liquida en Stellar (`x402.org/facilitator`) |
| `PAYMENT-REQUIRED` | Cabecera con monto, red, payTo |

## Archivos del repo

| Archivo | Rol |
|---------|------|
| `server.js` | Express + `@x402/express` |
| `cliente.js` | `@x402/fetch` + firma Stellar |
| `package.json` | scripts `api`, `cliente` |

## Local vs GitHub

- Video/transcripción S2: solo en `contexto/` local (ignorados por git).
- En GitHub: `contexto/RESUMEN-SESION-2.md` + esta guía si se sube.

## Sesión 3 (siguiente)

Agente que paga tu API con **tope de gasto**. Llegar con API funcionando.

**Guía:** `Código 402 · Sesión 2 · Guía para participantes (Codespaces).md` (raíz del proyecto local).
