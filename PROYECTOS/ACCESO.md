# 🩸 Dashboard de Auditoría de Transfusiones - Acceso

## ✅ Aplicación Funcionando

La aplicación está corriendo correctamente en: `http://localhost:3000`

### 📄 Páginas Disponibles

1. **Página de Login** - `http://localhost:3000/auth/login`
   - Email: `auditor@hospital.test`
   - Contraseña: `testpassword123`

2. **Dashboard** - `http://localhost:3000/dashboard` (requiere login)
   - Métricas de KPI de los últimos 6 meses
   - 145 transfusiones totales
   - Gráficos interactivos

3. **Auditorías** - `http://localhost:3000/audits` (requiere login)
   - 20 registros de prueba
   - Clasificación: Adecuada, Inadecuada, Dudosa
   - Filtros y búsqueda

4. **Crear Auditoría** - `http://localhost:3000/audit` (requiere login)
   - Formulario completo
   - Validación automática
   - Clasificación de semáforo automática

5. **Configuración** - `http://localhost:3000/settings` (requiere login)
   - Información del perfil

## 🔐 Proceso de Login

1. Ve a `http://localhost:3000/auth/login`
2. Ingresa:
   - **Email**: `auditor@hospital.test`
   - **Contraseña**: `testpassword123`
3. Serás redirigido al dashboard

## 📊 Datos de Prueba Disponibles

### KPI Metrics (últimos 6 meses)
- **Noviembre 2024**: 145 transfusiones (95 adecuadas, 32 inadecuadas, 18 dudosas)
- **Octubre 2024**: 128 transfusiones
- **Septiembre 2024**: 156 transfusiones
- **Agosto 2024**: 142 transfusiones
- **Julio 2024**: 151 transfusiones
- **Junio 2024**: 138 transfusiones

### Registros de Auditoría
- 20 registros de prueba con variedad de clasificaciones
- Datos realistas de pacientes, edades, géneros
- Componentes sanguíneos variados (RBC, FFP, Plaquetas)
- Factores de riesgo y eventos adversos

## 🎨 Diseño de Semáforo

### 🟢 Adecuada (Verde)
- Hemoglobina < 7 g/dL
- Indicación clínica clara
- Transfusión justificada

### 🔴 Inadecuada (Roja)
- Hemoglobina > 10 g/dL
- Sin indicación clara
- Transfusión no justificada

### 🟡 Dudosa (Amarilla)
- Hemoglobina 7-10 g/dL
- Requiere evaluación clínica
- Zona de incertidumbre

## 🚀 Características Implementadas

✅ Autenticación con Supabase
✅ Dashboard con KPI metrics
✅ Formulario de auditoría con validación
✅ Clasificación automática de transfusiones
✅ Lista de auditorías con filtros
✅ Exportación a CSV
✅ Row Level Security (RLS)
✅ Navegación responsiva
✅ Diseño healthcare-focused

## 🔧 Variables de Entorno

Las siguientes variables están configuradas en `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📱 Responsive Design

La aplicación está completamente optimizada para:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (< 768px)

¡La aplicación está lista para usar! 🎉
