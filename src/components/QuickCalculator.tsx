import React, { useState } from 'react';
import { Calculator, Delete, ArrowDownToLine, Sparkles } from 'lucide-react';

interface QuickCalculatorProps {
  onApplyToDP?: (value: number) => void;
  onApplyToItemPrice?: (value: number) => void;
}

export const QuickCalculator: React.FC<QuickCalculatorProps> = ({
  onApplyToDP,
  onApplyToItemPrice,
}) => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [shouldReset, setShouldReset] = useState(false);
  const [history, setHistory] = useState<string>('');

  const handleKey = (key: string) => {
    if (key === 'C') {
      setDisplay('0');
      setFirstOperand(null);
      setOperator(null);
      setHistory('');
      setShouldReset(false);
    } else if (key === '=') {
      if (operator && firstOperand !== null) {
        const current = parseFloat(display);
        let result = 0;
        switch (operator) {
          case '+':
            result = firstOperand + current;
            break;
          case '-':
            result = firstOperand - current;
            break;
          case '*':
            result = firstOperand * current;
            break;
          case '/':
            result = current !== 0 ? firstOperand / current : 0;
            break;
        }
        setHistory(`${firstOperand} ${operator} ${current} =`);
        setDisplay(result.toString());
        setFirstOperand(null);
        setOperator(null);
        setShouldReset(true);
      }
    } else if (['+', '-', '*', '/'].includes(key)) {
      const current = parseFloat(display);
      setFirstOperand(current);
      setOperator(key);
      setHistory(`${current} ${key}`);
      setShouldReset(true);
    } else {
      // Numbers or decimal
      if (display === '0' || shouldReset) {
        setDisplay(key);
        setShouldReset(false);
      } else {
        setDisplay(display + key);
      }
    }
  };

  const handleBackspace = () => {
    if (display.length <= 1) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const keys = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    'C', '0', '=', '+',
  ];

  const currentNum = parseFloat(display) || 0;

  return (
    <div id="quick-calculator-card" className="bg-slate-900 text-white rounded-xl p-4 shadow-md border border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-red-400" />
          <h3 className="text-sm font-bold tracking-wide text-slate-100 uppercase">
            Kalkulator Cepat
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {onApplyToDP && currentNum > 0 && (
            <button
              id="calc-apply-dp-btn"
              type="button"
              onClick={() => onApplyToDP(currentNum)}
              className="text-[11px] bg-red-800 hover:bg-red-700 text-white font-medium px-2 py-1 rounded flex items-center gap-1 transition"
              title="Isi ke kolom Uang Muka (DP)"
            >
              <ArrowDownToLine className="w-3 h-3" />
              Set ke DP
            </button>
          )}
          <button
            id="calc-backspace-btn"
            type="button"
            onClick={handleBackspace}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Hapus satu angka"
          >
            <Delete className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Screen */}
      <div className="bg-slate-950/80 rounded-lg p-3 border border-slate-800 mb-3 text-right">
        <div className="text-[11px] text-slate-400 font-mono h-4 overflow-hidden truncate">
          {history || '\u00A0'}
        </div>
        <div className="text-2xl font-bold font-mono text-emerald-400 tracking-wider truncate">
          {display}
        </div>
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-2">
        {keys.map((key) => {
          const isOp = ['+', '-', '*', '/'].includes(key);
          const isEquals = key === '=';
          const isClear = key === 'C';

          let btnClass = 'bg-slate-800 hover:bg-slate-700 text-slate-100';
          if (isOp) {
            btnClass = 'bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 font-semibold border border-amber-500/30';
          } else if (isEquals) {
            btnClass = 'bg-red-700 hover:bg-red-600 text-white font-bold border border-red-600';
          } else if (isClear) {
            btnClass = 'bg-rose-950/60 hover:bg-rose-900 text-rose-300 font-bold border border-rose-800/40';
          }

          return (
            <button
              id={`calc-btn-${key === '/' ? 'div' : key === '*' ? 'mul' : key === '+' ? 'plus' : key === '-' ? 'minus' : key === '=' ? 'eq' : key}`}
              key={key}
              type="button"
              onClick={() => handleKey(key)}
              className={`h-11 rounded-lg text-base font-semibold flex items-center justify-center transition active:scale-95 shadow-sm ${btnClass}`}
            >
              {key}
            </button>
          );
        })}
      </div>
    </div>
  );
};
