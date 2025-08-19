import React, { useState, useEffect } from 'react';
import type { PokemonBuild } from '../types/pokemon';
import { getItemSpriteUrls } from '../utils/item-sprites';
import { TIER_COLORS, MOVE_TYPE_COLORS } from '../types/pokemon';

interface PokemonBuildListViewProps {
  builds: PokemonBuild[];
  onEdit?: (build: PokemonBuild) => void;
  onDelete?: (id: string) => void;
  onExport?: (build: PokemonBuild) => void;
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

// Gender Icon Component
function GenderIcon({ gender }: { gender?: 'M' | 'F' | 'U' | null }) {
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
        fontSize: '1rem',
        fontWeight: 'bold',
        marginLeft: '4px',
        textShadow: '0 1px 2px rgba(0,0,0,0.8)',
      }}
    >
      {genderDisplay.icon}
    </span>
  );
}

// Item Image Component
function ItemImage({ itemName, className, style }: { itemName: string; className?: string; style?: React.CSSProperties }) {
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const itemUrls = getItemSpriteUrls(itemName);

  const handleImageError = () => {
    if (currentUrlIndex < itemUrls.length - 1) {
      setCurrentUrlIndex(currentUrlIndex + 1);
    }
  };

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

function PokemonBuildListItem({ build, onEdit, onDelete, onExport }: { build: PokemonBuild; onEdit?: (build: PokemonBuild) => void; onDelete?: (id: string) => void; onExport?: (build: PokemonBuild) => void; }) {
  const [imageError, setImageError] = useState(false);
  const tierColor = TIER_COLORS[build.tier];
  const pokemonTypes = getPokemonTypes(build.species);

  // Format Pokemon name for URLs
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

  const spriteUrl = `https://img.pokemondb.net/sprites/home/normal/${formatPokemonName(build.species)}.png`;
  const fallbackSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png`;

  const handleExportToShowdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onExport) {
      onExport(build);
    }
  };

  const formatEVs = (evs: any) => {
    const evEntries: string[] = [];
    if (evs.hp > 0) evEntries.push(`${evs.hp} HP`);
    if (evs.attack > 0) evEntries.push(`${evs.attack} Atk`);
    if (evs.defense > 0) evEntries.push(`${evs.defense} Def`);
    if (evs.sp_attack > 0) evEntries.push(`${evs.sp_attack} SpA`);
    if (evs.sp_defense > 0) evEntries.push(`${evs.sp_defense} SpD`);
    if (evs.speed > 0) evEntries.push(`${evs.speed} Spe`);
    return evEntries.join(' / ') || 'No EVs';
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6))',
        borderLeft: `4px solid ${tierColor.background}`,
        borderRadius: '8px',
        padding: '12px 16px',
        marginBottom: '8px',
        transition: 'all 0.3s ease',
        border: `1px solid rgba(255, 255, 255, 0.1)`,
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        e.currentTarget.style.transform = 'translateX(4px)';
        e.currentTarget.style.boxShadow = `0 4px 15px rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.3)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
        e.currentTarget.style.transform = 'translateX(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* First Line: Basic Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        {/* Pokemon Sprite */}
        <img
          src={imageError ? fallbackSpriteUrl : spriteUrl}
          alt={build.species}
          style={{
            width: '32px',
            height: '32px',
            objectFit: 'contain',
            filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))',
            flexShrink: 0,
          }}
          onError={() => setImageError(true)}
        />

        {/* Name and Species */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h4 style={{ 
              color: '#fff', 
              margin: 0, 
              fontSize: '1rem', 
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
            }}>
              {build.name}
              <GenderIcon gender={build.gender} />
            </h4>
            {build.name !== build.species && (
              <span style={{ color: '#ddd', fontSize: '0.85rem' }}>
                ({build.species})
              </span>
            )}
            <span
              style={{
                backgroundColor: tierColor.background,
                color: tierColor.text,
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '0.7rem',
                fontWeight: 'bold',
              }}
            >
              {build.tier}
            </span>
            
            {/* Type badges */}
            {pokemonTypes.map((type, index) => {
              const typeStyle = MOVE_TYPE_COLORS[type] || MOVE_TYPE_COLORS.normal;
              return (
                <span
                  key={index}
                  style={{
                    background: typeStyle.background,
                    color: typeStyle.text,
                    padding: '2px 6px',
                    borderRadius: '4px',
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

        {/* Nature and Ability */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#bbb', fontSize: '0.75rem' }}>Nature</div>
            <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: '500' }}>{build.nature}</div>
          </div>
          <div style={{ textAlign: 'center', maxWidth: '120px' }}>
            <div style={{ color: '#bbb', fontSize: '0.75rem' }}>Ability</div>
            <div style={{ 
              color: '#fff', 
              fontSize: '0.85rem', 
              fontWeight: '500',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {build.ability}
            </div>
          </div>
        </div>

        {/* Item */}
        {build.item && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <ItemImage
              itemName={build.item}
              style={{
                width: '20px',
                height: '20px',
                objectFit: 'contain',
              }}
            />
            <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: '500' }}>
              {build.item.length > 15 ? `${build.item.substring(0, 15)}...` : build.item}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          <button
            onClick={handleExportToShowdown}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #28a745',
              color: '#28a745',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '0.7rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontWeight: '600',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(40, 167, 69, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title="Export to Pokemon Showdown format"
          >
            📋
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
                fontSize: '0.7rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: '600',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `rgba(${tierColor.background.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.2)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              ✏️
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
                fontSize: '0.7rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: '600',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      {/* Second Line: EVs and Moves */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '44px' }}>
        {/* EVs */}
        <div style={{ flex: 1 }}>
          <span style={{ color: '#bbb', fontSize: '0.75rem' }}>EVs: </span>
          <span style={{ color: '#fff', fontSize: '0.8rem' }}>{formatEVs(build.evs)}</span>
        </div>

        {/* Moves */}
        <div style={{ flex: 2 }}>
          <span style={{ color: '#bbb', fontSize: '0.75rem' }}>Moves: </span>
          <span style={{ color: '#fff', fontSize: '0.8rem' }}>
            {build.moves.filter(move => move).join(' / ') || 'No moves'}
          </span>
        </div>
      </div>

    </div>
  );
}

export function PokemonBuildListView({ builds, onEdit, onDelete, onExport }: PokemonBuildListViewProps) {
  return (
    <div style={{ maxWidth: '100%' }}>
      {builds.map((build) => (
        <PokemonBuildListItem
          key={build.id}
          build={build}
          onEdit={onEdit}
          onDelete={onDelete}
          onExport={onExport}
        />
      ))}
      
      {builds.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#ccc' }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>No Pokemon builds found</p>
          <p style={{ fontSize: '0.9rem' }}>Add some builds to see them in list view</p>
        </div>
      )}
    </div>
  );
} 