# Contexto para hackathon — Sesión 3 · Agente con tope

> Documento de trabajo local. Combina la guía oficial, el estado del repo y la grabación de la charla.

## 1. Prerrequisitos (Sesión 2)

- Repo `codigo-402` con `server.js` (x402 en `/dato`, 0.01 USDC), `cliente.js`, `.env` con `MI_*` y `AMIGO_*`.
- API en puerto **3001** (`npm run api`).
- Entorno: clon en `C:\Users\Administrator\codigo-402` (evitar `npm install` en Google Drive).

Guía oficial local: `Código 402 · Sesión 3 · Guía para participantes (Codespaces).md`

---

## 2. Checklist técnico (Entregable 3)

### Scripts

```bash
npm pkg set "scripts.agente-wallet=node --env-file=.env crear-agente.js"
npm pkg set "scripts.agente=node --env-file=.env agente.js"
npm run agente-wallet   # una vez, si no hay AGENTE_* en .env
```

### `crear-agente.js`

- Si ya existe `AGENTE_SECRETA` → sale sin hacer nada.
- Friendbot + trustline USDC + pago **0.05 USDC** desde `MI_SECRETA`.
- Append `AGENTE_PUBLICA` / `AGENTE_SECRETA` a `.env` (nunca en git).

### `agente.js` (evolución)

| Fase | Comportamiento |
|------|----------------|
| Commit 1 | `wrapFetchWithPayment` + wallet `AGENTE_SECRETA` |
| Commit 2 | `TOPE` (default `$0.02`), `spendControls.maxAmountPerPayment` |
| Commit 3 | Reintentos (3) si API caída, lee precio/saldo antes de pagar, mensajes si falla el pago |

### Pruebas

```powershell
# API en background (Windows)
Get-CimInstance Win32_Process -Filter "name = 'node.exe'" |
  Where-Object { $_.CommandLine -match 'server\.js' } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
Start-Process -WindowStyle Hidden node -ArgumentList "--env-file=.env","server.js" -WorkingDirectory (Get-Location)

# Tope bajo → rechazo
$env:TOPE='$0.005'; npm run agente

# Tope normal → pago
$env:TOPE='$0.02'; npm run agente
```

### README

Sección **Mi agente paga solo** con tope, hash del pago del agente y enlace Stellar Expert testnet.

### Commits esperados (mensajes de la guía)

1. `feat: agente que paga la API de la sesión 2`
2. `feat: tope por pago que rechaza el pago que lo excede`
3. `fix: manejo de errores y reintentos, sin pagar a ciegas`

**Estado en este repo (MetaNetMx/codigo-402):** implementado en `main`; hash en `README.md`.

---

## 3. Conceptos (charla)

| Término | Idea |
|---------|------|
| **Agente** | Programa que decide pagar sin aprobación humana por transacción |
| **Tope** | Límite por llamada vía x402 `spendControls` |
| **Firmar** | Sin llave secreta no hay transacción |
| **Reintento** | Solo ante fallo de red/API, no tras enviar un pago |

---

## 4. Fuentes locales

- Video: `contexto/S3-Codigo-402.mp4`
- Transcripción: `transcripcion-sesion-3-completa.md` (gitignored)
- Resumen: `RESUMEN-SESION-3.md`
- Metadatos: `fuentes.md`