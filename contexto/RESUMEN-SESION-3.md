# Resumen ejecutivo — Charla Sesión 3

**Fuente:** grabación *S3 - Código 402* (~1 h 16 min), carpeta BAF en Google Drive.  
**En GitHub:** este resumen y checklist. Video y transcripción completa quedan **en local**.

> En Cursor: `@AGENTS.md` + `@contexto/RESUMEN-SESION-3.md`

---

## Quién y de qué va

- Tercera sesión del bootcamp **Código 402: Agentes que pagan** (BAF × Embajadores Stellar).
- Objetivo: un **agente autónomo** con **wallet propia** que paga la API x402 de la Sesión 2, con **tope por pago** y **reintentos** sin pagar a ciegas.

---

## Mensajes clave

1. **Wallet del agente** — cuenta Stellar separada (`AGENTE_*` en `.env`), presupuesto acotado (0.05 USDC testnet).
2. **`wrapFetchWithPayment`** — una llamada reemplaza el flujo manual del `cliente.js`.
3. **`spendControls.maxAmountPerPayment`** — el tope lo decide el agente; si la API cobra más, **no se firma** ni hay transacción.
4. **Antes de pagar** — leer precio (402), revisar saldo; reintentos solo cuando la API no responde (no después de un pago enviado).
5. **Entregable Apex** — tres commits visibles + hash del pago del agente en README.

---

## Lo que se construyó (3 commits)

| Commit | Entregable |
|--------|------------|
| 1 | `crear-agente.js`, `agente.js` básico, scripts `npm run agente-wallet` / `npm run agente` |
| 2 | Tope con `TOPE` y rechazo si la API pide más |
| 3 | Reintentos, chequeo de saldo, mensajes de error; README **Mi agente paga solo** |

---

## Entregable 3 (participante)

- Agente que paga 0.01 USDC a `GET /dato` hasta su tope ($0.02 por defecto).
- Prueba: `TOPE='$0.005' npm run agente` → rechazo sin transacción.
- Hash de un pago del agente en README (Stellar Expert testnet).

---

## Puente a Sesión 4

Verificador on-chain: con un hash, validar contrato USDC, monto y destinatario. Llegar con el agente funcionando.