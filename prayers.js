// Orações completas em português
window.PRAYERS = {
  sinalCruz: {
    title: "Sinal da Cruz",
    text: "Em nome do Pai, e do Filho, e do Espírito Santo. Amém."
  },
  credo: {
    title: "Credo",
    text: "Creio em Deus Pai todo-poderoso, Criador do céu e da terra. E em Jesus Cristo, seu único Filho, nosso Senhor, que foi concebido pelo poder do Espírito Santo; nasceu da Virgem Maria; padeceu sob Pôncio Pilatos, foi crucificado, morto e sepultado. Desceu à mansão dos mortos; ressuscitou ao terceiro dia; subiu aos céus; está sentado à direita de Deus Pai todo-poderoso, donde há de vir a julgar os vivos e os mortos. Creio no Espírito Santo, na Santa Igreja Católica, na comunhão dos Santos, na remissão dos pecados, na ressurreição da carne, na vida eterna. Amém."
  },
  paiNosso: {
    title: "Pai-Nosso",
    text: "Pai nosso que estais nos céus, santificado seja o vosso nome; venha a nós o vosso reino; seja feita a vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas ofensas, assim como nós perdoamos a quem nos tem ofendido; e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém."
  },
  aveMaria: {
    title: "Ave-Maria",
    text: "Ave Maria, cheia de graça, o Senhor é convosco; bendita sois vós entre as mulheres, e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós, pecadores, agora e na hora da nossa morte. Amém."
  },
  gloria: {
    title: "Glória",
    text: "Glória ao Pai, e ao Filho, e ao Espírito Santo. Como era no princípio, agora e sempre. Amém."
  },
  fatima: {
    title: "Oração de Fátima",
    text: "Ó meu Jesus, perdoai-nos e livrai-nos do fogo do inferno; levai as almas todas para o céu, e socorrei principalmente as que mais precisarem da vossa misericórdia. Amém."
  },
  salveRainha: {
    title: "Salve Rainha",
    text: "Salve Rainha, Mãe de misericórdia, vida, doçura e esperança nossa, salve! A vós bradamos, os degredados filhos de Eva. A vós suspiramos, gemendo e chorando neste vale de lágrimas. Eia, pois, advogada nossa, esses vossos olhos misericordiosos a nós volvei. E, depois deste desterro, mostrai-nos Jesus, bendito fruto do vosso ventre. Ó clemente, ó piedosa, ó doce sempre Virgem Maria. Rogai por nós, Santa Mãe de Deus, para que sejamos dignos das promessas de Cristo. Amém."
  },
  ofertaInicial: {
    title: "Oferecimento",
    text: "Divino Jesus, eu vos ofereço este terço que vou rezar, contemplando os vossos mistérios. Dai-me, pela intercessão da Virgem Maria, as graças necessárias para bem meditá-los e o fruto que devo tirar deles. Amém."
  }
};

