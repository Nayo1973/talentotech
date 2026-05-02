# Transfusion Appropriateness Audit Dashboard - Setup Guide

## 🎯 Descripción General

Dashboard completo para auditoría de transfusiones con sistema de clasificación de semáforo (Adecuada/Inadecuada/Dudosa) para Hospital Universitario Susana López de Valencia.

## 🚀 Inicio Rápido

### 1. Variables de Entorno
El proyecto está configurado con variables de entorno. Ya están incluidas en `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` - Tu URL de Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Tu clave anónima de Supabase

Estas variables ya han sido configuradas en el archivo `.env.local`.

### 2. Acceso a la Aplicación
- **URL Raíz:** Accede a `http://localhost:3000`
- **Redirección Automática:** Si no estás autenticado, serás redirigido a la página de login

### 3. Credenciales de Prueba
La aplicación tiene datos de prueba preconfigurados:
- **Email:** `auditor@hospital.test`
- **Contraseña:** `testpassword123`

## 📊 Funciones Principales

### Dashboard (KPIs)
- Vista general de transfusiones
- Gráficos de distribución de componentes (RBC, FFP, Platelets)
- Tasas de apropiabilidad
- Datos agregados por mes

**Datos de Prueba Incluidos:**
- 145 transfusiones registradas (mes más reciente)
- 95 apropiadas (Adecuada - Verde)
- 32 inapropiadas (Inadecuada - Roja)
- 18 dudosas (Dudosa - Amarilla)

### Auditoría de Transfusiones
- Formulario completo con validación
- Clasificación automática de semáforo:
  - **Adecuada (Verde):** Hb < 7 g/dL, indicaciones claras
  - **Inadecuada (Roja):** Hb > 10 g/dL, sin indicación médica
  - **Dudosa (Amarilla):** Hb 7-10 g/dL, requiere evaluación clínica
- Registro de factores de riesgo
- Documentación de eventos adversos

### Lista de Auditorías
- Visualización de todos los registros
- Filtros por clasificación de apropiabilidad
- Búsqueda por ID de paciente e indicación clínica
- Exportación a CSV para reportes
- Eliminación de registros

### Configuración de Usuario
- Perfil del auditor
- Información de departamento
- Gestión de rol

## 🗄️ Base de Datos

### Tablas Creadas Automáticamente
1. **audit_records** - Registros individuales de transfusión
2. **kpi_data** - Datos agregados mensuales
3. **user_profiles** - Información del usuario

### Datos de Prueba
Se han insertado automáticamente:
- 6 meses de datos KPI
- 20 registros de auditoría con clasificaciones variadas

## 🔐 Seguridad

- **RLS (Row Level Security):** Activado en todas las tablas
- **Autenticación:** Supabase Auth con email/contraseña
- **Privacidad de Datos:** Cada usuario solo ve sus propios registros
- **Cumplimiento:** Compatible con Ley 1581 de Colombia (HIPAA colombiano)

## 📱 Navegación

```
/                    → Redirección a dashboard o login
/auth/login         → Página de inicio de sesión
/auth/sign-up       → Creación de cuenta
/dashboard          → KPI principal
/audit              → Crear nueva auditoría
/audits             → Ver todos los registros
/settings           → Configuración de usuario
/setup              → Configuración de variables de entorno
```

## 🧪 Probando la Aplicación

### 1. Inicia Sesión
```
Email: auditor@hospital.test
Contraseña: testpassword123
```

### 2. Visualiza el Dashboard
- Verás gráficos con los datos de prueba
- Métricas de transfusiones
- Distribución por componentes

### 3. Crea un Nuevo Registro
- Ve a "New Audit"
- Completa el formulario
- El sistema calcula automáticamente la clasificación de semáforo

### 4. Consulta Auditorías
- Ve a "View Audits"
- Usa filtros para clasificación
- Exporta datos a CSV

## 🛠️ Desarrollo

### Requisitos
- Node.js 18+
- pnpm (o npm/yarn)

### Instalar Dependencias
```bash
pnpm install
```

### Iniciar Servidor de Desarrollo
```bash
pnpm dev
```

### Acceder
```
http://localhost:3000
```

## 📦 Tecnologías

- **Frontend:** Next.js 16, React 19, TypeScript
- **Base de Datos:** Supabase (PostgreSQL)
- **Autenticación:** Supabase Auth
- **UI Components:** Shadcn/ui
- **Gráficos:** Recharts
- **Formularios:** React Hook Form + Zod
- **Estilos:** Tailwind CSS v4

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
→ Las variables ya están en `.env.local`. Reinicia el servidor con `pnpm dev`

### No aparecen datos en el dashboard
→ Los datos de prueba se insertaron correctamente. Verifica que estés autenticado y que la página se haya cargado completamente.

### Errores de autenticación
→ Verifica las credenciales de prueba. Si aún hay problemas, contacta al administrador.

## 📞 Soporte

Para reportar problemas o sugerencias:
1. Revisa los logs de la consola (F12)
2. Verifica la conexión a Supabase
3. Contacta al equipo de desarrollo

---

**Versión:** 1.0  
**Última actualización:** 30/04/2026  
**Hospital:** Hospital Universitario Susana López de Valencia
