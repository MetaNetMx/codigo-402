# Resumen ejecutivo — Charla Sesión 2

**Fuente:** grabación *S2 - Código 402* (~1 h 5 min), carpeta BAF en Google Drive.  
**En GitHub:** solo este resumen. Video y transcripción completa quedan **en local** (no se suben por tamaño).

> En Cursor: `@AGENTS.md` + `@contexto/RESUMEN-SESION-2.md`

---

## Quién y de qué va

- Continuación del bootcamp **Código 402: Agentes que pagan** (BAF × Embajadores Stellar).
- Facilitación: **Fer** (logística, Apex/GitHub, asistencia), **Montse** y **Lío** (Nirium — pagos agénticos).
- Objetivo del día: pasar del pago manual (Sesión 1) a **cobrar por uso de una API** con **x402** en Stellar testnet.

---

## Mensajes clave (conceptos antes del código)

1. **HTTP 402 Payment Required** — reservado desde los años 90; casi no se usaba hasta **x402**.
2. **Flujo x402** — el cliente pide el recurso → la API responde **402** con instrucciones (`PAYMENT-REQUIRED`) → el cliente **firma y paga** → vuelve a pedir con el pago → la API entrega **200** y el dato.
3. **Facilitador** (`https://www.x402.org/facilitator`) — verifica y liquida el pago en Stellar; el desarrollador solo define ruta, precio y cuenta que cobra.
4. **Precio de la demo:** **0.01 USDC** en testnet; sin dinero real.
5. **Seguridad:** `.env` fuera de git; hoy también `api.log` en `.gitignore`.
6. **Llaves:** `MI_PUBLICA` recibe; `AMIGO_SECRETA` firma el pago del cliente de ejemplo (cuenta del “amigo” de la Sesión 1).

---

## Lo que se construyó en vivo (3 commits)

| Commit | Entregable |
|--------|------------|
| 1 | `server.js` — Express, ruta `/dato` **gratis** (HTTP 200), scripts `npm run api` / `npm run cliente` |
| 2 | `server.js` — middleware **x402**; `curl -i /dato` devuelve **402** |
| 3 | `cliente.js` — cliente oficial Stellar adaptado; pago real; hash en README |

**Librerías:** Express 5.3.0, `@x402/core`, `@x402/express`, `@x402/fetch`, `@x402/stellar` (v2.30.0).

---

## Entregable 2 (participante)

- API en puerto **3001**, ruta **`/dato`** que cobra con x402.
- Cliente que paga desde la cuenta del amigo (`AMIGO_SECRETA`).
- Sección **“Mi API cobra con x402”** en README con hash y enlace Stellar Expert.
- Tres commits visibles en GitHub → cuenta para **Apex**.

---

## Puente a Sesión 3

Llegar con la API de hoy funcionando: en la Sesión 3 un **agente** pagará la API automáticamente, con **tope de gasto**.

---

## Nota

Resumen derivado de transcripción automática (Whisper); para precisión técnica usar la guía de participantes, [developers.stellar.org](https://developers.stellar.org/docs/build/agentic-payments/x402) y **Stellar Raven MCP**.
