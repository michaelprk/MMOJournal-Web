import React, { useState, useEffect } from 'react';
import type { PokemonBuild } from '../types/pokemon';
import { getItemSpriteUrls } from '../utils/item-sprites';
import { TIER_COLORS } from '../types/pokemon';

interface PokemonBuildCardProps {
  build: PokemonBuild;
  onEdit?: (build: PokemonBuild) => void;
  onDelete?: (id: string) => void;
  onExport?: (build: PokemonBuild) => void;
}

// Move type colors for moves
const MOVE_TYPE_COLORS: Record<string, { background: string; text: string }> = {
  normal: { background: 'linear-gradient(135deg, #C8C8C8, #E8E8E8)', text: '#000' },
  fire: { background: 'linear-gradient(135deg, #F08030, #F5AC78)', text: '#000' },
  water: { background: 'linear-gradient(135deg, #6890F0, #9DB7F5)', text: '#000' },
  electric: { background: 'linear-gradient(135deg, #F8D030, #F5E078)', text: '#000' },
  grass: { background: 'linear-gradient(135deg, #78C850, #A7DB8D)', text: '#000' },
  ice: { background: 'linear-gradient(135deg, #98D8D8, #BCE6E6)', text: '#000' },
  fighting: { background: 'linear-gradient(135deg, #C03028, #D67873)', text: '#fff' },
  poison: { background: 'linear-gradient(135deg, #A040A0, #C183C1)', text: '#fff' },
  ground: { background: 'linear-gradient(135deg, #E0C068, #EBD69D)', text: '#000' },
  flying: { background: 'linear-gradient(135deg, #A890F0, #C6B7F5)', text: '#000' },
  psychic: { background: 'linear-gradient(135deg, #F85888, #FA92B2)', text: '#000' },
  bug: { background: 'linear-gradient(135deg, #A8B820, #C6D16E)', text: '#000' },
  rock: { background: 'linear-gradient(135deg, #B8A038, #D1C17D)', text: '#000' },
  ghost: { background: 'linear-gradient(135deg, #705898, #A292BC)', text: '#fff' },
  dragon: { background: 'linear-gradient(135deg, #7038F8, #A27DFA)', text: '#fff' },
  dark: { background: 'linear-gradient(135deg, #705848, #A29288)', text: '#fff' },
  steel: { background: 'linear-gradient(135deg, #B8B8D0, #D1D1E0)', text: '#000' },
  fairy: { background: 'linear-gradient(135deg, #EE99AC, #F4BDC9)', text: '#000' },
};

// Gender Icon Component
function GenderIcon({ gender }: { gender?: 'M' | 'F' | 'U' }) {
  if (!gender) return null;
  
  const getGenderDisplay = () => {
    switch (gender) {
      case 'M':
        return { icon: '♂', color: '#6890F0', title: 'Male' };
      case 'F':
        return { icon: '♀', color: '#F85888', title: 'Female' };
      case 'U':
        return { icon: '◯', color: '#A8A8A8', title: 'Genderless' };
      default:
        return null;
    }
  };
  
  const genderDisplay = getGenderDisplay();
  if (!genderDisplay) return null;
  
  return (
    <span
      title={genderDisplay.title}
      style={{
        color: genderDisplay.color,
        fontSize: '1.1rem',
        fontWeight: 'bold',
        marginLeft: '6px',
        textShadow: '0 1px 2px rgba(0,0,0,0.8)',
      }}
    >
      {genderDisplay.icon}
    </span>
  );
}

// Item Image Component with comprehensive fallback
function ItemImage({ itemName, className, style }: { itemName: string; className?: string; style?: React.CSSProperties }) {
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const itemUrls = getItemSpriteUrls(itemName);

  const handleImageError = () => {
    if (currentUrlIndex < itemUrls.length - 1) {
      setCurrentUrlIndex(currentUrlIndex + 1);
    }
  };

  // Reset to first URL when item changes
  useEffect(() => {
    setCurrentUrlIndex(0);
  }, [itemName]);

  if (!itemName || itemUrls.length === 0) {
    return null;
  }

  return (
    <img
      src={itemUrls[currentUrlIndex]}
      alt={itemName}
      className={className}
      style={style}
      onError={handleImageError}
    />
  );
}

