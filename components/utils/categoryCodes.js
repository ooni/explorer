// From https://github.com/citizenlab/test-lists/blob/master/lists/00-LEGEND-new_category_codes.csv
// On 2021-05-20
//
// [ [code, name, description], [], [], ...]
//

/* eslint-disable quotes */
export const categoryCodes = [
  [
    'ALDR',
    'Alcohol & Drugs',
    'Sites devoted to the use, paraphernalia, and sale of drugs and alcohol irrespective of the local legality.',
  ],
  [
    'ANON',
    'Anonymization and circumvention tools',
    'Sites that provide tools used for anonymization, circumvention, proxy-services and encryption.',
  ],
  [
    'COMT',
    'Communication Tools',
    'Sites and tools for individual and group communications. Includes webmail, VoIP, instant messaging, chat and mobile messaging applications.',
  ],
  ['CTRL', 'Control content', 'Benign or innocuous content used as a control.'],
  [
    'CULTR',
    'Culture',
    'Content relating to entertainment, history, literature, music, film, books, satire and humour',
  ],
  ['COMM', 'E-commerce', 'Websites of commercial services and products.'],
  [
    'ECON',
    'Economics',
    'General economic development and poverty related topics, agencies and funding opportunities',
  ],
  [
    'ENV',
    'Environment',
    'Pollution, international environmental treaties, deforestation, environmental justice, disasters, etc.',
  ],
  [
    'FILE',
    'File-sharing',
    'Sites and tools used to share files, including cloud-based file storage, torrents and P2P file-sharing tools.',
  ],
  [
    'GMB',
    'Gambling',
    'Online gambling sites. Includes casino games, sports betting, etc.',
  ],
  [
    'GAME',
    'Gaming',
    'Online games and gaming platforms, excluding gambling sites.',
  ],
  ['GOVT', 'Government', 'Government-run websites, including military sites.'],
  [
    'HACK',
    'Hacking Tools',
    'Sites dedicated to computer security, including news and tools. Includes malicious and non-malicious content.',
  ],
  [
    'HATE',
    'Hate Speech',
    'Content that disparages particular groups or persons based on race, sex, sexuality or other characteristics',
  ],
  [
    'HOST',
    'Hosting and Blogging Platforms',
    'Web hosting services, blogging and other online publishing platforms.',
  ],
  [
    'HUMR',
    'Human Rights Issues',
    "Sites dedicated to discussing human rights issues in various forms. Includes women's rights and rights of minority ethnic groups.",
  ],
  [
    'IGO',
    'Intergovernmental Organizations',
    'Websites of intergovernmental organizations such as the United Nations.',
  ],
  [
    'LGBT',
    'LGBT',
    'A range of gay-lesbian-bisexual-transgender queer issues. (Excluding pornography)',
  ],
  ['MMED', 'Media sharing', 'Video, audio or photo sharing platforms.'],
  [
    'MISC',
    'Miscelaneous content',
    "Sites that don't fit in any category (XXX Things in here should be categorised)",
  ],
  [
    'NEWS',
    'News Media',
    'This category includes major news outlets (BBC, CNN, etc.) as well as regional news outlets and independent media.',
  ],
  [
    'DATE',
    'Online Dating',
    'Online dating services which can be used to meet people, post profiles, chat, etc',
  ],
  [
    'POLR',
    'Political Criticism',
    'Content that offers critical political viewpoints. Includes critical authors and bloggers, as well as oppositional political organizations. Includes pro-democracy content, anti-corruption content as well as content calling for changes in leadership, governance issues, legal reform. Etc.',
  ],
  ['PORN', 'Pornography', 'Hard-core and soft-core pornography.'],
  [
    'PROV',
    'Provocative Attire',
    'Websites which show provocative attire and portray women in a sexual manner, wearing minimal clothing.',
  ],
  [
    'PUBH',
    'Public Health',
    'HIV, SARS, bird flu, centers for disease control, World Health Organization, etc',
  ],
  [
    'REL',
    'Religion',
    'Sites devoted to discussion of religious issues, both supportive and critical, as well as discussion of minority religious groups.',
  ],
  ['SRCH', 'Search Engines', 'Search engines and portals.'],
  [
    'XED',
    'Sex Education',
    'Includes contraception, abstinence, STDs, healthy sexuality, teen pregnancy, rape prevention, abortion, sexual rights, and sexual health services.',
  ],
  ['GRP', 'Social Networking', 'Social networking tools and platforms.'],
  [
    'MILX',
    'Terrorism and Militants',
    'Sites promoting terrorism, violent militant or separatist movements.',
  ],
]
/* eslint-enable quotes */

export const getCategoryCodesMap = () => {
  const map = categoryCodes.reduce(
    (acc, [code, name, description]) =>
      acc.set(code, {
        code,
        name: `CategoryCode.${code}.Name`,
        description: `CategoryCode.${code}.Description`,
      }),
    new Map(),
  )
  return map
}
