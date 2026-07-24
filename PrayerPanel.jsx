const { useState: useStateP, useEffect: useEffectP, useMemo: useMemoP } = React;

function PrayerPanel({
  currentBead,
  beads,
  currentId,
  stepIdx,
  onPrev,
  onNext,
  onRestart,
  selectedMystery,
  onSelectMystery,
  mysteryReady,
  onStartMysteries,
  todayMystery,
  todayLabel
}) {
  const prayers = window.PRAYERS;
  const mysteries = window.MYSTERIES;

  if (!currentBead) return null;

  const steps = window.stepsForBead(currentBead);
  const step = steps[Math.min(stepIdx, steps.length - 1)];

  // Um único conteúdo (oração OU mistério) por slide
  let content = null;
  if (step) {
    if (step.kind === 'prayer') {
      const p = prayers[step.key];
      let title = p.title;
      if (step.key === 'aveMaria' && currentBead.type === 'ave' && currentBead.indexInDecade > 0) {
        title = `Ave-Maria ${currentBead.indexInDecade} de 10`;
      }
      content = <PrayerBlock title={title} text={p.text} />;
    } else if (step.kind === 'mystery') {
      const mystery = mysteries[selectedMystery];
      const mList = mystery && mystery.list[step.decade];
      content = mList ? (
        <div className="mystery-header">
          <div className="mystery-tag">{mList.num} mistério · {mystery.name.replace('Mistérios ', '')}</div>
          <h2 className="mystery-title">{mList.title}</h2>
          <div className="mystery-ref">{mList.ref}</div>
          <p className="mystery-reflection">{mList.reflection}</p>
        </div>
      ) : null;
    } else if (step.kind === 'medalChoice') {
      const mystery = mysteries[selectedMystery];
      content = mysteryReady ? (
        <div className="mystery-announce">
          <div className="mystery-label">Agora iniciamos os</div>
          <div className="mystery-name">{mystery.name}</div>
          <div className="mystery-day">{mystery.days}</div>
        </div>
      ) : (
        <MysteryPicker selected={selectedMystery} onSelect={onSelectMystery} onConfirm={onStartMysteries} todayMystery={todayMystery} todayLabel={todayLabel} />
      );
    }
  }

  // Progresso da dezena
  const showProgress = currentBead.type === 'ave' && typeof currentBead.decade === 'number';
  const decadeIdx = currentBead.decade ?? 0;
  const idxInDec = currentBead.indexInDecade || 0;

  // Posição global
  const position = beads.findIndex(b => b.id === currentId);
  const total = beads.length;
  const atStart = position === 0 && stepIdx === 0;
  const atEnd = position === total - 1 && stepIdx >= steps.length - 1;

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-eyebrow">Santo Terço {todayMystery && <span className="today-chip">{todayLabel} · {mysteries[todayMystery].name.replace('Mistérios ', '')}</span>}</div>
        <div className="panel-sub">
          {currentBead.label}
          {steps.length > 1 && <span className="step-count"> · {Math.min(stepIdx, steps.length - 1) + 1}/{steps.length}</span>}
        </div>
      </div>

      {showProgress && (
        <div className="decade-progress">
          <div className="decade-progress-label">
            {decadeIdx + 1}ª dezena · {idxInDec}/10
          </div>
          <div className="decade-dots">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`decade-dot ${i < idxInDec ? 'done' : ''} ${i === idxInDec - 1 ? 'current' : ''}`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="panel-body">
        {content}
      </div>

      <div className="panel-footer">
        <button className="nav-btn" onClick={onPrev} disabled={atStart}>
          <span>←</span> Anterior
        </button>
        <div className="position">
          <span className="position-num">{position + 1}</span>
          <span className="position-sep">/</span>
          <span className="position-total">{total}</span>
        </div>
        <button className="nav-btn primary" onClick={onNext} disabled={atEnd}>
          Próxima <span>→</span>
        </button>
      </div>
      <button className="restart-btn" onClick={onRestart}>Recomeçar o terço</button>
    </div>
  );
}

function PrayerBlock({ title, text }) {
  // Tamanho da letra conforme o comprimento: orações curtas ganham letra bem maior
  const len = text.length;
  const size = len > 400 ? 'len-long' : len > 200 ? 'len-medium' : 'len-short';
  return (
    <div className="prayer-block">
      <h3 className="prayer-title">{title}</h3>
      <p className={`prayer-text ${size}`}>{text}</p>
    </div>
  );
}

function MysteryPicker({ selected, onSelect, onConfirm, todayMystery, todayLabel }) {
  const mysteries = window.MYSTERIES;
  const todayName = mysteries[todayMystery]?.name.replace('Mistérios ', '');
  return (
    <div className="mystery-picker">
      {todayMystery && (
        <div className="today-banner">
          <div className="today-eyebrow">Hoje · {todayLabel}</div>
          <div className="today-name">{todayName}</div>
          <div className="today-hint">
            {selected === todayMystery
              ? 'Selecionado automaticamente — confirme abaixo ou escolha outro'
              : 'Você pode voltar ao mistério do dia clicando abaixo'}
          </div>
        </div>
      )}
      <div className="mp-title">{selected === todayMystery ? 'Ou escolha outros mistérios' : 'Escolha os mistérios a contemplar'}</div>
      <div className="mp-grid">
        {Object.entries(mysteries).map(([key, m]) => (
          <button
            key={key}
            className={`mp-option ${selected === key ? 'selected' : ''} ${key === todayMystery ? 'today' : ''}`}
            onClick={() => onSelect(key)}
          >
            <div className="mp-name">
              {m.name.replace('Mistérios ', '')}
              {key === todayMystery && <span className="today-pin">hoje</span>}
            </div>
            <div className="mp-day">{m.days}</div>
          </button>
        ))}
      </div>
      <button className="mp-confirm" onClick={onConfirm} disabled={!selected}>
        Iniciar contemplação →
      </button>
    </div>
  );
}

window.PrayerPanel = PrayerPanel;
