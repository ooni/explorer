module.exports = function (api) {
  const isServer = api.caller((caller) => caller?.isServer)
  const isCallerDevelopment = api.caller((caller) => caller?.isDev)

  const plugins = [
    'inline-react-svg',
    ['styled-components', {'ssr': true, 'displayName': true, 'preprocess': false}],
    ['react-intl', {
      'messagesDir': './public/static/lang/.messages',
      'enforceDescriptions': false,
      'enforceDefaultMessage': false,
      'extractFromFormatMessageCall': true
    }]
  ]

  const presets = [
    [
      'next/babel',
      {
        'preset-react': {
          importSource:
            !isServer && isCallerDevelopment
              ? '@welldone-software/why-did-you-render'
              : 'react',
        },
      },
    ],
  ]

  return { presets, plugins }
}