window.MYSTERIES = {
  gozosos: {
    name: "Mistérios Gozosos",
    days: "Segunda e Sábado",
    list: [
      { num: "1º", title: "A Anunciação do Anjo a Maria", ref: "Lc 1,26-38", reflection: "O Anjo Gabriel anuncia a Maria que ela será a Mãe do Filho de Deus. Contemplemos a humildade de Maria em seu 'fiat': Eis aqui a serva do Senhor." },
      { num: "2º", title: "A Visitação de Maria a sua prima Isabel", ref: "Lc 1,39-56", reflection: "Maria, grávida de Jesus, visita Isabel. Ao seu encontro, João Batista exulta no ventre materno. Peçamos o dom da caridade fraterna." },
      { num: "3º", title: "O Nascimento de Jesus em Belém", ref: "Lc 2,1-20", reflection: "Jesus nasce pobre numa manjedoura. O Rei dos reis escolhe a simplicidade. Contemplemos a pobreza evangélica." },
      { num: "4º", title: "A Apresentação do Menino Jesus no Templo", ref: "Lc 2,22-38", reflection: "Maria e José apresentam Jesus no Templo. Simeão o reconhece como luz para iluminar as nações. Ofereçamos nossas vidas a Deus." },
      { num: "5º", title: "O Encontro do Menino Jesus no Templo", ref: "Lc 2,41-52", reflection: "Perdido e reencontrado entre os doutores, Jesus responde: 'Eu devia estar nas coisas de meu Pai.' Busquemos a vontade de Deus." }
    ]
  },
  luminosos: {
    name: "Mistérios Luminosos",
    days: "Quinta-feira",
    list: [
      { num: "1º", title: "O Batismo de Jesus no Rio Jordão", ref: "Mt 3,13-17", reflection: "Jesus é batizado por João. Uma voz do céu proclama: 'Este é o meu Filho amado.' Renovemos as promessas do nosso batismo." },
      { num: "2º", title: "A Auto-revelação de Jesus nas Bodas de Caná", ref: "Jo 2,1-12", reflection: "A pedido de Maria, Jesus transforma a água em vinho. Confiemos na intercessão de Nossa Senhora." },
      { num: "3º", title: "O Anúncio do Reino de Deus", ref: "Mc 1,14-15", reflection: "Jesus proclama: 'Convertei-vos e crede no Evangelho.' Acolhamos seu chamado à conversão." },
      { num: "4º", title: "A Transfiguração de Jesus no Monte Tabor", ref: "Mt 17,1-8", reflection: "Jesus se transfigura em glória diante de Pedro, Tiago e João. Antecipação da ressurreição. Busquemos a luz de Cristo." },
      { num: "5º", title: "A Instituição da Eucaristia", ref: "Mt 26,26-28", reflection: "Na Última Ceia, Jesus dá-nos seu Corpo e Sangue. Memorial supremo do amor. Vivamos da Eucaristia." }
    ]
  },
  dolorosos: {
    name: "Mistérios Dolorosos",
    days: "Terça e Sexta",
    list: [
      { num: "1º", title: "A Agonia de Jesus no Horto das Oliveiras", ref: "Lc 22,39-46", reflection: "Jesus sua sangue antecipando sua Paixão. 'Não se faça a minha, mas a tua vontade.' Aprendamos a obediência." },
      { num: "2º", title: "A Flagelação de Jesus", ref: "Jo 19,1", reflection: "Jesus é cruelmente açoitado. Suas chagas nos curaram. Peçamos a graça da penitência." },
      { num: "3º", title: "A Coroação de Espinhos", ref: "Mt 27,27-31", reflection: "Jesus é coroado de espinhos e humilhado. Rei do universo escarnecido por nós. Ofereçamos nossas humilhações." },
      { num: "4º", title: "Jesus carrega a Cruz até o Calvário", ref: "Jo 19,17", reflection: "Jesus sobe o Calvário com o peso da cruz. Tomemos nossa cruz de cada dia e sigamos seus passos." },
      { num: "5º", title: "A Crucificação e Morte de Jesus", ref: "Jo 19,25-30", reflection: "Jesus morre na cruz pela nossa salvação. Entrega-nos sua Mãe: 'Eis aí tua mãe.' Contemplemos o amor redentor." }
    ]
  },
  gloriosos: {
    name: "Mistérios Gloriosos",
    days: "Quarta e Domingo",
    list: [
      { num: "1º", title: "A Ressurreição de Jesus", ref: "Mc 16,1-8", reflection: "Ao terceiro dia, Jesus ressuscita vitorioso sobre a morte. Vivamos a alegria pascal." },
      { num: "2º", title: "A Ascensão de Jesus ao Céu", ref: "At 1,6-11", reflection: "Jesus sobe ao céu e senta-se à direita do Pai. Nossa pátria é o Céu. Caminhemos para o alto." },
      { num: "3º", title: "A Vinda do Espírito Santo sobre os Apóstolos", ref: "At 2,1-13", reflection: "O Espírito Santo desce em línguas de fogo. Peçamos seus dons para sermos testemunhas de Cristo." },
      { num: "4º", title: "A Assunção de Maria ao Céu", ref: "Ap 12,1", reflection: "Maria é elevada ao céu em corpo e alma. Aurora da nossa esperança. Sigamos seu exemplo de fidelidade." },
      { num: "5º", title: "A Coroação de Maria como Rainha do Céu e da Terra", ref: "Ap 12,1", reflection: "Maria é coroada Rainha de todas as criaturas. Consagremo-nos a ela como filhos devotos." }
    ]
  }
};
