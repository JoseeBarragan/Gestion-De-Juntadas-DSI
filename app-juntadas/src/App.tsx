import React, { useState, useMemo } from 'react';
// Importamos los íconos de Lucide que necesitan las tarjetas de sugerencia
import { Star, MapPin } from 'lucide-react';

// --- DATOS SIMULADOS ---

// Datos para la lista de "Tus Planes"
const initialPlans = [
    { id: 1, date: '2025-10-17', what: 'Asado Funes', people: 5, cost: '$$' },
    { id: 2, date: '2025-11-05', what: 'Viaje a la Costa', people: 2, cost: '$$$' },
    { id: 3, date: '2025-10-25', what: 'Cena con Amigos', people: 8, cost: '$' },
    { id: 4, date: '2025-12-01', what: 'Regalo Cumpleaños', people: 1, cost: '$$' },
    { id: 5, date: '2025-09-30', what: 'Partido de Fútbol', people: 10, cost: '$' },
];

// Datos para la lista de "Sugerencias" (del archivo anterior)
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

// --- COMPONENTES AUXILIARES (DE AMBOS ARCHIVOS) ---

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

// Componente para Estrellas (de SugerenciasApp.jsx)
const StarRating = ({ rating }) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);

  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${
            i < fullStars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
          strokeWidth={1.5}
        />
      ))}
      <span className="ml-2 text-lg font-bold text-gray-700">{rating}</span>
    </div>
  );
};

// Componente Tarjeta de Sugerencia (de SugerenciasApp.jsx)
// (Modificado para no tener max-w-md o mx-auto, ya que estará en una lista)
const SugerenciaCard = ({ sugerencia }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 w-full border border-gray-200">
      {/* Calificación y estrellas */}
      <div className="mb-2">
        <StarRating rating={sugerencia.rating} />
      </div>

      {/* Título y Precio */}
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-2xl font-bold text-gray-900">{sugerencia.titulo}</h2>
        <span className="text-lg font-semibold text-green-600">{sugerencia.precio}</span>
      </div>

      {/* Ubicación */}
      <div className="flex items-center text-gray-500 mb-4">
        <MapPin className="w-4 h-4 mr-1" strokeWidth={2} />
        <span>{sugerencia.ubicacion}</span>
      </div>

      {/* Descripción */}
      <p className="text-gray-700 text-sm leading-relaxed mb-4">
        {sugerencia.descripcion}
      </p>

      {/* Acción de Duplicar */}
      <div className="flex justify-end">
        <button className="text-sm font-medium text-blue-600 hover:underline">
          Duplicar
        </button>
      </div>
    </div>
  );
};


