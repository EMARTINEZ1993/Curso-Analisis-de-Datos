// Course data – all content separated from UI
// Sections: type = 'theory' | 'exercise' | 'quiz'
// Content blocks: type = 'text' | 'info' | 'code' | 'runnable' | 'chartGallery' | 'chartDemo' | 'list'

export const MODULES = [

/* ══════════════════════════════════════════════════════
   MÓDULO 1 – FUNDAMENTOS
══════════════════════════════════════════════════════ */
{
  id:1, emoji:'📘', colorKey:'purple',
  title:'Fundamentos del Análisis de Datos',
  subtitle:'Conceptos esenciales, librerías y herramientas',
  duration:'30 min', xp:100, lessons:3,
  sections:[
    {
      type:'theory', title:'¿Qué es el Análisis de Datos?',
      content:[
        {type:'text', text:'El **análisis de datos** es el proceso de inspeccionar, limpiar, transformar y modelar datos con el objetivo de descubrir información útil, sacar conclusiones y apoyar la toma de decisiones.'},
        {type:'info', title:'🎯 ¿Para qué sirve?', text:'Tomar decisiones basadas en evidencia • Descubrir patrones ocultos • Predecir comportamientos futuros • Optimizar procesos y recursos'},
        {type:'text', text:'**Conceptos clave:**'},
        {type:'list', items:[
          '**Dato**: Valor individual sin contexto (ej: 25, "Colombia", true)',
          '**Variable**: Característica que se mide (ej: edad, país, activo)',
          '**Dataset**: Colección organizada de datos en filas y columnas',
          '**Tipos de datos**: Numérico, Texto, Booleano, Fecha',
        ]},
      ],
    },

    {
      type:'exercise', title:'🖥️ Ejercicio: Tu primer script',
      instruction:'Crea una lista de 5 países latinoamericanos, imprime cuántos hay con len() y el primero con índice [0].',
      hints:[
        'Usa len(paises)',
        'El primer elemento se accede con [0]'
      ],
      defaultCode:`# Lista de países
paises = ["Colombia","México","Argentina","Chile","Perú"]

print(len(paises))
print(paises[0])`,
      validate:(code)=>{
        const ok = code.includes('len(paises)') && code.includes('paises[0]')
        return ok
          ? { ok:true, msg:`Output:
Número de países: 5
Primer país: Colombia` }
          : { ok:false, msg:'❌ Usa len(paises) y paises[0]' }
      }
    },

    {
      type:'quiz', title:'🧠 Quiz – Módulo 1',
      questions:[
        {q:'¿Qué librería se usa para manipulación de datos?', options:['NumPy','Pandas','Matplotlib'], correct:1},
        {q:'¿Qué es un dataset?', options:['Variable','Lenguaje','Colección de datos'], correct:2},
      ],
    },
  ],
},

/* ══════════════════════════════════════════════════════
   MÓDULO 2 – EDA
══════════════════════════════════════════════════════ */
{
  id:2, emoji:'📗', colorKey:'teal',
  title:'EDA – Análisis Exploratorio',
  subtitle:'Explorar y entender datos',
  duration:'45 min', xp:150, lessons:5,
  sections:[
    {
      type:'exercise', title:'🖥️ Ejercicio 1: Exploración básica',
      instruction:'Usa head(), isnull().sum() y value_counts().',
      defaultCode:`print(df.head(3))
print(df.isnull().sum())
print(df['carrera'].value_counts())`,
      validate:(code)=>{
        const ok =
          code.includes('head(3)') &&
          code.includes('isnull()') &&
          code.includes('value_counts()')

        return ok
          ? {
              ok:true,
              msg:`✅ Output:
=== PRIMEROS 3 ===
  nombre  edad   carrera  promedio
0    Ana  20.0  Sistemas       4.2
1   Luis  22.0  Economía       3.8
2  María  21.0  Sistemas       4.5

=== VALORES NULOS ===
edad    1

=== FRECUENCIA CARRERA ===
Sistemas    2
Economía    2
Derecho     1`
            }
          : { ok:false, msg:'❌ Revisa head(), isnull() y value_counts()' }
      }
    },

    {
      type:'quiz', title:'🧠 Quiz – Módulo 2',
      questions:[
        {q:'¿Qué función muestra tipos y nulos?', options:['describe()','info()'], correct:1},
        {q:'¿Qué retorna value_counts()?', options:['Únicos','Frecuencias'], correct:1},
      ],
    },
  ],
},

/* ══════════════════════════════════════════════════════
   MÓDULO 3 – ETL
══════════════════════════════════════════════════════ */
{
  id:3, emoji:'📙', colorKey:'yellow',
  title:'ETL – Limpieza y Transformación',
  subtitle:'Preparar datos',
  duration:'40 min', xp:150, lessons:4,
  sections:[
    {
      type:'exercise', title:'🖥️ Ejercicio: Limpieza',
      instruction:'fillna con mediana, drop_duplicates, exportar CSV',
      defaultCode:`df['edad']=df['edad'].fillna(df['edad'].median())
df.drop_duplicates(inplace=True)
df.to_csv('datos.csv',index=False)`,
      validate:(code)=>{
        const ok =
          code.includes('median()') &&
          code.includes('drop_duplicates') &&
          code.includes('index=False')

        return ok
          ? {
              ok:true,
              msg:`✅ Output:
Datos limpios
Filas finales: 4`
            }
          : { ok:false, msg:'❌ Revisa median(), drop_duplicates e index=False' }
      }
    },
  ],
},

/* ══════════════════════════════════════════════════════
   MÓDULO 4 – VISUALIZACIÓN
══════════════════════════════════════════════════════ */
{
  id:4, emoji:'📕', colorKey:'orange',
  title:'Visualización de Datos',
  subtitle:'Gráficos con Python',
  duration:'45 min', xp:200, lessons:5,
  sections:[
    {
      type:'exercise', title:'🖥️ Gráfico de barras',
      instruction:'Usa plt.bar(), título y ylabel',
      defaultCode:`plt.bar(x,y)
plt.title('Ventas')
plt.ylabel('Total')`,
      validate:(code)=>{
        const ok =
          code.includes('plt.bar') &&
          code.includes('plt.title') &&
          code.includes('plt.ylabel')

        return ok
          ? { ok:true, msg:'✅ Gráfico correcto' }
          : { ok:false, msg:'❌ Falta bar, title o ylabel' }
      }
    },
  ],
}

]