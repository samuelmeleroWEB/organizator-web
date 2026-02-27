import { NextResponse } from 'next/server';

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
        const { apiKey, model, data } = body;

        // We'll support both OpenAI and Anthropic based on the model provided by the user
        if (!apiKey) {
            return NextResponse.json(
                { error: 'API Key es requerida' },
                { status: 400 }
            );
        }

        const payloadContext = JSON.stringify(data, null, 2);

        if (model.includes('gpt')) {
            // OpenAI format
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: model || 'gpt-4o',
                    response_format: { type: "json_object" },
                    messages: [
                        { role: 'system', content: SYSTEM_PROMPT },
                        { role: 'user', content: `Aquí están los datos del usuario para el plan de hoy:\n\n${payloadContext}` },
                    ],
                }),
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }

            const raw = await response.json();
            return NextResponse.json(JSON.parse(raw.choices[0].message.content));
        } else {
            // Anthropic format
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                },
                body: JSON.stringify({
                    model: model || 'claude-3-5-sonnet-20240620',
                    max_tokens: 4096,
                    system: SYSTEM_PROMPT + "\\n\\nDevuelve SOLAMENTE el JSON válido, sin backticks ni etiquetas.",
                    messages: [
                        { role: 'user', content: `Aquí están los datos del usuario para el plan de hoy:\n\n${payloadContext}` },
                    ],
                }),
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }

            const raw = await response.json();
            const content = raw.content[0].text;

            // Attempt to strip potential markdown blocks
            const cleanContent = content.replace(/^\\s*\`\`\`json\\s*/g, '').replace(/\\s*\`\`\`\\s*$/g, '').trim();

            return NextResponse.json(JSON.parse(cleanContent));
        }
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
