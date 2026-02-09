# Configuración de Supabase para Recuperación de Contraseña

## 📧 Configuración de Email Templates

Para que la recuperación de contraseña funcione correctamente, necesitas configurar las plantillas de email en Supabase Dashboard.

### 1. Acceder a Supabase Dashboard

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto: **vivero-balam**
3. Ve a **Authentication** > **Email Templates**

### 2. Configurar URL de Redirección

En **Authentication** > **URL Configuration**:

#### Site URL
```
http://localhost:3001
```
(En producción: tu dominio real, ej: `https://viverobalam.com`)

#### Redirect URLs
Añadir las siguientes URLs (una por línea):
```
http://localhost:3001/reset-password
http://localhost:3001/**
```

En producción también agregar:
```
https://tudominio.com/reset-password
https://tudominio.com/**
```

### 3. Personalizar Plantilla de Recuperación de Contraseña

En **Email Templates** > **Reset Password**:

```html
<h2>Restablecer tu contraseña</h2>

<p>Hola,</p>

<p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>Vivero Balam</strong>.</p>

<p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>

<p><a href="{{ .ConfirmationURL }}">Restablecer Contraseña</a></p>

<p>Este enlace expirará en 60 minutos.</p>

<p>Si no solicitaste este cambio, puedes ignorar este email de forma segura.</p>

<hr>
<p style="color: #666; font-size: 12px;">Este es un email automatizado de Vivero Balam - Artesanías y novedades en el mejor lugar.</p>
```

### 4. Personalizar Plantilla de Confirmación de Email

En **Email Templates** > **Confirm Signup**:

```html
<h2>Confirma tu cuenta</h2>

<p>¡Bienvenido a Vivero Balam!</p>

<p>Para completar tu registro y comenzar a disfrutar de nuestras plantas y artesanías, por favor confirma tu email haciendo clic en el siguiente enlace:</p>

<p><a href="{{ .ConfirmationURL }}">Confirmar Email</a></p>

<p>Este enlace expirará en 24 horas.</p>

<p>¡Gracias por unirte a nuestra comunidad!</p>

<hr>
<p style="color: #666; font-size: 12px;">Este es un email automatizado de Vivero Balam - Artesanías y novedades en el mejor lugar.</p>
```

### 5. Configurar Email Sender (Opcional)

Por defecto, Supabase usa un servidor SMTP genérico. Para producción, configura tu propio SMTP:

1. Ve a **Project Settings** > **Auth**
2. En **SMTP Settings**, configura:
   - **SMTP Host**: tu servidor SMTP (ej: smtp.gmail.com)
   - **SMTP Port**: 587 (TLS) o 465 (SSL)
   - **Sender Email**: noreply@tudominio.com
   - **Sender Name**: Vivero Balam
   - **SMTP User**: tu usuario SMTP
   - **SMTP Password**: tu contraseña SMTP

## 🔒 Configuración de Seguridad

### Rate Limiting

Supabase ya tiene rate limiting integrado:
- **Recuperación de contraseña**: 1 email cada 60 segundos por email
- **Confirmación de registro**: 1 email cada 60 segundos por email

### Expiración de Tokens

Los tokens expiran automáticamente:
- **Reset password token**: 60 minutos
- **Confirmation token**: 24 horas

## 🧪 Pruebas

### Probar Recuperación de Contraseña

1. En tu app local (`http://localhost:3001`):
   - Click en "Iniciar sesión"
   - Click en "¿Olvidaste tu contraseña?"
   - Ingresa un email registrado
   - Click en "Enviar email de recuperación"

2. Revisa tu email (puede tardar 1-2 minutos)

3. Click en el enlace del email

4. Ingresa tu nueva contraseña

5. Confirma que puedes iniciar sesión con la nueva contraseña

### Probar Confirmación de Email

1. Registra una cuenta nueva

2. Revisa tu email de confirmación

3. Click en el enlace de confirmación

4. Intenta iniciar sesión

## ⚠️ Troubleshooting

### No recibo emails

1. **Revisa spam/junk**: Los emails de Supabase pueden caer en spam
2. **Verifica rate limiting**: Espera 60 segundos entre intentos
3. **Revisa logs**: En Supabase Dashboard > **Logs** > **Auth**

### "Link expirado"

Los enlaces tienen tiempo de expiración:
- Si pasaron más de 60 minutos (reset password), solicita uno nuevo
- Si pasaron más de 24 horas (confirmación), solicita re-envío

### Redirect no funciona

1. Verifica que las URLs en **URL Configuration** estén correctas
2. Asegúrate de incluir el wildcard `**` en las redirect URLs
3. En producción, usa HTTPS

## 📱 Producción

Cuando despliegues a producción:

1. Actualiza **Site URL** a tu dominio real
2. Actualiza **Redirect URLs** con tu dominio HTTPS
3. Configura SMTP custom (recomendado)
4. Personaliza las plantillas de email con tu branding
5. Habilita **Email Throttling** si esperas alto volumen

## 🎨 Personalización Avanzada

Puedes personalizar más las plantillas usando variables:

```html
{{ .Email }}          - Email del usuario
{{ .Token }}          - Token de confirmación
{{ .TokenHash }}      - Hash del token
{{ .SiteURL }}        - URL de tu sitio
{{ .ConfirmationURL }} - URL completa de confirmación
{{ .Data }}           - Metadata del usuario (ej: {{ .Data.name }})
```

Ejemplo con nombre del usuario:

```html
<p>Hola {{ .Data.name }},</p>
```

---

**Última actualización**: 2026-01-29  
**Proyecto**: Vivero Balam  
**Versión**: 1.0
