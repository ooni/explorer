// From https://github.com/citizenlab/test-lists/blob/master/lists/00-LEGEND-new_category_codes.csv
// On 2021-05-20
//
// [ [code, name, description], [], [], ...]
//

export const categoryCodes = [
  [
    'ALDR',
    'Alcohol & Drugs',
    'Sites devoted to the use, paraphernalia, and sale of drugs and alcohol irrespective of the local legality.'
  ],
  [
    'REL',
    'Religion',
    'Sites devoted to discussion of religious issues, both supportive and critical, as well as discussion of minority religious groups.'
  ],
  ['PORN', 'Pornography', 'Hard-core and soft-core pornography.'],
  [
    'PROV',
    'Provocative Attire',
    'Websites which show provocative attire and portray women in a sexual manner, wearing minimal clothing.'
  ],
  [
    'POLR',
    'Political Criticism',
    'Content that offers critical political viewpoints. Includes critical authors and bloggers, as well as oppositional political organizations. Includes pro-democracy content, anti-corruption content as well as content calling for changes in leadership, governance issues, legal reform. Etc.'
  ],
  [
    'HUMR',
    'Human Rights Issues',
    'Sites dedicated to discussing human rights issues in various forms. Includes women\'s rights and rights of minority ethnic groups.'
  ],
  [
    'ENV',
    'Environment',
    'Pollution, international environmental treaties, deforestation, environmental justice, disasters, etc.'
  ],
  [
    'MILX',
    'Terrorism and Militants',
    'Sites promoting terrorism, violent militant or separatist movements.'
  ],
  [
    'HATE',
    'Hate Speech',
    'Content that disparages particular groups or persons based on race, sex, sexuality or other characteristics'
  ],
  [
    'NEWS',
    'News Media',
    'This category includes major news outlets (BBC, CNN, etc.) as well as regional news outlets and independent media.'
  ],
  [
    'XED',
    'Sex Education',
    'Includes contraception, abstinence, STDs, healthy sexuality, teen pregnancy, rape prevention, abortion, sexual rights, and sexual health services.'
  ],
  [
    'PUBH',
    'Public Health',
    'HIV, SARS, bird flu, centers for disease control, World Health Organization, etc'
  ],
  [
    'GMB',
    'Gambling',
    'Online gambling sites. Includes casino games, sports betting, etc.'
  ],
  [
    'ANON',
    'Anonymization and circumvention tools',
    'Sites that provide tools used for anonymization, circumvention, proxy-services and encryption.'
  ],
  [
    'DATE',
    'Online Dating',
    'Online dating services which can be used to meet people, post profiles, chat, etc'
  ],
  ['GRP', 'Social Networking', 'Social networking tools and platforms.'],
  [
    'LGBT',
    'LGBT',
    'A range of gay-lesbian-bisexual-transgender queer issues. (Excluding pornography)'
  ],
  [
    'FILE',
    'File-sharing',
    'Sites and tools used to share files, including cloud-based file storage, torrents and P2P file-sharing tools.'
  ],
  [
    'HACK',
    'Hacking Tools',
    'Sites dedicated to computer security, including news and tools. Includes malicious and non-malicious content.'
  ],
  [
    'COMT',
    'Communication Tools',
    'Sites and tools for individual and group communications. Includes webmail, VoIP, instant messaging, chat and mobile messaging applications.'
  ],
  ['MMED', 'Media sharing', 'Video, audio or photo sharing platforms.'],
  [
    'HOST',
    'Hosting and Blogging Platforms',
    'Web hosting services, blogging and other online publishing platforms.'
  ],
  ['SRCH', 'Search Engines', 'Search engines and portals.'],
  [
    'GAME',
    'Gaming',
    'Online games and gaming platforms, excluding gambling sites.'
  ],
  [
    'CULTR',
    'Culture',
    'Content relating to entertainment, history, literature, music, film, books, satire and humour'
  ],
  [
    'ECON',
    'Economics',
    'General economic development and poverty related topics, agencies and funding opportunities'
  ],
  ['GOVT', 'Government', 'Government-run websites, including military sites.'],
  ['COMM', 'E-commerce', 'Websites of commercial services and products.'],
  ['CTRL', 'Control content', 'Benign or innocuous content used as a control.'],
  [
    'IGO',
    'Intergovernmental Organizations',
    'Websites of intergovernmental organizations such as the United Nations.'
  ],
  [
    'MISC',
    'Miscelaneous content',
    'Sites that don\'t fit in any category (XXX Things in here should be categorised)'
  ]
]

export const getCategoryCodesMap = () => {
  const map = categoryCodes.reduce((acc, [code, name, description]) => 
    acc.set(code, {name, description})
  , new Map())
  return map
}
