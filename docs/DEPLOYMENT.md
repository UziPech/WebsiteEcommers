# 🚀 Despliegue Automatizado a Vercel

Este proyecto está configurado para despliegues automatizados a Vercel.

## 📋 Requisitos Previos

1. **API Token de Vercel**: Ya configurado en `.env.local`
2. **Vercel CLI**: Se instalará automáticamente si no está presente

## 🎯 Comandos de Despliegue

### Despliegue a Producción
```bash
npm run deploy
```

### Despliegue a Preview (Staging)
```bash
npm run deploy:preview
```

### Manual con Vercel CLI
```bash
# Instalar Vercel CLI globalmente
npm i -g vercel

# Desplegar a producción
vercel --prod --token $VERCEL_TOKEN --yes

# Desplegar a preview
vercel --token $VERCEL_TOKEN --yes
```

## ⚙️ Configuración de Variables de Entorno en Vercel

Debes configurar estas variables en el dashboard de Vercel:

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Settings → Environment Variables
3. Agrega las siguientes variables:

| Variable | Valor | Entornos |
|----------|-------|----------|
| `VITE_SUPABASE_URL` | `https://aywbdisrrwscciazugun.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_dJWmjV4FCw9oTSC4RTeGxA_M9mqnB_Z` | Production, Preview, Development |

## 📁 Archivos de Configuración

- **`vercel.json`**: Configuración principal de Vercel
- **`scripts/deploy-vercel.sh`**: Script de despliegue automatizado
- **`.env.local`**: Variables de entorno locales (NO se sube a Git)

## 🔐 Seguridad

- ✅ Tu API Key de Vercel está guardada en `.env.local` (ignorado por Git)
- ✅ Nunca compartas tu `VERCEL_TOKEN` públicamente
- ✅ Las variables sensibles deben configurarse en el dashboard de Vercel

## 🐛 Troubleshooting

### Error: VERCEL_TOKEN not found
```bash
# Verifica que existe en .env.local
cat .env.local | grep VERCEL_TOKEN

# O exporta manualmente
export VERCEL_TOKEN=tu_token_aqui
```

### Error: command not found: vercel
```bash
# Instala Vercel CLI globalmente
npm i -g vercel
```

### Build fails en Vercel
1. Revisa los logs en el dashboard de Vercel
2. Verifica que todas las dependencias estén en `package.json`
3. Asegúrate de que `npm run build` funciona localmente

## 🎊 ¿Listo para desplegar?

```bash
npm run deploy
```

¡Y listo! Tu aplicación estará en vivo en minutos. 🚀