// --- COMPONENTE PRINCIPAL (APP FUSIONADA) ---
const App = () => {
    // Estado para el ordenamiento: 'key-direction' (ej: 'date-asc')
    const [sortBy, setSortBy] = useState('date-asc'); 
    const [currentView, setCurrentView] = useState('plans'); // 'plans' o 'suggestions'

    // --- Lógica del Modal para Transición Suave ---
    const [showModal, setShowModal] = useState(false); // Controla el montaje/desmontaje (DOM)
    const [isModalOpen, setIsModalOpen] = useState(false); // Controla la transición CSS (Animación)

    // Duración de la animación del modal
    const MODAL_TRANSITION_DURATION = 150; 

    const openModal = () => {
        setShowModal(true);
        setTimeout(() => {
            setIsModalOpen(true);
        }, 10);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        console.log('Acción: Formulario de Plan cerrado.');
        setTimeout(() => {
            setShowModal(false);
        }, MODAL_TRANSITION_DURATION); 
    };
    // ------------------------------------------------

    // Función para manejar el clic en los encabezados de columna
    const handleHeaderClick = (key : any) => {
        if (currentView !== 'plans') return; // Solo permitir ordenar en la vista de planes

        const [currentKey, currentDirection] = sortBy.split('-');

        let newDirection = 'asc';
        const newKey = key;

        if (currentKey === key) {
            newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
        } else {
            newDirection = (key === 'people' || key === 'cost') ? 'asc' : 'asc';
        }

        setSortBy(`${newKey}-${newDirection}`);
        console.log(`Ordenando por: ${newKey}-${newDirection}`);
    };

    // Lógica de ordenamiento usando useMemo para optimización
    const sortedPlans = useMemo(() => {
        const [key, direction] = sortBy.split('-');
        
        return [...initialPlans].sort((a, b) => {
            let comparison = 0;

            if (key === 'date') {
                comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
            } else if (key === 'name') {
                comparison = a.what.localeCompare(b.what);
            } else if (key === 'people') {
                comparison = a.people - b.people;
            } else if (key === 'cost') {
                comparison = a.cost.length - b.cost.length;
            }

            return direction === 'desc' ? comparison * -1 : comparison;
        });
    }, [sortBy]);

    // --- ICONOS INLINE (de la App de Gestión) ---

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
    const PeopleCostIcon = ({ people, cost }: {people: number, cost: string}) => (
        <div className="flex items-center space-x-1 justify-end">
            <span className="font-semibold text-gray-700 mr-1">{people}</span>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h-10A2 2 0 015 18v-2a4 4 0 014-4h6a4 4 0 014 4v2a2 2 0 01-2 2zM12 14V8m0 0V4"></path>
                <circle cx="12" cy="7" r="3" fill="currentColor" stroke="none" />
            </svg>
            <span className={`font-bold ml-0.5 ${cost.length > 2 ? 'text-red-500' : 'text-green-600'}`}>{cost}</span>
        </div>
    );

    // Estilos personalizados
    const customStyle = {
        primaryBlue: '#4c7cff',
        secondaryGray: '#e0e0e0',
        darkText: '#333333',
        sketchTitle: { fontSize: '2rem', fontWeight: 700 },
        appContainer: {
            maxWidth: '390px',
            height: '800px', 
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.25)',
            borderRadius: '40px', 
            border: '10px solid #222222', 
            backgroundColor: '#f9f9f9', 
        },
    };

    // Estilos de la grilla para la lista de planes
    const planGridClass = "grid grid-cols-[1fr_2fr_1fr] gap-2";

    // Contenido principal (Planes o Sugerencias)
    const MainContent = () => {
        
        // --- VISTA SUGERENCIAS (CONTENIDO INTEGRADO) ---
        if (currentView === 'suggestions') {
            return (
                <div className="p-4 space-y-4" style={{ backgroundColor: customStyle.appContainer.backgroundColor }}>
                    {/* Encabezado fijo para la vista de sugerencias */}
                    <div className="text-xs uppercase font-bold text-gray-600 border-b pb-2 px-2 sticky top-0 z-10" style={{backgroundColor: customStyle.appContainer.backgroundColor}}>
                        <span>Planes Recomendados</span>
                    </div>

                    {/* Renderizado de la lista de sugerencias */}
                    {sugerenciasData.map((sug) => (
                        <SugerenciaCard key={sug.id} sugerencia={sug} />
                    ))}
                </div>
            );
        }

        // --- VISTA "TUS PLANES" (CONTENIDO ORIGINAL) ---
        const [activeKey, activeDirection] = sortBy.split('-');

        return (
            <main className="grow overflow-y-auto p-4 space-y-3">
                
                {/* Encabezados de la lista - Ahora son clics para ordenar */}
                <div className={`${planGridClass} text-xs uppercase font-bold text-gray-600 border-b pb-2 px-2 sticky top-0 bg-f9f9f9 z-10`} style={{backgroundColor: customStyle.appContainer.backgroundColor}}>
                    
                    {/* CUÁNDO (Fecha) */}
                    <div 
                        className="flex items-center cursor-pointer hover:text-gray-800 transition duration-150 group select-none"
                        onClick={() => handleHeaderClick('date')}
                    >
                        <span>Cuándo</span>
                        <div className={`text-${activeKey === 'date' ? 'primary-blue' : 'gray-400 opacity-0 group-hover:opacity-100'}`}>
                            {activeKey === 'date' && <SortArrowIcon direction={activeDirection} />}
                            {activeKey !== 'date' && <SortArrowIcon direction={'asc'} />}
                        </div>
                    </div>

                    {/* QUÉ (Nombre) */}
                    <div 
                        className="flex items-center cursor-pointer hover:text-gray-800 transition duration-150 group select-none"
                        onClick={() => handleHeaderClick('name')}
                    >
                        <span>Qué</span>
                        <div className={`text-${activeKey === 'name' ? 'primary-blue' : 'gray-400 opacity-0 group-hover:opacity-100'}`}>
                            {activeKey === 'name' && <SortArrowIcon direction={activeDirection} />}
                            {activeKey !== 'name' && <SortArrowIcon direction={'asc'} />}
                        </div>
                    </div>

                    {/* QUIENES / COSTO (Usando Costo como criterio) */}
                    <div 
                        className="flex items-center justify-end cursor-pointer hover:text-gray-800 transition duration-150 group select-none"
                        onClick={() => handleHeaderClick('cost')}
                    >
                        <span className="mr-1">Quienes / Costo</span>
                        <div className={`text-${activeKey === 'cost' ? 'primary-blue' : 'gray-400 opacity-0 group-hover:opacity-100'}`}>
                            {activeKey === 'cost' && <SortArrowIcon direction={activeDirection} />}
                            {activeKey !== 'cost' && <SortArrowIcon direction={'asc'} />}
                        </div>
                    </div>
                </div>

                {/* Renderizado de la lista de planes ordenados */}
                {sortedPlans.map(plan => (
                    <div 
                        key={plan.id} 
                        className={`${planGridClass} bg-white p-3 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition duration-150 hover:scale-[1.02] active:scale-[.98] transform`}
                        onClick={() => console.log('Abrir detalle del plan:', plan.id)}
                        role="button"
                        tabIndex={0}
                    >
                        {/* Cuándo */}
                        <div className="text-sm font-semibold text-dark-text flex flex-col">
                            <span>{new Date(plan.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                            <span className="text-xs text-gray-500 font-normal">{new Date(plan.date).getFullYear()}</span>
                        </div>

                        {/* Qué */}
                        <div className="text-sm font-medium text-dark-text truncate flex items-center">
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
                        No hay planes registrados. ¡Presiona "+" para añadir uno!
                    </div>
                )}
            </main>
        );
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            {/* Contenedor principal simulando la pantalla del teléfono */}
            <div className="w-full flex flex-col mx-auto overflow-hidden" style={customStyle.appContainer}>

                {/* 1. HEADER: Título y Botón Añadir */}
                <header className="p-6 pb-4 bg-white border-b border-gray-100 shrink-0 rounded-t-[30px]">
                    <h1 className="text-center text-dark-text mb-4" style={customStyle.sketchTitle}>
                        Gestión De Planes
                    </h1>

                    {/* Solo el botón Añadir (+) */}
                    <button 
                        className="w-full h-12 hover:scale-[1.02] active:scale-[.98] hover:bg-blue-600/90 active:bg-blue-700 cursor-pointer bg-primary-blue text-white rounded-xl shadow-lg shadow-blue-500/50 bg-blue-600 transition duration-150 flex items-center gap-3 justify-center shrink-0 "
                        onClick={openModal} 
                        aria-label="Añadir Nuevo Plan"
                    >
                        Crear Nuevo Plan
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path>
                        </svg>
                    </button>
                </header>

                {/* 2. MAIN CONTENT */}
                <div className="grow overflow-y-auto" style={{ backgroundColor: customStyle.appContainer.backgroundColor }}>
                    <MainContent />
                </div>


                {/* 3. FOOTER: Navegación inferior */}
                <footer className="bg-white p-3.5 flex justify-around border-t border-gray-200 shrink-0 rounded-b-[30px] shadow-[0_-5px_10px_-5px_rgba(0,0,0,0.05)]">
                    
                    {/* Botón Tus Planes */}
                    <button 
                        className={`flex flex-col items-center cursor-pointer p-1 rounded-xl transition duration-200 ${currentView === 'plans' ? 'text-primary-blue font-bold' : 'text-gray-400 hover:text-gray-600'}`}
                        onClick={() => setCurrentView('plans')}
                        aria-current={currentView === 'plans' ? "page" : undefined}
                    >
                        <LockIcon className="w-5 h-5" strokeWidth="2.5" />
                        <span className="text-[10px] mt-0.5">Tus Planes</span>
                    </button>

                    {/* Botón Sugerencias */}
                    <button 
                        className={`flex flex-col items-center cursor-pointer p-1 rounded-xl transition duration-200 ${currentView === 'suggestions' ? 'text-primary-blue font-bold' : 'text-gray-400 hover:text-gray-600'}`}
                        onClick={() => setCurrentView('suggestions')}
                        aria-current={currentView === 'suggestions' ? "page" : undefined}
                    >
                        <BulbIcon className="w-5 h-5" strokeWidth="2.5" />
                        <span className="text-[10px] mt-0.5">Sugerencias</span>
                    </button>
                </footer>

                {/* 4. MODAL con Transiciones Suaves */}
                {showModal && (
                    <div 
                        className={`fixed inset-0 transition-all duration-${MODAL_TRANSITION_DURATION} flex items-center justify-center p-4 z-50 ${isModalOpen ? 'bg-black/70' : 'bg-black/0'}`}
                        onClick={closeModal}
                    >
                        <div 
                            className={`bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm transform transition-all duration-${MODAL_TRANSITION_DURATION} ease-in-out 
                                ${isModalOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`
                            }
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-2xl font-bold mb-4 text-dark-text">¡Crear Plan!</h3>
                            <p className="text-gray-600 mb-6">
                                Aquí iría un formulario completo para ingresar la fecha, nombre, personas y costo estimado del nuevo plan.
                            </p>
                            <button 
                                className="w-full bg-primary-blue cursor-pointer text-white py-3 rounded-xl font-semibold bg-blue-600 transition duration-150 shadow-md"
                                onClick={closeModal} 
                            >
                                ¡Listo! Cerrar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;

