function Candle({ visible }) {
  if (!visible) return null;
  return (
    <div className="candle">
      <div className="candle-flame">
        <div className="flame-core" />
        <div className="flame-glow" />
      </div>
      <div className="candle-wick" />
      <div className="candle-body">
        <div className="candle-drip" />
      </div>
      <div className="candle-base" />
    </div>
  );
}
window.Candle = Candle;

function TweaksPanel({ visible, material, onMaterial, nightMode, onNight, bellOn, onBell, aveAudioOn, onAveAudio, count, onResetCount }) {
  const [collapsed, setCollapsed] = React.useState(false);
  if (!visible) return null;
  const materials = [
    { key: 'madeira', label: 'Madeira', swatch: 'linear-gradient(135deg, #6b4423, #1a0f07)' },
    { key: 'madreperola', label: 'Madrepérola', swatch: 'linear-gradient(135deg, #ffffff, #b8a88f)' },
    { key: 'cristal', label: 'Cristal', swatch: 'linear-gradient(135deg, #ffffff, #7f9fc4)' },
    { key: 'pedra', label: 'Obsidiana', swatch: 'linear-gradient(135deg, #3a3a42, #050506)' },
    { key: 'metal', label: 'Ouro envelhecido', swatch: 'linear-gradient(135deg, #f4d789, #4a3410)' }
  ];
  return (
    <div className={`tweaks ${collapsed ? 'collapsed' : ''}`}>
      <div className="tweaks-title">
        <span>Ajustes</span>
        <button className="tweaks-toggle" onClick={() => setCollapsed(c => !c)} title={collapsed ? 'Expandir' : 'Recolher'}>
          {collapsed ? '▴' : '▾'}
        </button>
      </div>
      {!collapsed && (
      <>
      <div className="tweaks-section">
        <div className="tweaks-label">Material das contas</div>
        <div className="material-grid">
          {materials.map(mt => (
            <button key={mt.key} className={`mat-chip ${material === mt.key ? 'selected' : ''}`} onClick={() => onMaterial(mt.key)}>
              <span className="mat-swatch" style={{ background: mt.swatch }} />
              <span className="mat-name">{mt.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="tweaks-section">
        <div className="tweaks-row">
          <span className="tweaks-label">Modo noturno com vela</span>
          <button className={`toggle ${nightMode ? 'on' : ''}`} onClick={() => onNight(!nightMode)}>
            <span className="toggle-dot" />
          </button>
        </div>
        <div className="tweaks-row">
          <span className="tweaks-label">Sino entre dezenas</span>
          <button className={`toggle ${bellOn ? 'on' : ''}`} onClick={() => onBell(!bellOn)}>
            <span className="toggle-dot" />
          </button>
        </div>
        <div className="tweaks-row">
          <span className="tweaks-label">Orações cantadas</span>
          <button className={`toggle ${aveAudioOn ? 'on' : ''}`} onClick={() => onAveAudio(!aveAudioOn)}>
            <span className="toggle-dot" />
          </button>
        </div>
      </div>
      <div className="tweaks-section">
        <div className="counter-box">
          <div className="counter-label">Terços completados</div>
          <div className="counter-value">{count}</div>
          <button className="counter-reset" onClick={onResetCount}>zerar</button>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
window.TweaksPanel = TweaksPanel;
