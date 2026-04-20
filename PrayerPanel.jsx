const { useState: useStateP, useEffect: useEffectP, useMemo: useMemoP } = React;

function PrayerPanel({
  currentBead,
  beads,
  currentId,
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

  // Determinar que oração exibir
  let content = null;

  if (!currentBead) return null;

  // Caso especial: crucifixo -> mostrar sinal da cruz + oferecimento + credo
  if (currentBead.type === 'cross') {
    content = (
      <>
        <PrayerBlock title="Sinal da Cruz" text={prayers.sinalCruz.text} />
        <PrayerBlock title="Oferecimento" text={prayers.ofertaInicial.text} />
        <PrayerBlock title="Credo" text={prayers.credo.text} />
      </>
    );
  } else if (currentBead.type === 'medal') {
    // Medalha: Glória ao final do pendente + anúncio do mistério
    const mystery = mysteries[selectedMystery];
    content = (
      <>
        <PrayerBlock title="Glória" text={prayers.gloria.text} />
        {mysteryReady ? (
          <div className="mystery-announce">
            <div className="mystery-label">Agora iniciamos os</div>
            <div className="mystery-name">{mystery.name}</div>
            <div className="mystery-day">{mystery.days}</div>
          </div>
        ) : (
          <MysteryPicker selected={selectedMystery} onSelect={onSelectMystery} onConfirm={onStartMysteries} todayMystery={todayMystery} todayLabel={todayLabel} />
        )}
      </>
    );
  } else if (currentBead.type === 'pater') {
    const mystery = mysteries[selectedMystery];
    const decadeIdx = currentBead.decade ?? 0;
    const mList = mystery.list[decadeIdx];
    content = (
      <>
        {mList && (
          <div className="mystery-header">
            <div className="mystery-tag">{mList.num} mistério · {mystery.name.replace('Mistérios ', '')}</div>
            <h2 className="mystery-title">{mList.title}</h2>
            <div className="mystery-ref">{mList.ref}</div>
            <p className="mystery-reflection">{mList.reflection}</p>
          </div>
        )}
        <PrayerBlock title="Pai-Nosso" text={prayers.paiNosso.text} />
      </>
    );
  } else if (currentBead.type === 'ave') {
    const mystery = mysteries[selectedMystery];
    const decadeIdx = currentBead.decade ?? 0;
    const idxInDec = currentBead.indexInDecade || 0;
    const isLast = idxInDec === 10;

    content = (
      <>
        <PrayerBlock title={`Ave-Maria ${idxInDec} de 10`} text={prayers.aveMaria.text} />
        {isLast && (
          <>
            <PrayerBlock title="Glória" text={prayers.gloria.text} />
            <PrayerBlock title="Oração de Fátima" text={prayers.fatima.text} />
            {decadeIdx === 4 && <PrayerBlock title="Salve Rainha" text={prayers.salveRainha.text} />}
          </>
        )}
      </>
    );
  }

  // Progresso da dezena
  const showProgress = currentBead.type === 'ave' && typeof currentBead.decade === 'number';
  const decadeIdx = currentBead.decade ?? 0;
  const idxInDec = currentBead.indexInDecade || 0;

  // Posição global
  const position = beads.findIndex(b => b.id === currentId);
  const total = beads.length;

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-eyebrow">Santo Terço {todayMystery && <span className="today-chip">{todayLabel} · {mysteries[todayMystery].name.replace('Mistérios ', '')}</span>}</div>
        <div className="panel-sub">
          {currentBead.label}
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
        <button className="nav-btn" onClick={onPrev} disabled={position === 0}>
          <span>←</span> Anterior
        </button>
        <div className="position">
          <span className="position-num">{position + 1}</span>
          <span className="position-sep">/</span>
          <span className="position-total">{total}</span>
        </div>
        <button className="nav-btn primary" onClick={onNext} disabled={position === total - 1}>
          Próxima <span>→</span>
        </button>
      </div>
      <button className="restart-btn" onClick={onRestart}>Recomeçar o terço</button>
    </div>
  );
}

function PrayerBlock({ title, text }) {
  return (
    <div className="prayer-block">
      <h3 className="prayer-title">{title}</h3>
      <p className="prayer-text">{text}</p>
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
