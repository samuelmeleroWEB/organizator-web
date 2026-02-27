export interface Task {
    id: string;
    name: string;
    durationMinutes: number;
    priority: 'alta' | 'media' | 'baja' | '';
    deadline?: string;
}

export interface Block {
    id: string;
    name: string;
    startTime: string; // "HH:MM"
    endTime: string;
}

export interface AvailableWindow {
    id: string;
    startTime: string; // "HH:MM"
    endTime: string; // "HH:MM"
}

export interface PlanItem {
    hora_inicio: string;
    hora_fin: string;
    tipo: 'tarea' | 'descanso' | 'ocupado';
    nombre: string;
    prioridad: 'alta' | 'media' | 'baja';
    notas: string;
}

export interface PlanResponse {
    viable: boolean;
    advertencias: string[];
    plan: PlanItem[];
    resumen: string;
}
