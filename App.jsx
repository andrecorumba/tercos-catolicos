function App() {
  const beads = React.useMemo(() => window.buildBeads(), []);

  const dayInfo = (() => {
    const day = new Date().getDay();
    const labels = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    let mystery;
    if (day === 1 || day === 6) mystery = 'gozosos';
    else if (day === 2 || day === 5) mystery = 'dolorosos';
    else if (day === 4) mystery = 'luminosos';
    else mystery = 'gloriosos'; // dom, qua
    return { mystery, label: labels[day] };
  })();
  const defaultMystery = dayInfo.mystery;

  const saved = (() => {
    try { return JSON.parse(localStorage.getItem('terco-state') || '{}'); } catch { return {}; }
  })();

  const [currentId, setCurrentId] = React.useState(saved.currentId ?? 0);
  const [selectedMystery, setSelectedMystery] = React.useState(saved.selectedMystery ?? defaultMystery);
  const [mysteryReady, setMysteryReady] = React.useState(saved.mysteryReady ?? false);
  const [material, setMaterial] = React.useState(saved.material ?? 'madeira');
  const [nightMode, setNightMode] = React.useState(saved.nightMode ?? false);
  const [bellOn, setBellOn] = React.useState(saved.bellOn ?? true);
  const [count, setCount] = React.useState(saved.count ?? 0);
  const [showTweaks, setShowTweaks] = React.useState(saved.showTweaks ?? false);
  const [aveAudioOn, setAveAudioOn] = React.useState(saved.aveAudioOn ?? true);
  const [started, setStarted] = React.useState(false);
  const [autoPlay, setAutoPlay] = React.useState(false);
  const audioRef = React.useRef(null);
  const audioQueueRef = React.useRef([]);
  const autoPlayRef = React.useRef(false);
  const goNextRef = React.useRef(null);
  const [audioBlocked, setAudioBlocked] = React.useState(false);

  React.useEffect(() => { autoPlayRef.current = autoPlay; }, [autoPlay]);

  // Criar elemento de áudio uma única vez
  React.useEffect(() => {
    const a = new Audio();
    a.preload = 'auto';
    a.volume = 0.75;
    const onEnded = () => {
      // tocar próximo da fila, se houver
      const q = audioQueueRef.current;
      if (q.length > 0) {
        const next = q.shift();
        a.src = next;
        a.currentTime = 0;
        a.play().catch(()=>{});
      } else if (autoPlayRef.current && goNextRef.current) {
        // Fila esgotada E modo corrido ligado -> avançar
        // pequena pausa pra respiração
        setTimeout(() => {
          if (autoPlayRef.current && goNextRef.current) goNextRef.current();
        }, 900);
      }
    };
    a.addEventListener('ended', onEnded);
    audioRef.current = a;
    return () => {
      a.removeEventListener('ended', onEnded);
      try { a.pause(); } catch(e){}
    };
  }, []);

  // Play uma sequência de áudios
  const playSequence = React.useCallback((srcs) => {
    const a = audioRef.current;
    if (!a || !srcs || !srcs.length) return;
    audioQueueRef.current = srcs.slice(1);
    try {
      a.src = srcs[0];
      a.currentTime = 0;
      const p = a.play();
      if (p && p.then) {
        p.then(() => setAudioBlocked(false))
         .catch(() => setAudioBlocked(true));
      }
    } catch(e){ setAudioBlocked(true); }
  }, []);

  // Determinar sequência de áudios pra uma conta
  const audioSequenceForBead = React.useCallback((bead, mysteryReady) => {
    if (!bead) return [];
    if (bead.type === 'cross') {
      return ['assets/sinal-da-cruz.mp3', 'assets/oferecimento.mp3', 'assets/credo.mp3'];
    }
    if (bead.type === 'medal') {
      // Glória + anúncio do 1º mistério (se já escolheu)
      const seq = ['assets/gloria.mp3'];
      if (mysteryReady && selectedMystery) {
        seq.push(`assets/myst/${selectedMystery}-1.mp3`);
      }
      return seq;
    }
    if (bead.type === 'pater') {
      // Pai-Nosso normal; anúncio do mistério já foi tocado antes
      return ['assets/pai-nosso.mp3'];
    }
    if (bead.type === 'ave') {
      const isLast = bead.indexInDecade === 10;
      if (isLast) {
        const seq = ['assets/ave-maria.mp3', 'assets/gloria.mp3', 'assets/oracao-de-fatima.mp3'];
        // Anúncio do próximo mistério (2º..5º), se houver
        if (bead.decade < 4 && selectedMystery) {
          seq.push(`assets/myst/${selectedMystery}-${bead.decade + 2}.mp3`);
        }
        if (bead.decade === 4) seq.push('assets/salve-rainha.mp3');
        return seq;
      }
      return ['assets/ave-maria.mp3'];
    }
    return [];
  }, []);

  // Tocar áudio conforme conta atual
  React.useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (!started || !aveAudioOn) {
      audioQueueRef.current = [];
      try { a.pause(); } catch(e){}
      return;
    }
    const cur = beads.find(b => b.id === currentId);
    const seq = audioSequenceForBead(cur, mysteryReady);
    if (seq.length) {
      playSequence(seq);
    } else {
      audioQueueRef.current = [];
      try { a.pause(); } catch(e){}
    }
  }, [currentId, aveAudioOn, started, beads, mysteryReady, audioSequenceForBead, playSequence]);

  React.useEffect(() => {
    localStorage.setItem('terco-state', JSON.stringify({
      currentId, selectedMystery, mysteryReady, material, nightMode, bellOn, count, aveAudioOn, showTweaks
    }));
  }, [currentId, selectedMystery, mysteryReady, material, nightMode, bellOn, count, aveAudioOn, showTweaks]);

  // Tweaks host integration — não anunciamos mais pro host (temos botão próprio "Ajustes")
  // Mantemos o listener caso o usuário ainda mande o evento, mas não sobrescreve a escolha local.
  React.useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setShowTweaks(true);
      if (e.data?.type === '__deactivate_edit_mode') setShowTweaks(false);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const currentBead = beads.find(b => b.id === currentId);

  const chainPath = React.useMemo(() => {
    if (!beads.length) return '';
    let d = `M ${beads[0].x} ${beads[0].y - 30}`;
    for (let i = 1; i < beads.length; i++) {
      const prev = beads[i - 1];
      const cur = beads[i];
      const midX = (prev.x + cur.x) / 2;
      const midY = (prev.y + cur.y) / 2;
      d += ` Q ${midX} ${midY} ${cur.x} ${cur.y}`;
    }
    const medal = beads.find(b => b.type === 'medal');
    const last = beads[beads.length - 1];
    if (medal && last) {
      d += ` Q ${(last.x + medal.x) / 2} ${(last.y + medal.y) / 2 - 10} ${medal.x} ${medal.y}`;
    }
    return d;
  }, [beads]);

  // Sino: tocar quando terminar uma dezena (passar da 10ª ave-maria de uma dezena)
  const playBell = React.useCallback(() => {
    if (!bellOn) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const now = ctx.currentTime;
      // Som de sino sintético (freqs harmônicas)
      const freqs = [523.25, 1046.5, 1567.98]; // C5, C6, G6
      freqs.forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.frequency.value = f;
        o.type = 'sine';
        g.gain.setValueAtTime(0.001, now);
        g.gain.exponentialRampToValueAtTime(0.25 / (i + 1), now + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
        o.connect(g).connect(ctx.destination);
        o.start(now);
        o.stop(now + 2.6);
      });
      setTimeout(() => ctx.close(), 3000);
    } catch (e) { /* no-op */ }
  }, [bellOn]);

  const goNext = () => {
    const idx = beads.findIndex(b => b.id === currentId);
    if (idx < beads.length - 1) {
      const nextBead = beads[idx + 1];
      if (currentBead && currentBead.type === 'ave' && currentBead.indexInDecade === 10) {
        playBell();
      }
      setCurrentId(nextBead.id);
    } else {
      // completou o terço
      setCount(c => c + 1);
      playBell();
      // desliga o modo corrido ao chegar no fim
      setAutoPlay(false);
    }
  };
  React.useEffect(() => { goNextRef.current = goNext; });
  const goPrev = () => {
    const idx = beads.findIndex(b => b.id === currentId);
    if (idx > 0) setCurrentId(beads[idx - 1].id);
  };
  const restart = () => {
    if (confirm('Recomeçar o terço do início?')) {
      setCurrentId(0);
      setMysteryReady(false);
    }
  };

  React.useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goNext(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentId, beads, bellOn, currentBead]);

  if (!started) {
    return (
      <div className="start-screen">
        <div className="start-cross">✝</div>
        <h1 className="start-title">Santo Terço</h1>
        <p className="start-sub">Contemple os mistérios clicando nas contas</p>
        <button className="start-btn" onClick={() => setStarted(true)}>
          Iniciar Terço
        </button>
        <p className="start-day">{dayInfo.label} · {window.MYSTERIES[dayInfo.mystery].name}</p>
      </div>
    );
  }

  return (
    <div className={`app ${nightMode ? 'night' : ''}`}>
      <div className="rosary-stage">
        <div className="stage-header">
          <div className="stage-title">Santo Terço</div>
          <div className="stage-sub">Contemple os mistérios clicando nas contas</div>
        </div>
        <button
          className={`audio-btn ${aveAudioOn ? 'on' : 'off'} ${audioBlocked ? 'blocked' : ''}`}
          onClick={() => {
            const next = !aveAudioOn;
            setAveAudioOn(next);
            if (next && currentBead && audioRef.current) {
              const seq = audioSequenceForBead(currentBead, mysteryReady);
              if (seq.length) playSequence(seq);
            }
          }}
          title={aveAudioOn ? 'Silenciar orações cantadas' : 'Ativar orações cantadas'}
        >
          {aveAudioOn ? (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5 6 9H3v6h3l5 4V5z" />
              <path d="M15.5 8.5a5 5 0 0 1 0 7" />
              <path d="M18.5 5.5a9 9 0 0 1 0 13" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5 6 9H3v6h3l5 4V5z" />
              <line x1="22" y1="9" x2="16" y2="15" />
              <line x1="16" y1="9" x2="22" y2="15" />
            </svg>
          )}
          <span className="audio-label">
            {audioBlocked ? 'toque para ativar' : (aveAudioOn ? 'Orações cantadas' : 'áudio silenciado')}
          </span>
        </button>
        <button
          className={`autoplay-btn ${autoPlay ? 'on' : ''}`}
          onClick={() => {
            const next = !autoPlay;
            setAutoPlay(next);
            if (next) {
              // garante áudio ligado e inicia a sequência da conta atual
              if (!aveAudioOn) setAveAudioOn(true);
              if (currentBead && audioRef.current) {
                const seq = audioSequenceForBead(currentBead, mysteryReady);
                if (seq.length) playSequence(seq);
              }
            }
          }}
          title={autoPlay ? 'Pausar modo fluido' : 'Iniciar Modo Fluido (avança automaticamente)'}
        >
          {autoPlay ? (
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
          <span className="audio-label">{autoPlay ? 'Pausar fluido' : 'Modo Fluido'}</span>
        </button>
        <button
          className={`settings-btn ${showTweaks ? 'on' : ''}`}
          onClick={() => setShowTweaks(v => !v)}
          title={showTweaks ? 'Fechar ajustes' : 'Abrir ajustes'}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span className="audio-label">Ajustes</span>
        </button>
        <window.Candle visible={nightMode} />
        <window.RosaryCanvas
          beads={beads}
          currentId={currentId}
          onBeadClick={setCurrentId}
          chainPath={chainPath}
          material={material}
          nightMode={nightMode}
        />
        {count > 0 && (
          <div className="stage-counter">
            <span className="sc-num">{count}</span>
            <span className="sc-label">{count === 1 ? 'terço completado' : 'terços completados'}</span>
          </div>
        )}
      </div>
      <window.PrayerPanel
        currentBead={currentBead}
        beads={beads}
        currentId={currentId}
        onPrev={goPrev}
        onNext={goNext}
        onRestart={restart}
        selectedMystery={selectedMystery}
        onSelectMystery={setSelectedMystery}
        mysteryReady={mysteryReady}
        onStartMysteries={() => setMysteryReady(true)}
        todayMystery={dayInfo.mystery}
        todayLabel={dayInfo.label}
      />
      <window.TweaksPanel
        visible={showTweaks}
        material={material}
        onMaterial={setMaterial}
        nightMode={nightMode}
        onNight={setNightMode}
        bellOn={bellOn}
        onBell={setBellOn}
        aveAudioOn={aveAudioOn}
        onAveAudio={setAveAudioOn}
        count={count}
        onResetCount={() => setCount(0)}
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
