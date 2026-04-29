import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Send } from 'lucide-react';

export default function WhatsAppModal({ isOpen, onClose, onSelect, message }) {
  const phoneNumbers = [
    { value: '6281219135378', label: '0812-1913-5378', name: 'Admin 1' },
    { value: '6281291900736', label: '0812-9190-0736', name: 'Admin 2' },
    { value: '6281919022222', label: '0819-1902-2222', name: 'Admin 3' },
    { value: '6282117963455', label: '0821-1796-3455', name: 'Admin 4' }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="fixed inset-0 z-[9999] flex items-center justify-center p-3 md:p-4 bg-black/70 backdrop-blur-sm" 
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }} 
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-zinc-900 rounded-2xl w-full max-w-sm md:max-w-md overflow-hidden shadow-2xl border border-white/20 mx-4" 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 md:p-5 border-b border-white/10">
            <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              <Phone className="w-4 h-4 md:w-5 md:h-5 text-green-400" /> 
              Pilih Nomor WhatsApp
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-3 md:p-4 space-y-2 md:space-y-3">
            {phoneNumbers.map((num) => (
              <button 
                key={num.value} 
                onClick={() => onSelect(num.value, message)} 
                className="w-full flex items-center justify-between p-3 md:p-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-all group"
              >
                <div className="flex flex-col items-start text-left">
                  <span className="text-white font-medium text-sm md:text-base">{num.label}</span>
                  <span className="text-xs text-gray-400">{num.name}</span>
                </div>
                <Send className="w-4 h-4 text-green-400 group-hover:translate-x-1 transition shrink-0" />
              </button>
            ))}
          </div>
          <div className="p-3 md:p-4 text-center text-xs text-gray-500 border-t border-white/10">
            Klik nomor untuk langsung terhubung ke WhatsApp
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
