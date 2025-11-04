import React, { useState, useMemo, useEffect } from 'react';
// Importamos los íconos de Lucide que necesitan las tarjetas de sugerencia
import { Star, MapPin } from 'lucide-react';

// --- DATOS SIMULADOS ---

const InputField = ({ label, name, type = 'text', value, onChange, placeholder = '' }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor={name}>
            {label}
        </label>
        <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={name !== 'time' && name !== 'description'}
            className="w-full px-4 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150 placeholder-gray-500 shadow-inner"
            min={type === 'number' ? 0 : undefined}
        />
    </div>
);

const PlanDetail = ({ plan, onBack }) => {
    return (
        <div className="p-4 space-y-4">
            <button
                onClick={onBack}
                className="text-blue-400 cursor-pointer hover:text-blue-300 transition text-sm flex items-center gap-2"
            >
                ← Volver a tus planes
            </button>

            <div className="bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-700">
                <h2 className="text-xl font-semibold text-gray-100 mb-2">{plan.what}</h2>
                <p className="text-sm text-gray-400 mb-4">
                    {new Date(`${plan.date}T00:00:00`).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>

                <div className="text-gray-300 text-sm space-y-2">
                    <p><strong>Descripción:</strong> {plan.description || 'Sin descripción.'}</p>
                    <p><strong>Participantes:</strong> {plan.people.length || 0}</p>
                    <p><strong>Costo total:</strong> {formatCurrency(plan.cost)}</p>
                </div>

                {plan.people && plan.people.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-sm uppercase text-gray-400 mb-2">Participantes</h3>
                        <ul className="space-y-1">
                            {plan.people.map((p) => (
                                <li key={p.id} className="flex justify-between text-gray-200 text-sm bg-gray-700/50 px-3 py-2 rounded-lg">
                                    <span>{p.name}</span>
                                    <span>{formatCurrency(p.cost)} ({p.percentage || 0}%)</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * Formatea un número como moneda argentina (ARS) sin decimales.
 * @param cost El costo a formatear.
 * @returns Cadena de texto con formato de moneda.
 */
function formatCurrency(cost: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0, 
  }).format(cost);
}

// Datos para la lista de "Tus Planes"
const initialPlans = [
  { 
    id: 1, 
    date: '2025-10-17', 
    time: '13:00', 
    what: 'Asado Funes', 
    location: 'Casa de Funes', 
    cost: 10000,
    description: 'Reunión en la casa de Funes para hacer un asado con amigos. Cada uno lleva bebida y algo para picar. Se arranca al mediodía y se termina tarde.',
    people: [
      { name: 'Organizador', cost: 4000, percentage: 40 },
      { name: 'Invitado 1', cost: 2000, percentage: 20 },
      { name: 'Invitado 2', cost: 2000, percentage: 20 },
      { name: 'Invitado 3', cost: 1000, percentage: 10 },
      { name: 'Invitado 4', cost: 1000, percentage: 10 },
    ]
  },
  { 
    id: 2, 
    date: '2025-11-05', 
    time: '08:00', 
    what: 'Viaje a la Costa', 
    location: 'Mar del Plata', 
    cost: 8000,
    description: 'Escapada de fin de semana a Mar del Plata. Incluye combustible, alojamiento y comidas. Plan ideal para desconectarse y relajarse frente al mar.',
    people: [
      { name: 'Organizador', cost: 4000, percentage: 50 },
      { name: 'Invitado 1', cost: 4000, percentage: 50 },
    ]
  },
  { 
    id: 3, 
    date: '2025-10-25', 
    time: '21:00', 
    what: 'Cena con Amigos', 
    location: 'Casa de Franco', 
    cost: 9000,
    description: 'Cena en casa de Franco con todo el grupo. Se pide pizza y empanadas, con postre casero y sobremesa larga. Noche de charla y risas.',
    people: [
      { name: 'Organizador', cost: 3000, percentage: 33 },
      { name: 'Invitado 1', cost: 3000, percentage: 33 },
      { name: 'Invitado 2', cost: 3000, percentage: 33 },
    ]
  },
  { 
    id: 4, 
    date: '2025-12-01', 
    time: '17:30', 
    what: 'Regalo Cumpleaños', 
    location: 'Shopping Alto Rosario', 
    cost: 15000,
    description: 'Compra del regalo para el cumpleaños de Sofi. Se decidió comprarle un perfume y una caja de bombones premium en el shopping.',
    people: [
      { name: 'Organizador', cost: 15000, percentage: 100 },
    ]
  },
  { 
    id: 5, 
    date: '2025-09-30', 
    time: '20:00', 
    what: 'Partido de Fútbol', 
    location: 'Cancha El Fortín', 
    cost: 20000,
    description: 'Alquiler de cancha 8 para jugar con los chicos del laburo. Incluye gaseosas, picada y reserva del turno nocturno.',
    people: [
      { name: 'Organizador', cost: 4000, percentage: 20 },
      { name: 'Invitado 1', cost: 4000, percentage: 20 },
      { name: 'Invitado 2', cost: 4000, percentage: 20 },
      { name: 'Invitado 3', cost: 4000, percentage: 20 },
      { name: 'Invitado 4', cost: 4000, percentage: 20 },
    ]
  },
];



// Datos para la lista de "Sugerencias"
const sugerenciasData = [
    {
      id: 1,
      rating: 4.8,
      titulo: "Asado Funes",
      precio: "$100.000",
      ubicacion: "Funes",
      descripcion: "Plan nocturno con amigos. Comenzamos con una picada y unas cervezas, luego matambre a la pizza y terminamos la noche jugando al Truco."
    },
    {
      id: 2,
      rating: 4.5,
      titulo: "Cena Italiana",
      precio: "$75.000",
      ubicacion: "Rosario Centro",
      descripcion: "Noche de pastas caseras. Ideal para una cita. Incluye entrada, plato principal de ñoquis o ravioles, postre y una botella de vino."
    },
    {
      id: 3,
      rating: 4.2,
      titulo: "Tarde de Merienda",
      precio: "$30.000",
      ubicacion: "Pichincha",
      descripcion: "Café de especialidad con tortas artesanales. Perfecto para una tarde tranquila de lectura o trabajo. Incluye infusión y porción de torta."
    }
];

// --- COMPONENTES AUXILIARES ---

// Icono de flecha para indicar la dirección de ordenamiento
const SortArrowIcon = ({ direction }: {direction: string}) => (
    <svg 
        className={`w-3 h-3 ml-1 transition-all duration-300 transform ${direction === 'asc' ? 'rotate-180' : 'rotate-0'}`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
        strokeWidth="2.5"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
);

// Componente para Estrellas
const StarRating = ({ rating }: { rating: number }) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);

  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${
            // Colores ajustados para Dark Mode
            i < fullStars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'
          }`}
          strokeWidth={1.5}
        />
      ))}
      <span className="ml-2 text-lg font-bold text-gray-200">{rating.toFixed(1)}</span>
    </div>
  );
};

// Componente Tarjeta de Sugerencia (Ajustado para Dark Mode)
const SugerenciaCard = ({ sugerencia }: { sugerencia: typeof sugerenciasData[0] }) => {
  return (
    <div className="bg-gray-800 rounded-2xl shadow-xl p-5 w-full border border-gray-700">
      {/* Calificación y estrellas */}
      <div className="mb-2">
        <StarRating rating={sugerencia.rating} />
      </div>

      {/* Título y Precio */}
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-2xl font-bold text-gray-100">{sugerencia.titulo}</h2>
        {/* Usamos el precio ya formateado del mock data */}
        <span className="text-lg font-semibold text-teal-400">{sugerencia.precio}</span>
      </div>

      {/* Ubicación */}
      <div className="flex items-center text-gray-400 mb-4">
        <MapPin className="w-4 h-4 mr-1" strokeWidth={2} />
        <span>{sugerencia.ubicacion}</span>
      </div>

      {/* Descripción */}
      <p className="text-gray-300 text-sm leading-relaxed mb-4">
        {sugerencia.descripcion}
      </p>

      {/* Acción de Duplicar */}
      <div className="flex justify-end">
        <button className="text-sm font-medium text-blue-400 hover:text-blue-300 transition duration-150">
          Duplicar y Añadir
        </button>
      </div>
    </div>
  );
};

const ParticipantRow = React.memo(({ participant, onCostChange, onRemove }) => (
        <div key={participant.id} className="grid grid-cols-12 gap-2 items-center mb-2">
            {/* Icono y Nombre del Participante */}
            <div className="col-span-6 flex items-center text-sm text-gray-200 truncate">
                {participant.id === 1 ? ( // Asumiendo que el ID 1 es el Organizador
                    <svg className="w-5 h-5 mr-1 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                ) : (
                    <svg className="w-5 h-5 mr-1 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                )}
                {participant.name}
            </div>

            {/* Input Costo ($) */}
            <div className="col-span-3">
              <div className="relative">
                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">$</span>
                <input
                  type="number"
                  defaultValue={participant.cost === 0 ? '' : participant.cost}
                  onChange={(e) => onCostChange(participant.id, e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full pl-5 pr-1 py-1 text-sm bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:border-green-400 focus:ring-1 focus:ring-green-400 shadow-inner"
                />
              </div>
            </div>

            {/* Input Porcentaje (%) */}
            <div className="col-span-2">
                <div className="relative">
                    <span className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">%</span>
                    <input
                        type="text"
                        value={participant.percentage.toFixed(0)}
                        readOnly
                        className="w-full text-center py-1 text-sm bg-gray-600/50 text-gray-100 border border-gray-600 rounded-lg cursor-default"
                    />
                </div>
            </div>

            {/* Botón de Remover */}
            <div className="col-span-1 text-right">
                {participant.isRemovable && (
                    <button 
                        type="button" 
                        onClick={() => onRemove(participant.id)}
                        className="text-red-400 hover:text-red-500 transition duration-150 p-1"
                        aria-label={`Eliminar ${participant.name}`}
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
                    </button>
                )}
            </div>
        </div>
    ));

// --- NUEVO COMPONENTE: FORMULARIO CREAR PLAN ---
const NewPlanForm = ({ closeModal }) => {
    const [plan, setPlan] = useState({
        title: '',
        date: new Date().toISOString().slice(0, 10), // Fecha actual por defecto
        time: '19:00', // Hora por defecto
        place: '',
        description: '',
    });
    
    /** @type {[Participant[], React.Dispatch<React.SetStateAction<Participant[]>>]} */
    const [participants, setParticipants] = useState([
        { id: 1, name: 'Organizador', cost: 0, percentage: 0, isRemovable: false },
        { id: 2, name: 'Invitado 1', cost: 0, percentage: 0, isRemovable: true },
    ]);
    const [nextParticipantId, setNextParticipantId] = useState(3);
    const [error, setError] = useState('');

    // Maneja cambios en los campos simples (title, date, place, description, time)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPlan(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    /**
     * Maneja cambios de costo en los participantes de forma atómica.
     * Esto previene el doble re-renderizado y la pérdida de foco.
     * @param {number} id
     * @param {string} value
     */
    const handleParticipantChange = (id, value) => {
        setParticipants(currentParticipants => {
            // 1. Actualiza el costo para el participante específico
            const participantsWithNewCost = currentParticipants.map(p =>
                p.id === id ? { ...p, cost: value === '' ? '' : Number(value) } : p
            );

            // 2. Calcula el nuevo total basado en la lista actualizada
            const total = participantsWithNewCost.reduce((sum, p) => sum + Number(p.cost || 0), 0);
            
            // 3. Recalcula los porcentajes para TODOS los participantes y retorna la lista final
            const finalUpdatedParticipants = participantsWithNewCost.map(p => ({
                ...p,
                percentage: total > 0 ? Math.round((Number(p.cost || 0) / total) * 100) : 0,
            }));
            
            return finalUpdatedParticipants;
        });

        setError(''); // Limpiar error al escribir
    };

    // Agrega un nuevo invitado
    const addParticipant = () => {
        const newParticipant = {
            id: nextParticipantId,
            name: `Invitado ${nextParticipantId - 1}`,
            cost: 0,
            percentage: 0,
            isRemovable: true,
        };
        const newParticipantsList = [...participants, newParticipant];
        setParticipants(newParticipantsList);
        setNextParticipantId(prev => prev + 1);
    };

    /**
     * Elimina un invitado y recalcula porcentajes de forma atómica.
     * @param {number} id
     */
    const removeParticipant = (id) => {
        setParticipants(currentParticipants => {
            // 1. Filtra al participante
            const participantsWithoutRemoved = currentParticipants.filter(p => p.id !== id);
            
            // 2. Calcula el nuevo total
            const total = participantsWithoutRemoved.reduce((sum, p) => sum + Number(p.cost || 0), 0);
            
            // 3. Actualiza porcentajes para los participantes restantes
            const finalUpdatedParticipants = participantsWithoutRemoved.map(p => ({
                ...p,
                percentage: total > 0 ? Math.round((Number(p.cost || 0) / total) * 100) : 0,
            }));
            
            return finalUpdatedParticipants;
        });
    };

    const handleSubmit = (e) => {
      e.preventDefault();

      if (!plan.title.trim() || !plan.date || !plan.place.trim()) {
        setError('Por favor, completa los campos obligatorios: Título, Fecha y Lugar.');
        return;
      }

      
      // Leer planes existentes del localStorage
      const storedPlans = JSON.parse(localStorage.getItem("plans")) || initialPlans;
      
      // Armar el nuevo plan
      const planToSave = {
        id: storedPlans.length + 1,
        date: plan.date,
        what: plan.title,
        cost: participants.reduce((total, p) => total + Number(p.cost || 0), 0),
        description: plan.description,
        location: plan.place,
        time: plan.time,
        people: participants.map((p) => {
            return {name: p.name, cost: p.cost, percentage: p.percentage}
        }),
      };

      // Agregar el nuevo plan al array existente
      const updatedPlans = [...storedPlans, planToSave];

      // Guardar en localStorage
      localStorage.setItem("plans", JSON.stringify(updatedPlans));

      console.log('Nuevo Plan Creado:', planToSave);
      
      closeModal();
    };

    const totalCost = participants.reduce((sum, p) => sum + Number(p.cost || 0), 0);

    // Componente para una fila de participante en la sección de gastos

    // Asignamos las funciones de manejo de participantes aquí
    ParticipantRow.displayName = 'ParticipantRow';

    return (
        <form onSubmit={handleSubmit} className="relative overflow-auto">
            {/* Botón Volver (simulado) */}
            <button
                type="button"
                onClick={closeModal}
                className="absolute cursor-pointer top-0 left-0 text-blue-400 hover:text-blue-300 transition duration-150 p-2 flex items-center"
                aria-label="Volver"
            >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                <span className="text-sm font-medium">volver</span>
            </button>

            <h3 className="text-2xl font-bold mb-6 text-gray-100 text-center pt-8">Crear Plan</h3>

            {/* Título */}
            <InputField label="Título" name="title" type="text" value={plan.title} onChange={handleChange} placeholder="Ej: Asado Funes" />

            {/* Fecha y Hora en una sola fila */}
            <div className="flex space-x-4 mb-4">
                <div className="w-1/2">
                    <InputField label="Fecha (dd/mm/aaaa)" name="date" type="date" value={plan.date} onChange={handleChange} />
                </div>
                <div className="w-1/2">
                    <InputField label="Hora (hh:mm)" name="time" type="time" value={plan.time} onChange={handleChange} />
                </div>
            </div>

            {/* Lugar */}
            <InputField label="Lugar" name="place" type="text" value={plan.place} onChange={handleChange} placeholder="Ej: Casa de Juan / Funes" />

            {/* Descripción (TextArea simulado con InputField) */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="description">
                    Descripción
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={plan.description}
                    onChange={(e) => handleChange(e)}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150 placeholder-gray-500 shadow-inner resize-none"
                    placeholder="Detalles sobre el plan, picada, actividades, etc."
                />
            </div>

            {/* Sección de Gastos */}
            <div className="mt-6 p-4 border border-gray-700 rounded-xl bg-gray-900/50 shadow-lg">
                <h4 className="text-xl font-semibold text-gray-100 mb-4">Gastos</h4>
                
                {participants.map(p => (
                    <div
                        key={p.id} 
                        >
                        <ParticipantRow 
                            participant={p} 
                            onCostChange={handleParticipantChange} 
                            onRemove={removeParticipant} 
                        />
                    </div>
                ))}

                {/* Botón Sumar */}
                <button 
                    type="button"
                    onClick={addParticipant}
                    className="flex items-center text-blue-400 hover:text-blue-300 transition duration-150 mt-2 font-medium"
                >
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path></svg>
                    + Sumar Invitado
                </button>

                {/* Total */}
                <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-100">Total:</span>
                    <span className="text-2xl font-extrabold text-green-400">${totalCost.toFixed(2)}</span>
                </div>
            </div>
            
            {/* Mensaje de Error */}
            {error && (
                <div className="text-red-400 text-sm mt-4 bg-red-900/30 p-2 rounded-lg border border-red-800">
                    {error}
                </div>
            )}

            {/* Botón Guardar */}
            <button 
                type="submit"
                className="w-full bg-blue-600 cursor-pointer text-white py-3 mt-6 rounded-xl font-semibold transition duration-150 shadow-md shadow-blue-500/30 hover:bg-blue-500 active:bg-blue-700 text-lg"
            >
                Guardar
            </button>
        </form>
    );
};

// --- COMPONENTE PRINCIPAL (APP FUSIONADA) ---
const App = () => {
    // Estado para el ordenamiento: 'key-direction' (ej: 'date-asc')
    const [sortBy, setSortBy] = useState('date-asc'); 
    const [currentView, setCurrentView] = useState('plans'); // 'plans' o 'suggestions'
    // --- Lógica del Modal para Transición Suave ---
    const [showModal, setShowModal] = useState(false); 
    const [isModalOpen, setIsModalOpen] = useState(false); 
    console.log(JSON.parse(localStorage.getItem("plans")))

    const MODAL_TRANSITION_DURATION = 200; 

    const openModal = () => {
        setShowModal(true);
        // Pequeño retardo para iniciar la transición de opacidad/escala
        setTimeout(() => {
            setIsModalOpen(true);
        }, 10);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        console.log('Acción: Formulario de Plan cerrado.');
        // Espera la transición antes de desmontar el modal
        setTimeout(() => {
            setShowModal(false);
        }, MODAL_TRANSITION_DURATION); 
    };
    // ------------------------------------------------

    // Función para manejar el clic en los encabezados de columna
    const handleHeaderClick = (key: 'date' | 'name' | 'people' | 'cost') => {
        if (currentView !== 'plans') return; 

        const [currentKey, currentDirection] = sortBy.split('-');

        let newDirection = 'asc';
        const newKey = key;

        if (currentKey === key) {
            newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
        } else {
            // Ordenamiento por defecto: ascendente para todos los campos
            newDirection = 'asc'; 
        }

        setSortBy(`${newKey}-${newDirection}`);
        console.log(`Ordenando por: ${newKey}-${newDirection}`);
    };

    // Lógica de ordenamiento usando useMemo para optimización
    const sortedPlans = useMemo(() => {
        const [key, direction] = sortBy.split('-');
        
        const plans = localStorage.getItem("plans") ? JSON.parse(localStorage.getItem("plans") ?? "") : initialPlans

        console.log(plans)

        return [...plans].sort((a, b) => {
            let comparison = 0;

            if (key === 'date') {
                comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
            } else if (key === 'name') {
                comparison = a.what.localeCompare(b.what);
            } else if (key === 'people') {
                comparison = a.people - b.people;
            } else if (key === 'cost') {
                comparison = a.cost - b.cost;
            }

            // Invierte la comparación si la dirección es descendente
            return direction === 'desc' ? comparison * -1 : comparison;
        });
    }, [sortBy, isModalOpen]);

    // --- ICONOS INLINE ---

    // Icono de Candado (Bloqueado/Tus Planes)
    const LockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 9.5a4.5 4.5 0 10-9 0v4.5a.5.5 0 00.5.5h8a.5.5 0 00.5-.5v-4.5zM12 4.5V9.5"></path>
        </svg>
    );

    // Icono de Bombilla (Sugerencias)
    const BulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M4.776 5.378l-.707.707M21 12h-1M4 12H3m15.364 4.364l-.707-.707M5.364 18.636l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
    );

    // Icono de Gente y Moneda (combinación para la columna 'Quienes')
    const PeopleCostIcon = ({ people, cost }: {people: [], cost: number}) => (
        <div className="flex items-center space-x-1 flex-col">
            <div className='flex items-center'>
              <span className="font-semibold text-gray-300 mr-1">{people.length}</span>
              {/* Ícono de Gente */}
              <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-7 8a4 4 0 00-4 4v2h14v-2a4 4 0 00-4-4H9z" />
              </svg>
            </div>
            {/* Costo ajustado al color del Dark Mode */}
            <span className={`font-bold ml-0.5 text-xs ${cost > 15000 ? 'text-red-400' : 'text-teal-400'}`}>{formatCurrency(cost)}</span>
        </div>
    );

    // Estilos personalizados ajustados para Dark Mode
    const customStyle = {
        primaryBlue: '#60a5fa', // Blue-400
        darkText: '#e0e0e0', // Light text
        sketchTitle: { fontSize: '2rem', fontWeight: 700 },
        appContainer: {
            maxWidth: '390px',
            height: '800px', 
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
            borderRadius: '40px', 
            border: '10px solid #000000', // Borde negro
            backgroundColor: '#121212', // Fondo muy oscuro
        },
    };

    // Estilos de la grilla para la lista de planes
    const planGridClass = "grid grid-cols-[1fr_2fr_1fr] gap-2";

    // Contenido principal (Planes o Sugerencias)
    const MainContent = () => {
        const [currentPlan, setCurrentPlan] = useState<null | number>(null)
        const selectedPlan = sortedPlans.find(p => p.id === currentPlan);
        const [filter, setFilter] = useState<{ key: "rating" | "precio"; direction: "asc" | "desc" }>({
          key: "rating",
          direction: "desc",
        });
    
        const sortedSugerencias = [...sugerenciasData].sort((a, b) => {
          let valA: number;
          let valB: number;
        
          if (filter.key === "precio") {
            // Quitar símbolos y convertir a número
            valA = parseFloat(a.precio.replace(/[^0-9.-]+/g, ""));
            valB = parseFloat(b.precio.replace(/[^0-9.-]+/g, ""));
          } else {
            valA = a.rating;
            valB = b.rating;
          }
        
          return filter.direction === "asc" ? valA - valB : valB - valA;
        });
        // --- VISTA SUGERENCIAS (CONTENIDO INTEGRADO) ---
        if (currentView === 'suggestions') {
            return (
                <div className="p-4 space-y-4" style={{ backgroundColor: customStyle.appContainer.backgroundColor }}>
                    <div className="flex text-white items-center gap-2">
                        Ordenar por:
                        <select
                            value={filter.key}
                            onChange={(e) =>
                                setFilter((prev) => ({ ...prev, key: e.target.value }))
                            }
                            className="bg-gray-800 text-gray-200 text-xs rounded-md p-1 border border-gray-600 focus:outline-none"
                        >
                            <option value="stars">Estrellas</option>
                            <option value="cost">Costo</option>
                        </select>
                        
                        <select
                            value={filter.direction}
                            onChange={(e) =>
                                setFilter((prev) => ({ ...prev, direction: e.target.value }))
                            }
                            className="bg-gray-800 text-gray-200 text-xs rounded-md p-1 border border-gray-600 focus:outline-none"
                        >
                            <option value="asc">Ascendente</option>
                            <option value="desc">Descendente</option>
                        </select>
                    </div>
                    {/* Encabezado fijo para la vista de sugerencias */}
                    <div className="text-xs uppercase font-bold text-gray-400 border-b border-gray-700 pb-2 px-2 sticky top-0 z-10" style={{backgroundColor: customStyle.appContainer.backgroundColor}}>
                        <span>Planes Recomendados</span>
                    </div>

                    {/* Renderizado de la lista de sugerencias */}
                    {sortedSugerencias.map((sug) => (
                        <SugerenciaCard key={sug.id} sugerencia={sug} />
                    ))}
                    {sortedSugerencias.length === 0 && (
                        <div className="text-center text-gray-500 mt-10 p-4">
                            No hay sugerencias disponibles en este momento.
                        </div>
                    )}
                </div>
            );
        }
        // --- VISTA "TUS PLANES" (CONTENIDO ORIGINAL) ---
        const [activeKey, activeDirection] = sortBy.split('-');

        const handelCurrentPlan = (id: number | null) => {
            setCurrentPlan(id)
        }

        if (selectedPlan) {
            return (
                <PlanDetail
                    plan={selectedPlan}
                    onBack={() => setCurrentPlan(null)}
                />
            );
        }

        return (
            <main className="grow overflow-y-auto p-4 space-y-3">
                <button 
                        className="w-full h-12 hover:scale-[1.02] active:scale-[.98] hover:bg-blue-600/90 active:bg-blue-700 cursor-pointer text-white rounded-xl shadow-lg shadow-blue-600/40 bg-blue-600 transition duration-150 flex items-center gap-3 justify-center shrink-0 "
                        onClick={openModal} 
                        aria-label="Añadir Nuevo Plan"
                    >
                        Crear Nuevo Plan
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path>
                        </svg>
                </button>

                {/* Encabezados de la lista - Ajustados para Dark Mode */}
                <div className={`${planGridClass} text-xs uppercase font-bold text-gray-400 border-b border-gray-700 pb-2 px-2 sticky top-0 z-10`} style={{backgroundColor: customStyle.appContainer.backgroundColor}}>
                    
                    {/* CUÁNDO (Fecha) */}
                    <div 
                        className="flex items-center cursor-pointer hover:text-gray-200 transition duration-150 group select-none"
                        onClick={() => handleHeaderClick('date')}
                    >
                        <span>Cuándo</span>
                        <div className={`text-${activeKey === 'date' ? 'blue-400' : 'gray-600 opacity-0 group-hover:opacity-100'}`}>
                            {activeKey === 'date' && <SortArrowIcon direction={activeDirection} />}
                            {activeKey !== 'date' && <SortArrowIcon direction={'asc'} />}
                        </div>
                    </div>

                    {/* QUÉ (Nombre) */}
                    <div 
                        className="flex items-center cursor-pointer hover:text-gray-200 transition duration-150 group select-none"
                        onClick={() => handleHeaderClick('name')}
                    >
                        <span>Qué</span>
                        <div className={`text-${activeKey === 'name' ? 'blue-400' : 'gray-600 opacity-0 group-hover:opacity-100'}`}>
                            {activeKey === 'name' && <SortArrowIcon direction={activeDirection} />}
                            {activeKey !== 'name' && <SortArrowIcon direction={'asc'} />}
                        </div>
                    </div>

                    {/* QUIENES / COSTO (Usando Costo como criterio) */}
                    <div 
                        className="flex items-center justify-end cursor-pointer hover:text-gray-200 transition duration-150 group select-none"
                        onClick={() => handleHeaderClick('cost')}
                    >
                        <span className="mr-1">Quienes/Costo</span>
                        <div className={`text-${activeKey === 'cost' ? 'blue-400' : 'gray-600 opacity-0 group-hover:opacity-100'}`}>
                            {activeKey === 'cost' && <SortArrowIcon direction={activeDirection} />}
                            {activeKey !== 'cost' && <SortArrowIcon direction={'asc'} />}
                        </div>
                    </div>
                </div>

                {/* Renderizado de la lista de planes ordenados - Ajustados para Dark Mode */}
                {sortedPlans.map(plan => (
                    <div 
                        key={plan.id} 
                        className={`${planGridClass} bg-gray-800 p-3 rounded-xl shadow-lg border border-gray-700 cursor-pointer hover:shadow-xl transition duration-150 hover:scale-[1.02] active:scale-[.98] transform`}
                        onClick={() => handelCurrentPlan(plan.id)}
                        role="button"
                        tabIndex={0}
                    >
                        {/* Cuándo */}
                        <div className="text-sm font-semibold text-gray-100 flex flex-col">
                            <span>{new Date(`${plan.date}T00:00:00`).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}</span>
                            <span className="text-xs text-gray-500 font-normal">{new Date(plan.date).getFullYear()}</span>
                        </div>

                        {/* Qué */}
                        <div className="text-sm font-medium text-gray-100 truncate flex items-center">
                            {plan.what}
                        </div>

                        {/* Quienes / Costo */}
                        <div className="text-sm text-right flex items-center justify-end">
                            <PeopleCostIcon people={plan.people} cost={plan.cost} />
                        </div>
                    </div>
                ))}

                {/* Mensaje si la lista está vacía */}
                {sortedPlans.length === 0 && (
                    <div className="text-center text-gray-500 mt-10 p-4">
                        No hay planes registrados. ¡Presiona "Crear Nuevo Plan" para añadir uno!
                    </div>
                )}
            </main>
        );
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
            {/* Contenedor principal simulando la pantalla del teléfono */}
            <div className="w-full flex flex-col mx-auto overflow-hidden" style={customStyle.appContainer}>

                {/* 1. HEADER: Título y Botón Añadir (Dark Mode) */}
                <header className="p-6 bg-gray-800 border-b border-gray-700 shrink-0 rounded-t-[30px]">
                    <h1 className="text-center text-gray-100 font-inter" style={customStyle.sketchTitle}>
                        Gestión De Planes
                    </h1>
                </header>

                {/* 2. MAIN CONTENT */}
                <div className="grow overflow-y-auto" style={{ backgroundColor: customStyle.appContainer.backgroundColor }}>
                    <MainContent />
                </div>


                {/* 3. FOOTER: Navegación inferior (Dark Mode) */}
                <footer className="bg-gray-800 p-3.5 flex justify-around border-t border-gray-700 shrink-0 rounded-b-[30px] shadow-[0_-5px_10px_-5px_rgba(0,0,0,0.2)]">
                    
                    {/* Botón Tus Planes */}
                    <button 
                        className={`flex flex-col items-center cursor-pointer p-1 rounded-xl transition duration-200 ${currentView === 'plans' ? 'text-blue-400 font-bold' : 'text-gray-500 hover:text-gray-400'}`}
                        onClick={() => setCurrentView('plans')}
                        aria-current={currentView === 'plans' ? "page" : undefined}
                    >
                        <LockIcon className="w-5 h-5" strokeWidth="2.5" />
                        <span className="text-[10px] mt-0.5">Tus Planes</span>
                    </button>

                    {/* Botón Sugerencias */}
                    <button 
                        className={`flex flex-col items-center cursor-pointer p-1 rounded-xl transition duration-200 ${currentView === 'suggestions' ? 'text-blue-400 font-bold' : 'text-gray-500 hover:text-gray-400'}`}
                        onClick={() => setCurrentView('suggestions')}
                        aria-current={currentView === 'suggestions' ? "page" : undefined}
                    >
                        <BulbIcon className="w-5 h-5" strokeWidth="2.5" />
                        <span className="text-[10px] mt-0.5">Sugerencias</span>
                    </button>
                </footer>

                {/* 4. MODAL con Transiciones Suaves - Ahora con el formulario */}
                {showModal && (
                    <div 
                        className={`fixed inset-0 transition-all duration-${MODAL_TRANSITION_DURATION} flex items-center justify-center p-4 z-40 ${isModalOpen ? 'bg-black/0' : 'bg-black/0'}`}
                        onClick={closeModal}
                    >
                        <div 
                            className={`bg-gray-800 p-6 rounded-4xl overflow-y-auto max-h-[780px] h-full shadow-2xl w-full max-w-[370px] transform transition-all duration-${MODAL_TRANSITION_DURATION} ease-in-out border border-gray-700
                                ${isModalOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`
                            }
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Renderiza el nuevo formulario */}
                            <NewPlanForm closeModal={closeModal} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