// Enhanced Pokemon type mapping for Gen 1-5 with accurate Gen 5 typing (no Fairy type)
const POKEMON_TYPE_MAPPING: Record<string, string[]> = {
  // Gen 1
  'bulbasaur': ['grass', 'poison'], 'ivysaur': ['grass', 'poison'], 'venusaur': ['grass', 'poison'],
  'charmander': ['fire'], 'charmeleon': ['fire'], 'charizard': ['fire', 'flying'],
  'squirtle': ['water'], 'wartortle': ['water'], 'blastoise': ['water'],
  'caterpie': ['bug'], 'metapod': ['bug'], 'butterfree': ['bug', 'flying'],
  'weedle': ['bug', 'poison'], 'kakuna': ['bug', 'poison'], 'beedrill': ['bug', 'poison'],
  'pidgey': ['normal', 'flying'], 'pidgeotto': ['normal', 'flying'], 'pidgeot': ['normal', 'flying'],
  'rattata': ['normal'], 'raticate': ['normal'],
  'spearow': ['normal', 'flying'], 'fearow': ['normal', 'flying'],
  'ekans': ['poison'], 'arbok': ['poison'],
  'pikachu': ['electric'], 'raichu': ['electric'],
  'sandshrew': ['ground'], 'sandslash': ['ground'],
  'nidoran-f': ['poison'], 'nidorina': ['poison'], 'nidoqueen': ['poison', 'ground'],
  'nidoran-m': ['poison'], 'nidorino': ['poison'], 'nidoking': ['poison', 'ground'],
  'clefairy': ['normal'], 'clefable': ['normal'],
  'vulpix': ['fire'], 'ninetales': ['fire'],
  'jigglypuff': ['normal'], 'wigglytuff': ['normal'],
  'zubat': ['poison', 'flying'], 'golbat': ['poison', 'flying'],
  'oddish': ['grass', 'poison'], 'gloom': ['grass', 'poison'], 'vileplume': ['grass', 'poison'],
  'paras': ['bug', 'grass'], 'parasect': ['bug', 'grass'],
  'venonat': ['bug', 'poison'], 'venomoth': ['bug', 'poison'],
  'diglett': ['ground'], 'dugtrio': ['ground'],
  'meowth': ['normal'], 'persian': ['normal'],
  'psyduck': ['water'], 'golduck': ['water'],
  'mankey': ['fighting'], 'primeape': ['fighting'],
  'growlithe': ['fire'], 'arcanine': ['fire'],
  'poliwag': ['water'], 'poliwhirl': ['water'], 'poliwrath': ['water', 'fighting'],
  'abra': ['psychic'], 'kadabra': ['psychic'], 'alakazam': ['psychic'],
  'machop': ['fighting'], 'machoke': ['fighting'], 'machamp': ['fighting'],
  'bellsprout': ['grass', 'poison'], 'weepinbell': ['grass', 'poison'], 'victreebel': ['grass', 'poison'],
  'tentacool': ['water', 'poison'], 'tentacruel': ['water', 'poison'],
  'geodude': ['rock', 'ground'], 'graveler': ['rock', 'ground'], 'golem': ['rock', 'ground'],
  'ponyta': ['fire'], 'rapidash': ['fire'],
  'slowpoke': ['water', 'psychic'], 'slowbro': ['water', 'psychic'],
  'magnemite': ['electric', 'steel'], 'magneton': ['electric', 'steel'],
  'farfetchd': ['normal', 'flying'],
  'doduo': ['normal', 'flying'], 'dodrio': ['normal', 'flying'],
  'seel': ['water'], 'dewgong': ['water', 'ice'],
  'grimer': ['poison'], 'muk': ['poison'],
  'shellder': ['water'], 'cloyster': ['water', 'ice'],
  'gastly': ['ghost', 'poison'], 'haunter': ['ghost', 'poison'], 'gengar': ['ghost', 'poison'],
  'onix': ['rock', 'ground'],
  'drowzee': ['psychic'], 'hypno': ['psychic'],
  'krabby': ['water'], 'kingler': ['water'],
  'voltorb': ['electric'], 'electrode': ['electric'],
  'exeggcute': ['grass', 'psychic'], 'exeggutor': ['grass', 'psychic'],
  'cubone': ['ground'], 'marowak': ['ground'],
  'hitmonlee': ['fighting'], 'hitmonchan': ['fighting'],
  'lickitung': ['normal'],
  'koffing': ['poison'], 'weezing': ['poison'],
  'rhyhorn': ['ground', 'rock'], 'rhydon': ['ground', 'rock'],
  'chansey': ['normal'],
  'tangela': ['grass'],
  'kangaskhan': ['normal'],
  'horsea': ['water'], 'seadra': ['water'],
  'goldeen': ['water'], 'seaking': ['water'],
  'staryu': ['water'], 'starmie': ['water', 'psychic'],
  'mr-mime': ['psychic'], 'mrmime': ['psychic'],
  'scyther': ['bug', 'flying'],
  'jynx': ['ice', 'psychic'],
  'electabuzz': ['electric'],
  'magmar': ['fire'],
  'pinsir': ['bug'],
  'tauros': ['normal'],
  'magikarp': ['water'], 'gyarados': ['water', 'flying'],
  'lapras': ['water', 'ice'],
  'ditto': ['normal'],
  'eevee': ['normal'],
  'vaporeon': ['water'], 'jolteon': ['electric'], 'flareon': ['fire'],
  'porygon': ['normal'],
  'omanyte': ['rock', 'water'], 'omastar': ['rock', 'water'],
  'kabuto': ['rock', 'water'], 'kabutops': ['rock', 'water'],
  'aerodactyl': ['rock', 'flying'],
  'snorlax': ['normal'],
  'articuno': ['ice', 'flying'], 'zapdos': ['electric', 'flying'], 'moltres': ['fire', 'flying'],
  'dratini': ['dragon'], 'dragonair': ['dragon'], 'dragonite': ['dragon', 'flying'],
  'mewtwo': ['psychic'], 'mew': ['psychic'],

  // Gen 2
  'chikorita': ['grass'], 'bayleef': ['grass'], 'meganium': ['grass'],
  'cyndaquil': ['fire'], 'quilava': ['fire'], 'typhlosion': ['fire'],
  'totodile': ['water'], 'croconaw': ['water'], 'feraligatr': ['water'],
  'sentret': ['normal'], 'furret': ['normal'],
  'hoothoot': ['normal', 'flying'], 'noctowl': ['normal', 'flying'],
  'ledyba': ['bug', 'flying'], 'ledian': ['bug', 'flying'],
  'spinarak': ['bug', 'poison'], 'ariados': ['bug', 'poison'],
  'crobat': ['poison', 'flying'],
  'chinchou': ['water', 'electric'], 'lanturn': ['water', 'electric'],
  'pichu': ['electric'],
  'cleffa': ['normal'],
  'igglybuff': ['normal'],
  'togepi': ['normal'], 'togetic': ['normal', 'flying'],
  'natu': ['psychic', 'flying'], 'xatu': ['psychic', 'flying'],
  'mareep': ['electric'], 'flaaffy': ['electric'], 'ampharos': ['electric'],
  'bellossom': ['grass'],
  'marill': ['water'], 'azumarill': ['water'],
  'sudowoodo': ['rock'],
  'politoed': ['water'],
  'hoppip': ['grass', 'flying'], 'skiploom': ['grass', 'flying'], 'jumpluff': ['grass', 'flying'],
  'aipom': ['normal'],
  'sunkern': ['grass'], 'sunflora': ['grass'],
  'yanma': ['bug', 'flying'],
  'wooper': ['water', 'ground'], 'quagsire': ['water', 'ground'],
  'espeon': ['psychic'], 'umbreon': ['dark'],
  'murkrow': ['dark', 'flying'],
  'slowking': ['water', 'psychic'],
  'misdreavus': ['ghost'],
  'unown': ['psychic'],
  'wobbuffet': ['psychic'],
  'girafarig': ['normal', 'psychic'],
  'pineco': ['bug'], 'forretress': ['bug', 'steel'],
  'dunsparce': ['normal'],
  'gligar': ['ground', 'flying'],
  'steelix': ['steel', 'ground'],
  'snubbull': ['normal'], 'granbull': ['normal'],
  'qwilfish': ['water', 'poison'],
  'scizor': ['bug', 'steel'],
  'shuckle': ['bug', 'rock'],
  'heracross': ['bug', 'fighting'],
  'sneasel': ['dark', 'ice'],
  'teddiursa': ['normal'], 'ursaring': ['normal'],
  'slugma': ['fire'], 'magcargo': ['fire', 'rock'],
  'swinub': ['ice', 'ground'], 'piloswine': ['ice', 'ground'],
  'corsola': ['water', 'rock'],
  'remoraid': ['water'], 'octillery': ['water'],
  'delibird': ['ice', 'flying'],
  'mantine': ['water', 'flying'],
  'skarmory': ['steel', 'flying'],
  'houndour': ['dark', 'fire'], 'houndoom': ['dark', 'fire'],
  'kingdra': ['water', 'dragon'],
  'phanpy': ['ground'], 'donphan': ['ground'],
  'porygon2': ['normal'],
  'stantler': ['normal'],
  'smeargle': ['normal'],
  'tyrogue': ['fighting'],
  'hitmontop': ['fighting'],
  'smoochum': ['ice', 'psychic'],
  'elekid': ['electric'],
  'magby': ['fire'],
  'miltank': ['normal'],
  'blissey': ['normal'],
  'raikou': ['electric'], 'entei': ['fire'], 'suicune': ['water'],
  'larvitar': ['rock', 'ground'], 'pupitar': ['rock', 'ground'], 'tyranitar': ['rock', 'dark'],
  'lugia': ['psychic', 'flying'], 'ho-oh': ['fire', 'flying'], 'celebi': ['psychic', 'grass'],

  // Gen 3
  'treecko': ['grass'], 'grovyle': ['grass'], 'sceptile': ['grass'],
  'torchic': ['fire'], 'combusken': ['fire', 'fighting'], 'blaziken': ['fire', 'fighting'],
  'mudkip': ['water'], 'marshtomp': ['water', 'ground'], 'swampert': ['water', 'ground'],
  'poochyena': ['dark'], 'mightyena': ['dark'],
  'zigzagoon': ['normal'], 'linoone': ['normal'],
  'wurmple': ['bug'], 'silcoon': ['bug'], 'beautifly': ['bug', 'flying'], 'cascoon': ['bug'], 'dustox': ['bug', 'poison'],
  'lotad': ['water', 'grass'], 'lombre': ['water', 'grass'], 'ludicolo': ['water', 'grass'],
  'seedot': ['grass'], 'nuzleaf': ['grass', 'dark'], 'shiftry': ['grass', 'dark'],
  'taillow': ['normal', 'flying'], 'swellow': ['normal', 'flying'],
  'wingull': ['water', 'flying'], 'pelipper': ['water', 'flying'],
  'ralts': ['psychic'], 'kirlia': ['psychic'], 'gardevoir': ['psychic'],
  'surskit': ['bug', 'water'], 'masquerain': ['bug', 'flying'],
  'shroomish': ['grass'], 'breloom': ['grass', 'fighting'],
  'slakoth': ['normal'], 'vigoroth': ['normal'], 'slaking': ['normal'],
  'nincada': ['bug', 'ground'], 'ninjask': ['bug', 'flying'], 'shedinja': ['bug', 'ghost'],
  'whismur': ['normal'], 'loudred': ['normal'], 'exploud': ['normal'],
  'makuhita': ['fighting'], 'hariyama': ['fighting'],
  'azurill': ['normal'],
  'nosepass': ['rock'],
  'skitty': ['normal'], 'delcatty': ['normal'],
  'sableye': ['dark', 'ghost'],
  'mawile': ['steel'],
  'aron': ['steel', 'rock'], 'lairon': ['steel', 'rock'], 'aggron': ['steel'],
  'meditite': ['fighting', 'psychic'], 'medicham': ['fighting', 'psychic'],
  'electrike': ['electric'], 'manectric': ['electric'],
  'plusle': ['electric'], 'minun': ['electric'],
  'volbeat': ['bug'], 'illumise': ['bug'],
  'roselia': ['grass', 'poison'],
  'gulpin': ['poison'], 'swalot': ['poison'],
  'carvanha': ['water', 'dark'], 'sharpedo': ['water', 'dark'],
  'wailmer': ['water'], 'wailord': ['water'],
  'numel': ['fire', 'ground'], 'camerupt': ['fire', 'ground'],
  'torkoal': ['fire'],
  'spoink': ['psychic'], 'grumpig': ['psychic'],
  'spinda': ['normal'],
  'trapinch': ['ground'], 'vibrava': ['ground', 'dragon'], 'flygon': ['ground', 'dragon'],
  'cacnea': ['grass'], 'cacturne': ['grass', 'dark'],
  'swablu': ['normal', 'flying'], 'altaria': ['dragon', 'flying'],
  'zangoose': ['normal'],
  'seviper': ['poison'],
  'lunatone': ['rock', 'psychic'], 'solrock': ['rock', 'psychic'],
  'barboach': ['water', 'ground'], 'whiscash': ['water', 'ground'],
  'corphish': ['water'], 'crawdaunt': ['water', 'dark'],
  'baltoy': ['ground', 'psychic'], 'claydol': ['ground', 'psychic'],
  'lileep': ['rock', 'grass'], 'cradily': ['rock', 'grass'],
  'anorith': ['rock', 'bug'], 'armaldo': ['rock', 'bug'],
  'feebas': ['water'], 'milotic': ['water'],
  'castform': ['normal'],
  'kecleon': ['normal'],
  'shuppet': ['ghost'], 'banette': ['ghost'],
  'duskull': ['ghost'], 'dusclops': ['ghost'],
  'tropius': ['grass', 'flying'],
  'chimecho': ['psychic'],
  'absol': ['dark'],
  'wynaut': ['psychic'],
  'snorunt': ['ice'], 'glalie': ['ice'],
  'spheal': ['ice', 'water'], 'sealeo': ['ice', 'water'], 'walrein': ['ice', 'water'],
  'clamperl': ['water'], 'huntail': ['water'], 'gorebyss': ['water'],
  'relicanth': ['water', 'rock'],
  'luvdisc': ['water'],
  'bagon': ['dragon'], 'shelgon': ['dragon'], 'salamence': ['dragon', 'flying'],
  'beldum': ['steel', 'psychic'], 'metang': ['steel', 'psychic'], 'metagross': ['steel', 'psychic'],
  'regirock': ['rock'], 'regice': ['ice'], 'registeel': ['steel'],
  'latias': ['dragon', 'psychic'], 'latios': ['dragon', 'psychic'],
  'kyogre': ['water'], 'groudon': ['ground'], 'rayquaza': ['dragon', 'flying'],
  'jirachi': ['steel', 'psychic'], 'deoxys': ['psychic'],

  // Gen 4
  'turtwig': ['grass'], 'grotle': ['grass'], 'torterra': ['grass', 'ground'],
  'chimchar': ['fire'], 'monferno': ['fire', 'fighting'], 'infernape': ['fire', 'fighting'],
  'piplup': ['water'], 'prinplup': ['water'], 'empoleon': ['water', 'steel'],
  'starly': ['normal', 'flying'], 'staravia': ['normal', 'flying'], 'staraptor': ['normal', 'flying'],
  'bidoof': ['normal'], 'bibarel': ['normal', 'water'],
  'kricketot': ['bug'], 'kricketune': ['bug'],
  'shinx': ['electric'], 'luxio': ['electric'], 'luxray': ['electric'],
  'budew': ['grass', 'poison'], 'roserade': ['grass', 'poison'],
  'cranidos': ['rock'], 'rampardos': ['rock'],
  'shieldon': ['rock', 'steel'], 'bastiodon': ['rock', 'steel'],
  'burmy': ['bug'], 'wormadam': ['bug', 'grass'], 'mothim': ['bug', 'flying'],
  'combee': ['bug', 'flying'], 'vespiquen': ['bug', 'flying'],
  'pachirisu': ['electric'],
  'buizel': ['water'], 'floatzel': ['water'],
  'cherubi': ['grass'], 'cherrim': ['grass'],
  'shellos': ['water'], 'gastrodon': ['water', 'ground'],
  'ambipom': ['normal'],
  'drifloon': ['ghost', 'flying'], 'drifblim': ['ghost', 'flying'],
  'buneary': ['normal'], 'lopunny': ['normal'],
  'mismagius': ['ghost'],
  'honchkrow': ['dark', 'flying'],
  'glameow': ['normal'], 'purugly': ['normal'],
  'chingling': ['psychic'],
  'stunky': ['poison', 'dark'], 'skuntank': ['poison', 'dark'],
  'bronzor': ['steel', 'psychic'], 'bronzong': ['steel', 'psychic'],
  'bonsly': ['rock'],
  'mime-jr': ['psychic'],
  'happiny': ['normal'],
  'chatot': ['normal', 'flying'],
  'spiritomb': ['ghost', 'dark'],
  'gible': ['dragon', 'ground'], 'gabite': ['dragon', 'ground'], 'garchomp': ['dragon', 'ground'],
  'munchlax': ['normal'],
  'riolu': ['fighting'], 'lucario': ['fighting', 'steel'],
  'hippopotas': ['ground'], 'hippowdon': ['ground'],
  'skorupi': ['poison', 'bug'], 'drapion': ['poison', 'dark'],
  'croagunk': ['poison', 'fighting'], 'toxicroak': ['poison', 'fighting'],
  'carnivine': ['grass'],
  'finneon': ['water'], 'lumineon': ['water'],
  'mantyke': ['water', 'flying'],
  'snover': ['grass', 'ice'], 'abomasnow': ['grass', 'ice'],
  'weavile': ['dark', 'ice'],
  'magnezone': ['electric', 'steel'],
  'lickilicky': ['normal'],
  'rhyperior': ['ground', 'rock'],
  'tangrowth': ['grass'],
  'electivire': ['electric'],
  'magmortar': ['fire'],
  'togekiss': ['normal', 'flying'],
  'yanmega': ['bug', 'flying'],
  'leafeon': ['grass'], 'glaceon': ['ice'],
  'gliscor': ['ground', 'flying'],
  'mamoswine': ['ice', 'ground'],
  'porygon-z': ['normal'],
  'gallade': ['psychic', 'fighting'],
  'probopass': ['rock', 'steel'],
  'dusknoir': ['ghost'],
  'froslass': ['ice', 'ghost'],
  'dialga': ['steel', 'dragon'], 'palkia': ['water', 'dragon'], 'heatran': ['fire', 'steel'],
  'regigigas': ['normal'], 'giratina': ['ghost', 'dragon'],
  'cresselia': ['psychic'], 'phione': ['water'], 'manaphy': ['water'],
  'darkrai': ['dark'], 'shaymin': ['grass'], 'arceus': ['normal'],

  // Gen 5
  'victini': ['psychic', 'fire'],
  'snivy': ['grass'], 'servine': ['grass'], 'serperior': ['grass'],
  'tepig': ['fire'], 'pignite': ['fire', 'fighting'], 'emboar': ['fire', 'fighting'],
  'oshawott': ['water'], 'dewott': ['water'], 'samurott': ['water'],
  'patrat': ['normal'], 'watchog': ['normal'],
  'lillipup': ['normal'], 'herdier': ['normal'], 'stoutland': ['normal'],
  'purrloin': ['dark'], 'liepard': ['dark'],
  'pansage': ['grass'], 'simisage': ['grass'],
  'pansear': ['fire'], 'simisear': ['fire'],
  'panpour': ['water'], 'simipour': ['water'],
  'munna': ['psychic'], 'musharna': ['psychic'],
  'pidove': ['normal', 'flying'], 'tranquill': ['normal', 'flying'], 'unfezant': ['normal', 'flying'],
  'blitzle': ['electric'], 'zebstrika': ['electric'],
  'roggenrola': ['rock'], 'boldore': ['rock'], 'gigalith': ['rock'],
  'woobat': ['psychic', 'flying'], 'swoobat': ['psychic', 'flying'],
  'drilbur': ['ground'], 'excadrill': ['ground', 'steel'],
  'audino': ['normal'],
  'timburr': ['fighting'], 'gurdurr': ['fighting'], 'conkeldurr': ['fighting'],
  'tympole': ['water'], 'palpitoad': ['water', 'ground'], 'seismitoad': ['water', 'ground'],
  'throh': ['fighting'], 'sawk': ['fighting'],
  'sewaddle': ['bug', 'grass'], 'swadloon': ['bug', 'grass'], 'leavanny': ['bug', 'grass'],
  'venipede': ['bug', 'poison'], 'whirlipede': ['bug', 'poison'], 'scolipede': ['bug', 'poison'],
  'cottonee': ['grass'], 'whimsicott': ['grass'],
  'petilil': ['grass'], 'lilligant': ['grass'],
  'basculin': ['water'],
  'sandile': ['ground', 'dark'], 'krokorok': ['ground', 'dark'], 'krookodile': ['ground', 'dark'],
  'darumaka': ['fire'], 'darmanitan': ['fire'],
  'maractus': ['grass'],
  'dwebble': ['bug', 'rock'], 'crustle': ['bug', 'rock'],
  'scraggy': ['dark', 'fighting'], 'scrafty': ['dark', 'fighting'],
  'sigilyph': ['psychic', 'flying'],
  'yamask': ['ghost'], 'cofagrigus': ['ghost'],
  'tirtouga': ['water', 'rock'], 'carracosta': ['water', 'rock'],
  'archen': ['rock', 'flying'], 'archeops': ['rock', 'flying'],
  'trubbish': ['poison'], 'garbodor': ['poison'],
  'zorua': ['dark'], 'zoroark': ['dark'],
  'minccino': ['normal'], 'cinccino': ['normal'],
  'gothita': ['psychic'], 'gothorita': ['psychic'], 'gothitelle': ['psychic'],
  'solosis': ['psychic'], 'duosion': ['psychic'], 'reuniclus': ['psychic'],
  'ducklett': ['water', 'flying'], 'swanna': ['water', 'flying'],
  'vanillite': ['ice'], 'vanillish': ['ice'], 'vanilluxe': ['ice'],
  'deerling': ['normal', 'grass'], 'sawsbuck': ['normal', 'grass'],
  'emolga': ['electric', 'flying'],
  'karrablast': ['bug'], 'escavalier': ['bug', 'steel'],
  'foongus': ['grass', 'poison'], 'amoonguss': ['grass', 'poison'],
  'frillish': ['water', 'ghost'], 'jellicent': ['water', 'ghost'],
  'alomomola': ['water'],
  'joltik': ['bug', 'electric'], 'galvantula': ['bug', 'electric'],
  'ferroseed': ['grass', 'steel'], 'ferrothorn': ['grass', 'steel'],
  'klink': ['steel'], 'klang': ['steel'], 'klinklang': ['steel'],
  'tynamo': ['electric'], 'eelektrik': ['electric'], 'eelektross': ['electric'],
  'elgyem': ['psychic'], 'beheeyem': ['psychic'],
  'litwick': ['ghost', 'fire'], 'lampent': ['ghost', 'fire'], 'chandelure': ['ghost', 'fire'],
  'axew': ['dragon'], 'fraxure': ['dragon'], 'haxorus': ['dragon'],
  'cubchoo': ['ice'], 'beartic': ['ice'],
  'cryogonal': ['ice'],
  'shelmet': ['bug'], 'accelgor': ['bug'],
  'stunfisk': ['ground', 'electric'],
  'mienfoo': ['fighting'], 'mienshao': ['fighting'],
  'druddigon': ['dragon'],
  'golett': ['ground', 'ghost'], 'golurk': ['ground', 'ghost'],
  'pawniard': ['dark', 'steel'], 'bisharp': ['dark', 'steel'],
  'bouffalant': ['normal'],
  'rufflet': ['normal', 'flying'], 'braviary': ['normal', 'flying'],
  'vullaby': ['dark', 'flying'], 'mandibuzz': ['dark', 'flying'],
  'heatmor': ['fire'],
  'durant': ['bug', 'steel'],
  'deino': ['dark', 'dragon'], 'zweilous': ['dark', 'dragon'], 'hydreigon': ['dark', 'dragon'],
  'larvesta': ['bug', 'fire'], 'volcarona': ['bug', 'fire'],
  'cobalion': ['steel', 'fighting'], 'terrakion': ['rock', 'fighting'], 'virizion': ['grass', 'fighting'],
  'tornadus': ['flying'], 'thundurus': ['electric', 'flying'],
  'reshiram': ['dragon', 'fire'], 'zekrom': ['dragon', 'electric'],
  'landorus': ['ground', 'flying'], 'kyurem': ['dragon', 'ice'],
  'keldeo': ['water', 'fighting'], 'meloetta': ['normal', 'psychic'], 'genesect': ['bug', 'steel'],

  // Rotom forms
  'rotom': ['electric', 'ghost'],
  'rotom-heat': ['electric', 'fire'],
  'rotom-wash': ['electric', 'water'],
  'rotom-frost': ['electric', 'ice'],
  'rotom-fan': ['electric', 'flying'],
  'rotom-mow': ['electric', 'grass'],
};

