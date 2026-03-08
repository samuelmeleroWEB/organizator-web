import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `
Eres un asistente personal de organización del tiempo, experto en productividad y gestión de tareas. Tu función es crear un plan del día óptimo basado en la información que el usuario te proporciona.

## Tu proceso de organización:
1. Calcula el tiempo total disponible sumando todos los bloques libres.
2. Compara ese tiempo con la suma de las duraciones de todas las tareas.
3. Si las tareas no caben, avisa al usuario cuáles no podrán hacerse y sugiere cuáles priorizar.
4. Organiza las tareas aplicando estas reglas de productividad:
   - Coloca las tareas de alta concentración o alta prioridad en las primeras horas disponibles de la mañana (pico cognitivo).
   - Deja las tareas mecánicas, administrativas o de baja energía para las últimas horas del día o después de comer.
   - Respeta bloques de descanso: si hay más de 90 minutos seguidos de trabajo, inserta un descanso de 10-15 minutos.
   - Agrupa tareas similares para minimizar el cambio de contexto (deep work batching).
   - Si una tarea tiene una hora límite (deadline), asegúrate de que quede programada con margen antes de esa hora.
5. Devuelve el plan en formato de agenda horaria clara, con hora de inicio y fin para cada bloque.

## Formato de respuesta:
- Devuelve SIEMPRE y ÚNICAMENTE un JSON estructurado con el siguiente formato, sin bloques de código Markdown alrededor:
{
  "viable": true, // o false si no cabe todo
  "advertencias": ["lista de avisos si hay tareas que no caben o conflictos"],
  "plan": [
    {
      "hora_inicio": "09:00",
      "hora_fin": "10:30",
      "tipo": "tarea", // "tarea" | "descanso" | "ocupado"
      "nombre": "Nombre de la tarea o bloque",
      "prioridad": "alta", // "alta" | "media" | "baja" (usa "media" si es ocupado/descanso)
      "notas": "Consejo o justificación breve de por qué está en ese hueco"
    }
  ],
  "resumen": "Breve párrafo con un resumen del día y motivación"
}

## Restricciones importantes:
- No muevas ni elimines bloques marcados como OCUPADOS.
- No programes tareas fuera del horario disponible indicado por el usuario.
- Si el usuario no indica prioridad, infiere la prioridad según el contexto semántico del nombre de la tarea.
- Si el tiempo disponible es suficiente, crea un plan completo. Si no lo es, sé honesto y claro.
- Tu respuesta SERÁ parseada usando JSON.parse(), asegúrate de que es un JSON puro sin texto adicional ni backticks de markdown.
`;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { data } = body;

        const payloadContext = JSON.stringify(data, null, 2);

        const completion = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            response_format: { type: "json_object" },
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: `Aquí están los datos del usuario para el plan de hoy:\n\n${payloadContext}` },
            ],
            temperature: 0.7,
            max_tokens: 1000,
        });

        const content = completion.choices[0].message?.content;

        if (!content) {
            throw new Error("No se pudo generar el plan: Respuesta vacía de Groq");
        }

        return NextResponse.json(JSON.parse(content));
    } catch (error: unknown) {
        console.error('Error generating plan:', error);
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message || 'Error interno del servidor' },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
