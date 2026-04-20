// Layout em formato de lágrima tradicional (ref. imagem)
// Topo arredondado largo, afinando nos ombros até a medalha, depois pendente reto.
// Total: crucifixo + 1 Pai-Nosso + 3 Ave-Marias + medalha + 55 contas (5 dezenas)

window.buildBeads = function() {
  const beads = [];
  const cx = 500;

  // ---- Crucifixo (bem ao fundo) ----
  beads.push({ id: 0, type: 'cross', x: cx, y: 1000, label: 'Sinal da Cruz + Credo' });

  // ---- Pendente (Credo→PN→3AM→Gloria→Medalha) reto, subindo ----
  // Ordem: 1 Pai-Nosso, 3 Ave-Marias (vão mostrar Glória ao passar a medalha)
  beads.push({ id: 1, type: 'pater', x: cx, y: 930, label: 'Pai-Nosso' });
  beads.push({ id: 2, type: 'ave', x: cx, y: 885, label: 'Ave-Maria (Fé)' });
  beads.push({ id: 3, type: 'ave', x: cx, y: 850, label: 'Ave-Maria (Esperança)' });
  beads.push({ id: 4, type: 'ave', x: cx, y: 815, label: 'Ave-Maria (Caridade)' });

  // ---- Medalha (base da lágrima) ----
  const medalY = 740;
  beads.push({ id: 5, type: 'medal', x: cx, y: medalY, label: 'Medalha · Glória' });

  // ---- Círculo/lágrima com 55 contas ----
  // Formato: sai da medalha para esquerda/direita em linha inclinada, sobe, arredonda no topo.
  // Usamos uma curva paramétrica tipo lágrima (teardrop).
  // Parametrização: t ∈ [0, 2π]
  //   x = cx + A * sin(t)
  //   y = topY + H * (1 - cos(t)) / 2   (0 no topo, H na base)
  // Ajustada para afinar na base (forma de pera/lágrima) usando um fator.
  //
  // Vou usar fórmula custom:
  //   Para t ∈ [0, 2π], começando e terminando na medalha (base).
  //   width(t) = sin(t)
  //   height(t) = (1 - cos(t))/2
  //   afinamos nos ombros e base multiplicando width por (1 - cos(t))/2 (suaviza pontas)

  const totalCircleBeads = 55;
  const beadSequence = [];
  for (let d = 0; d < 5; d++) {
    beadSequence.push('pater');
    for (let a = 0; a < 10; a++) beadSequence.push('ave');
  }

  // largura máxima ~280, altura do círculo ~620 (vai de medalY - 620 até medalY)
  const W = 320; // half-width máxima
  const H = 660; // altura do teardrop

  // Percorrer t começando e terminando na medalha.
  // Começamos em t=0 (base, ligeiramente à direita da medalha),
  // subimos pela direita até t=π (topo), descemos pela esquerda até t=2π (base).
  // Mas queremos que a 1ª dezena suba pela DIREITA (padrão).

  let idCounter = 6;
  let currentDecade = 0;

  // Deixamos folga pra não colar as primeiras/últimas contas na medalha
  // Folga maior perto da medalha para que as primeiras/últimas contas
  // da lágrima não se amontoem com o pendente nem umas com as outras.
  const tStart = 0.42;
  const tEnd = 2 * Math.PI - 0.42;
  const step = (tEnd - tStart) / (totalCircleBeads - 1);

  // Função do formato de lágrima (parametriza suavemente)
  function teardrop(t) {
    // normaliza t para [0, 2π]
    // O topo está em t = π
    // Largura: sin(t) dá +1 em π/2 (direita), -1 em 3π/2 (esquerda), 0 nas pontas.
    // Altura: (1 - cos(t))/2 → 0 em t=0 e t=2π, 1 em t=π.
    const w = Math.sin(t);
    const h = (1 - Math.cos(t)) / 2;
    // Afinamos nos ombros (perto da medalha) multiplicando w por h^0.6 (afinar em baixo)
    const taper = Math.pow(h, 0.45);
    return {
      x: cx + W * w * taper,
      y: medalY - H * h
    };
  }

  for (let i = 0; i < totalCircleBeads; i++) {
    const t = tStart + i * step;
    const { x, y } = teardrop(t);
    const type = beadSequence[i];
    let label;
    if (type === 'pater') {
      currentDecade = Math.floor(i / 11);
      label = `Pai-Nosso — ${currentDecade + 1}ª dezena`;
    } else {
      const localIdx = (i % 11);
      label = `Ave-Maria ${localIdx}/10 — ${currentDecade + 1}ª dezena`;
    }
    beads.push({
      id: idCounter++,
      type,
      x, y,
      label,
      decade: currentDecade,
      indexInDecade: (type === 'ave' ? (i % 11) : 0)
    });
  }

  return beads;
};