// Get Pokemon types by name
const getPokemonTypes = (speciesName: string): string[] => {
  const cleanName = speciesName.toLowerCase()
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/nidoranf/g, 'nidoran-f')
    .replace(/nidoranm/g, 'nidoran-m')
    .replace(/farfetchd/g, 'farfetchd')
    .replace(/mrmime/g, 'mr-mime');
  
  return POKEMON_TYPE_MAPPING[cleanName] || ['normal'];
};

export function PokemonBuildCard({ build, onEdit, onDelete, onExport }: PokemonBuildCardProps) {
  const [imageError, setImageError] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'stats' | 'moves'>('main');
  const [moveTypes, setMoveTypes] = useState<Record<string, string>>({});

  const tierColor = TIER_COLORS[build.tier];
  const pokemonTypes = getPokemonTypes(build.species);

  // Format Pokemon name for URLs (lowercase, no special characters, handle special cases)
  const formatPokemonName = (name: string) => {
    // Handle Rotom forms specifically
    if (name.toLowerCase().includes('rotom')) {
      if (name.toLowerCase().includes('heat')) return 'rotom-heat';
      if (name.toLowerCase().includes('wash')) return 'rotom-wash';
      if (name.toLowerCase().includes('frost')) return 'rotom-frost';
      if (name.toLowerCase().includes('fan')) return 'rotom-fan';
      if (name.toLowerCase().includes('mow')) return 'rotom-mow';
      return 'rotom'; // Base form
    }
    
    return name.toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .replace(/nidoranf/g, 'nidoran-f')
      .replace(/nidoranm/g, 'nidoran-m')
      .replace(/farfetchd/g, 'farfetchd')
      .replace(/mrmime/g, 'mrmime');
  };

  // Use static sprites with fallback
  const spriteUrl = `https://img.pokemondb.net/sprites/home/normal/${formatPokemonName(build.species)}.png`;
  const fallbackSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png`;

  // Fetch move types
  useEffect(() => {
    const fetchMoveTypes = async () => {
      const types: Record<string, string> = {};
      for (const move of build.moves) {
        if (move && !types[move]) {
          // Handle Hidden Power moves
          if (move.toLowerCase().includes('hidden power')) {
            // Extract type from Hidden Power [Type] format
            const hiddenPowerMatch = move.match(/hidden power\s*\[([^\]]+)\]/i);
            if (hiddenPowerMatch) {
              const hiddenPowerType = hiddenPowerMatch[1].toLowerCase().trim();
              // Map the type to ensure it's valid
              const validTypes = [
                'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison',
                'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
              ];
              if (validTypes.includes(hiddenPowerType)) {
                types[move] = hiddenPowerType;
              } else {
                types[move] = 'normal'; // Default fallback
              }
            } else {
              // If no type specified, default to normal
              types[move] = 'normal';
            }
          } else {
            // Regular move type fetching
            try {
              const response = await fetch(`https://pokeapi.co/api/v2/move/${move.toLowerCase().replace(/\s+/g, '-')}`);
              if (response.ok) {
                const data = await response.json();
                types[move] = data.type.name;
              } else {
                types[move] = 'normal';
              }
            } catch (error) {
              console.error(`Error fetching type for move ${move}:`, error);
              types[move] = 'normal';
            }
          }
        }
      }
      setMoveTypes(types);
    };

    fetchMoveTypes();
  }, [build.moves]);

  // This useEffect is no longer needed as ItemImage component handles resets

  const getNextView = () => {
    if (currentView === 'main') return 'stats';
    if (currentView === 'stats') return 'moves';
    return 'main';
  };

  const getPreviousView = () => {
    if (currentView === 'main') return 'moves';
    if (currentView === 'stats') return 'main';
    return 'stats';
  };

  const getViewDisplayName = (view: 'main' | 'stats' | 'moves') => {
    if (view === 'main') return 'Overview';
    if (view === 'stats') return 'Stats';
    return 'Moves';
  };

  const handleExportToShowdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onExport) {
      onExport(build);
    }
  };

  return (
    <div
      className="pokemon-card"
      style={{
        position: 'relative',
        background: `
          linear-gradient(135deg, 
            rgba(0, 0, 0, 0.5) 0%, 
            rgba(0, 0, 0, 0.45) 25%, 
            rgba(0, 0, 0, 0.5) 50%, 
            rgba(0, 0, 0, 0.45) 75%, 
            rgba(0, 0, 0, 0.5) 100%
          ),
          linear-gradient(45deg, 
            rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.05) 0%, 
            transparent 50%, 
            rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.03) 100%
          )
        `,
        backgroundSize: '400% 400%, 200% 200%',
        animation: 'cardGlow 8s ease-in-out infinite',
        borderRadius: '12px',
        padding: '16px',
        border: `3px solid ${tierColor.background}`,
        transition: 'all 0.3s ease',
        minHeight: '200px',
        width: '100%',
        overflow: 'hidden',
        boxShadow: `0 4px 15px rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.3)`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 8px 25px rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.5)`;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 4px 15px rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.3)`;
        e.currentTarget.style.transform = 'translateY(0px)';
      }}
    >
      {/* Main View */}
      <div
        style={{
          opacity: currentView === 'main' ? 1 : 0,
          transition: 'opacity 0.2s ease',
          position: currentView === 'main' ? 'relative' : 'absolute',
          width: '100%',
          pointerEvents: currentView === 'main' ? 'auto' : 'none',
        }}
      >
        <div>
          {/* Tab Label and Navigation - Top Right */}
          <div style={{ 
            position: 'absolute', 
            top: '2px', 
            right: '8px', 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            zIndex: 10,
          }}>
            <span style={{ 
              color: '#ccc', 
              fontSize: '0.65rem', 
              fontStyle: 'italic',
              textAlign: 'center'
            }}>
              {getViewDisplayName(currentView)}
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentView(getPreviousView());
                }}
                style={{
                  background: `rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.3)`,
                  border: `1px solid ${tierColor.background}`,
                  color: tierColor.background,
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontWeight: '600',
                }}
                title={`Go to ${getViewDisplayName(getPreviousView())}`}
              >
                ←
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentView(getNextView());
                }}
                style={{
                  background: `rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.3)`,
                  border: `1px solid ${tierColor.background}`,
                  color: tierColor.background,
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontWeight: '600',
                }}
                title={`Go to ${getViewDisplayName(getNextView())}`}
              >
                →
              </button>
            </div>
          </div>

          {/* Header with Sprite and Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ flexShrink: 0 }}>
              <img
                src={imageError ? fallbackSpriteUrl : spriteUrl}
                alt={build.species}
                style={{
                  width: '64px',
                  height: '64px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
                }}
                onError={() => setImageError(true)}
              />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                marginBottom: '4px', 
                flexWrap: 'wrap',
                minHeight: '30px'
              }}>
                <h3
                  style={{
                    color: '#fff',
                    margin: 0,
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  {build.name}
                  <GenderIcon gender={build.gender} />
                </h3>
                
                {/* Type badges next to name */}
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {pokemonTypes.map((type, index) => {
                    const typeStyle = MOVE_TYPE_COLORS[type] || MOVE_TYPE_COLORS.normal;
                    return (
                      <span
                        key={index}
                        style={{
                          background: typeStyle.background,
                          color: typeStyle.text,
                          padding: '2px 5px',
                          borderRadius: '3px',
                          fontSize: '0.65rem',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          textShadow: '0 1px 2px rgba(0,0,0,0.7)',
                          border: '1px solid rgba(255,255,255,0.2)',
                        }}
                        title={`${type.charAt(0).toUpperCase() + type.slice(1)} type`}
                      >
                        {type}
                      </span>
                    );
                  })}
                </div>
              </div>
              {build.name !== build.species && (
                <p style={{ color: '#ddd', margin: '0 0 8px 0', fontSize: '0.9rem' }}>
                  ({build.species})
                </p>
              )}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span
                  style={{
                    backgroundColor: tierColor.background,
                    color: tierColor.text,
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  }}
                >
                  {build.tier}
                </span>
                <span style={{ color: '#ddd', fontSize: '0.85rem' }}>
                  Level {build.level}
                </span>
              </div>
            </div>
          </div>

          {/* Basic Info Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
            <div>
              <span style={{ color: '#bbb', fontSize: '0.85rem' }}>Nature:</span>
              <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: '500' }}>{build.nature}</div>
            </div>
            <div>
              <span style={{ color: '#bbb', fontSize: '0.85rem' }}>Ability:</span>
              <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {build.ability}
              </div>
            </div>
          </div>

          {build.item && (
            <div style={{ marginBottom: '12px' }}>
              <span style={{ color: '#bbb', fontSize: '0.85rem' }}>Item:</span>
              <div style={{ 
                color: '#fff', 
                fontSize: '0.9rem', 
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <ItemImage
                  itemName={build.item}
                  className="item-icon"
                  style={{
                    width: '20px',
                    height: '20px',
                    objectFit: 'contain',
                  }}
                />
                <span>{build.item}</span>
              </div>
            </div>
          )}

          {/* Action Buttons - Bottom Right Corner */}
          <div style={{ 
            position: 'absolute',
            bottom: '6px',
            right: '6px',
            display: 'flex',
            gap: '6px',
          }}>
            <button
              onClick={handleExportToShowdown}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #28a745',
                color: '#28a745',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: '600',
                minWidth: '50px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(40, 167, 69, 0.2)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              title="Export to Pokemon Showdown format"
            >
              📋 Export
            </button>
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(build);
                }}
                style={{
                  backgroundColor: 'transparent',
                  border: `1px solid ${tierColor.background}`,
                  color: tierColor.background,
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontWeight: '600',
                  minWidth: '40px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.2)`;
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(build.id);
                }}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #dc3545',
                  color: '#dc3545',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontWeight: '600',
                  minWidth: '45px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats View */}
      <div
        style={{
          opacity: currentView === 'stats' ? 1 : 0,
          transition: 'opacity 0.2s ease',
          position: currentView === 'stats' ? 'relative' : 'absolute',
          width: '100%',
          pointerEvents: currentView === 'stats' ? 'auto' : 'none',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Tab Label and Navigation - Top Right */}
        <div style={{ 
          position: 'absolute', 
          top: '2px', 
          right: '8px', 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          zIndex: 10,
        }}>
          <span style={{ 
            color: '#ccc', 
            fontSize: '0.65rem', 
            fontStyle: 'italic',
            textAlign: 'center'
          }}>
            {getViewDisplayName(currentView)}
          </span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentView(getPreviousView());
              }}
              style={{
                background: `rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.3)`,
                border: `1px solid ${tierColor.background}`,
                color: tierColor.background,
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: '600',
              }}
              title={`Go to ${getViewDisplayName(getPreviousView())}`}
            >
              ←
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentView(getNextView());
              }}
              style={{
                background: `rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.3)`,
                border: `1px solid ${tierColor.background}`,
                color: tierColor.background,
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: '600',
              }}
              title={`Go to ${getViewDisplayName(getNextView())}`}
            >
              →
            </button>
          </div>
        </div>

        {/* Single Line Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          marginBottom: '20px', 
          paddingBottom: '8px'
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <h3 style={{ color: '#fff', margin: '0', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              {build.name}
              <GenderIcon gender={build.gender} />
            </h3>
            <span style={{
              backgroundColor: tierColor.background,
              color: tierColor.text,
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '0.7rem',
              fontWeight: 'bold',
            }}>
              {build.tier}
            </span>
            <span style={{ color: '#ddd', fontSize: '0.8rem' }}>
              Level {build.level}
            </span>
          </div>
        </div>

        {/* Stats Layout - Compact and Consistent */}
        <div style={{ marginBottom: '12px' }}>
          {/* IVs Section - Single Line */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ color: tierColor.background, margin: '0', fontSize: '0.9rem', fontWeight: 'bold' }}>Individual Values</h4>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {[
                  { label: 'HP', value: build.ivs.hp },
                  { label: 'ATK', value: build.ivs.attack },
                  { label: 'DEF', value: build.ivs.defense },
                  { label: 'SPA', value: build.ivs.sp_attack },
                  { label: 'SPD', value: build.ivs.sp_defense },
                  { label: 'SPE', value: build.ivs.speed },
                ].map((stat, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <span style={{ color: tierColor.background, fontSize: '0.65rem', fontWeight: '600' }}>{stat.label}</span>
                    <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.8rem' }}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* EVs Section - Simplified 1x3 Layout */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ color: tierColor.background, margin: '0', fontSize: '0.9rem', fontWeight: 'bold' }}>Effort Values</h4>
              <span style={{ fontSize: '0.75rem', color: '#fff', fontWeight: '600' }}>
                Total: {Object.values(build.evs).reduce((sum, val) => sum + val, 0)}/510
              </span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '0.8rem' }}>
              {[
                { label: 'HP', value: build.evs.hp, icon: '❤️' },
                { label: 'ATK', value: build.evs.attack, icon: '⚔️' },
                { label: 'DEF', value: build.evs.defense, icon: '🛡️' },
              ].map((stat, index) => {
                const percentage = (stat.value / 252) * 100;
                return (
                  <div key={index} style={{ 
                    position: 'relative',
                    display: 'flex', 
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px', 
                    backgroundColor: `rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.2)`, 
                    borderRadius: '6px',
                    border: `1px solid rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.3)`,
                    minHeight: '18px',
                    overflow: 'hidden',
                  }}>
                    {/* Progress bar background */}
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      width: `${percentage}%`,
                      background: `linear-gradient(90deg, rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.4) 0%, rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.1) 100%)`,
                      borderRadius: '6px',
                      transition: 'width 0.5s ease',
                    }} />
                    {/* Stat icon */}
                    <span style={{ 
                      fontSize: '0.7rem', 
                      zIndex: 1,
                      color: stat.label === 'HP' ? '#ff4444' : 'inherit'
                    }}>{stat.icon}</span>
                    <span style={{ color: tierColor.background, fontSize: '0.65rem', fontWeight: '600', zIndex: 1 }}>{stat.label}</span>
                    <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.85rem', zIndex: 1 }}>{stat.value}</span>
                  </div>
                );
              })}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '0.8rem', marginTop: '8px' }}>
              {[
                { label: 'SPA', value: build.evs.sp_attack, icon: '🔮' },
                { label: 'SPD', value: build.evs.sp_defense, icon: '🔰' },
                { label: 'SPE', value: build.evs.speed, icon: '⚡' },
              ].map((stat, index) => {
                const percentage = (stat.value / 252) * 100;
                return (
                  <div key={index + 3} style={{ 
                    position: 'relative',
                    display: 'flex', 
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px', 
                    backgroundColor: `rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.2)`, 
                    borderRadius: '6px',
                    border: `1px solid rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.3)`,
                    minHeight: '18px',
                    overflow: 'hidden',
                  }}>
                    {/* Progress bar background */}
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      width: `${percentage}%`,
                      background: `linear-gradient(90deg, rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.4) 0%, rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.1) 100%)`,
                      borderRadius: '6px',
                      transition: 'width 0.5s ease',
                    }} />
                    {/* Stat icon */}
                    <span style={{ 
                      fontSize: '0.7rem', 
                      zIndex: 1
                    }}>{stat.icon}</span>
                    <span style={{ color: tierColor.background, fontSize: '0.65rem', fontWeight: '600', zIndex: 1 }}>{stat.label}</span>
                    <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.85rem', zIndex: 1 }}>{stat.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Moves View */}
      <div
        style={{
          opacity: currentView === 'moves' ? 1 : 0,
          transition: 'opacity 0.2s ease',
          position: currentView === 'moves' ? 'relative' : 'absolute',
          width: '100%',
          pointerEvents: currentView === 'moves' ? 'auto' : 'none',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Tab Label and Navigation - Top Right */}
        <div style={{ 
          position: 'absolute', 
          top: '2px', 
          right: '8px', 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          zIndex: 10,
        }}>
          <span style={{ 
            color: '#ccc', 
            fontSize: '0.65rem', 
            fontStyle: 'italic',
            textAlign: 'center'
          }}>
            {getViewDisplayName(currentView)}
          </span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentView(getPreviousView());
              }}
              style={{
                background: `rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.3)`,
                border: `1px solid ${tierColor.background}`,
                color: tierColor.background,
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: '600',
              }}
              title={`Go to ${getViewDisplayName(getPreviousView())}`}
            >
              ←
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentView(getNextView());
              }}
              style={{
                background: `rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.3)`,
                border: `1px solid ${tierColor.background}`,
                color: tierColor.background,
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: '600',
              }}
              title={`Go to ${getViewDisplayName(getNextView())}`}
            >
              →
            </button>
          </div>
        </div>

        {/* Single Line Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          marginBottom: '20px', 
          paddingBottom: '8px'
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <h3 style={{ color: '#fff', margin: '0', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              {build.name}
              <GenderIcon gender={build.gender} />
            </h3>
            <span style={{
              backgroundColor: tierColor.background,
              color: tierColor.text,
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '0.7rem',
              fontWeight: 'bold',
            }}>
              {build.tier}
            </span>
            <span style={{ color: '#ddd', fontSize: '0.8rem' }}>
              Level {build.level}
            </span>
          </div>
        </div>

        {/* Moves Section */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: tierColor.background, margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 'bold' }}>Moveset</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {build.moves.slice(0, 4).map((move, index) => {
              const moveType = moveTypes[move] || 'normal';
              const typeColor = MOVE_TYPE_COLORS[moveType] || MOVE_TYPE_COLORS.normal;
              
              // Get animation class based on type
              const getAnimationClass = (type: string) => {
                switch (type) {
                  case 'electric': return 'move-electric';
                  case 'water': return 'move-water';
                  case 'fire': return 'move-fire';
                  case 'grass': return 'move-grass';
                  case 'psychic': return 'move-psychic';
                  case 'ice': return 'move-ice';
                  default: return 'move-default';
                }
              };

              // Create animated background pattern
              const getBackgroundPattern = (type: string) => {
                const baseGradient = typeColor.background;
                switch (type) {
                  case 'electric':
                    return `${baseGradient}`;
                  case 'water':
                    return `${baseGradient}`;
                  case 'fire':
                    return `${baseGradient}`;
                  case 'grass':
                    return `${baseGradient}`;
                  case 'psychic':
                    return `${baseGradient}`;
                  case 'ice':
                    return `${baseGradient}`;
                  case 'fighting':
                    return `${baseGradient}`;
                  case 'poison':
                    return `${baseGradient}`;
                  case 'ground':
                    return `${baseGradient}`;
                  case 'flying':
                    return `${baseGradient}`;
                  case 'bug':
                    return `${baseGradient}`;
                  case 'rock':
                    return `${baseGradient}`;
                  case 'ghost':
                    return `${baseGradient}`;
                  case 'dragon':
                    return `${baseGradient}`;
                  case 'dark':
                    return `${baseGradient}`;
                  case 'steel':
                    return `${baseGradient}`;
                  case 'fairy':
                    return `${baseGradient}`;
                  default:
                    return `linear-gradient(135deg, #C8C8C8 0%, #E8E8E8 25%, #C8C8C8 50%, #E8E8E8 75%, #C8C8C8 100%)`;
                }
              };
              
              return (
                <div
                  key={index}
                  className={getAnimationClass(moveType)}
                  style={{
                    background: getBackgroundPattern(moveType),
                    backgroundSize: '100% 100%',
                    color: typeColor.text,
                    fontSize: '0.8rem',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontWeight: '600',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    minHeight: '45px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    border: `2px solid ${typeColor.background.includes('linear-gradient') ? '#666' : typeColor.background}`,
                    transition: 'all 0.3s ease',
                  }}
                  title={`${move} (${moveType.charAt(0).toUpperCase() + moveType.slice(1)} type)`}
                >
                  <span style={{ 
                    position: 'relative', 
                    zIndex: 1,
                    textShadow: '0 1px 2px rgba(0,0,0,0.7)'
                  }}>
                    {move}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Description Section - Only if description exists */}
        {build.description && (
          <div style={{ 
            padding: '12px', 
            backgroundColor: `rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.2)`, 
            borderRadius: '8px', 
            border: `1px solid rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.3)` 
          }}>
            <h4 style={{ color: tierColor.background, margin: '0 0 8px 0', fontSize: '0.9rem', fontWeight: 'bold' }}>Description</h4>
            <div style={{ color: '#ddd', fontSize: '0.8rem', lineHeight: 1.4 }}>
              {build.description}
            </div>
          </div>
        )}

      </div>
    </div>
  );
} 