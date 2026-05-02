# Guía de Prueba Rápida - Dashboard de Auditoría de Transfusiones

## ✅ Lo que ya está configurado

✓ Variables de entorno en `.env.local`  
✓ Base de datos Supabase lista  
✓ 6 meses de datos KPI  
✓ 20 registros de auditoría de prueba  
✓ Usuario de prueba creado  
✓ Servidor de desarrollo corriendo  

## 🚀 Cómo Probar (3 Pasos)

### Paso 1: Inicia Sesión
1. Ve a `http://localhost:3000`
2. Se redirigirá automáticamente a `/auth/login`
3. Ingresa las credenciales de prueba:
   - **Email:** `auditor@hospital.test`
   - **Contraseña:** `testpassword123`
4. Haz clic en "Sign In"

### Paso 2: Explora el Dashboard
1. Deberías ver la página de inicio (`/dashboard`)
2. **Verifica que aparezcan:**
   - KPI Card con 145 transfusiones totales
   - Gráfico de barras con clasificación de apropiabilidad:
     - Adecuada (verde): 95
     - Inadecuada (roja): 32
     - Dudosa (amarilla): 18
   - Gráfico circular con distribución de componentes
   - Botones de navegación en la parte superior

### Paso 3: Prueba las Funciones
1. **Ver Auditorías:**
   - Haz clic en "View Audits" en la navegación
   - Deberías ver 20 registros de prueba
   - Prueba los filtros (Adecuada, Inadecuada, Dudosa)
   - Prueba la búsqueda con "PAC-" para encontrar pacientes

2. **Crear Nueva Auditoría:**
   - Haz clic en "New Audit"
   - Completa el formulario
   - El sistema clasificará automáticamente como Adecuada, Inadecuada o Dudosa
   - Haz clic en "Save Record"

3. **Configuración:**
   - Haz clic en "Settings" para ver tu perfil
   - Verifica que tu nombre y departamento aparezcan

## 📊 Datos Visibles en el Dashboard

| Métrica | Valor |
|---------|-------|
| Total de Transfusiones | 145 |
| Adecuadas (Verde) | 95 |
| Inadecuadas (Roja) | 32 |
| Dudosas (Amarilla) | 18 |
| RBC | 82 |
| Plasma | 38 |
| Plaquetas | 25 |

## 🎨 Sistema de Clasificación (Semáforo)

- **🟢 Adecuada (Verde):** Hemoglobina < 7 g/dL + indicación clara
- **🔴 Inadecuada (Roja):** Hemoglobina > 10 g/dL sin indicación
- **🟡 Dudosa (Amarilla):** Hemoglobina 7-10 g/dL, requiere evaluación

El sistema calcula automáticamente esta clasificación cuando creas un registro.

## 🔄 Flujos de Trabajo a Probar

### Flujo 1: Ver Datos Existentes
```
Home → Dashboard → Ve gráficos con datos agregados
```

### Flujo 2: Revisar Auditorías
```
Home → View Audits → Filtra por Adecuada/Inadecuada/Dudosa → Busca pacientes
```

### Flujo 3: Crear Nuevo Registro
```
Home → New Audit → Completa formulario → Sistema clasifica automáticamente → Save
```

### Flujo 4: Exportar Datos
```
View Audits → Haz clic en "Export to CSV" → Descarga archivo
```

## 🐛 Si Algo No Funciona

1. **No veo datos en el dashboard:**
   - Verifica que estés autenticado (deberías ver tu nombre arriba)
   - Recarga la página (F5)
   - Abre la consola (F12) para ver errores

2. **Error de autenticación:**
   - Verifica el email: `auditor@hospital.test`
   - Verifica la contraseña: `testpassword123`
   - Si falla, contacta al administrador

3. **El servidor no responde:**
   - Verifica que el servidor esté corriendo: `pnpm dev`
   - Comprueba que estés en `http://localhost:3000`

## 📝 Notas

- Todos los datos de prueba están en la base de datos Supabase
- Cada usuario solo ve sus propios registros (RLS habilitado)
- Los registros que crees aparecerán en "View Audits"
- Puedes eliminar registros desde la lista (cuidado: no se puede deshacer)

## ✨ Características Implementadas

✓ Autenticación con Supabase  
✓ Dashboard con KPIs y gráficos  
✓ Formulario de auditoría con validación  
✓ Clasificación automática de semáforo  
✓ Filtrado y búsqueda de registros  
✓ Exportación a CSV  
✓ Perfil de usuario  
✓ Diseño responsive  
✓ Seguridad RLS  

---

**¡Listo para probar!** Accede a `http://localhost:3000` y comienza a explorar.
