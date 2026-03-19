import React, { useState } from 'react';
import { SITE_CONFIG } from '../../../config';

export const ContactForm = () => {
    const [status, setStatus] = useState<'IDLE' | 'SUBMITTING' | 'SUCCESS' | 'ERROR'>('IDLE');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('SUBMITTING');
        
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            // Usamos el ID centralizado desde config.ts
            const response = await fetch(`https://formspree.io/f/${SITE_CONFIG.formspreeId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setStatus('SUCCESS');
                (e.target as HTMLFormElement).reset();
            } else {
                setStatus('ERROR');
            }
        } catch (err) {
            setStatus('ERROR');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-10 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 custom-fade-in transition-colors duration-300">
            <form onSubmit={handleSubmit} className="space-y-6">
                <input type="hidden" name="_to" value={SITE_CONFIG.contactEmail} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Nombre Completo</label>
                        <input 
                            name="name"
                            required
                            type="text" 
                            placeholder="Tu nombre"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Email</label>
                        <input 
                            name="email"
                            required
                            type="email" 
                            placeholder="tu@email.com"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Mensaje</label>
                    <textarea 
                        name="message"
                        required
                        rows={4}
                        placeholder="¿Cómo podemos ayudarte?"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none dark:text-white"
                    ></textarea>
                </div>

                <button 
                    disabled={status === 'SUBMITTING'}
                    className={`w-full py-4 rounded-xl font-bold text-white transition-all transform hover:-translate-y-1 ${
                        status === 'SUBMITTING' ? 'bg-gray-400' : 'bg-primary-500 hover:bg-primary-600 shadow-xl shadow-primary-500/20'
                    }`}
                >
                    {status === 'SUBMITTING' ? 'Enviando...' : 'Enviar Mensaje'}
                </button>

                {status === 'SUCCESS' && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl text-center font-medium border border-green-100 dark:border-green-800">
                        ¡Mensaje enviado con éxito!
                    </div>
                )}
                {status === 'ERROR' && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl text-center font-medium border border-red-100 dark:border-red-800">
                         Error. Revisa tu Formspree ID en <code>src/config.ts</code>.
                    </div>
                )}
            </form>
        </div>
    );
};
