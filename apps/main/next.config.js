//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withNx } = require('@nrwl/next/plugins/with-nx')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: true
  },
  images: {
    domains: [
      '127.0.0.1',
      'coleccionablespanama-assets.s3.amazonaws.com',
      'dhch6dszrgnpb.cloudfront.net',
      'avatars.dicebear.com',
      'images.pokemontcg.io',
      'i.imgur.com'
    ]
  },
  async redirects() {
    return [
      {
        source: '/items/monedas/:slug',
        destination: '/numismatica/:slug',
        permanent: true
      },
      {
        source: '/items/pokemon/:slug',
        destination: '/cartas/:slug',
        permanent: true
      },
      {
        source: '/items/cartas/:slug',
        destination: '/cartas/:slug',
        permanent: true
      },
      {
        source: '/items/numismatica/:slug',
        destination: '/numismatica/:slug',
        permanent: true
      },
      {
        source: '/items/monedas/:path*',
        destination: '/numismatica/:path*',
        permanent: true
      },
      {
        source: '/items/pokemon/:path*',
        destination: '/cartas/:path*',
        permanent: true
      },
      {
        source: '/items',
        destination: '/',
        permanent: false
      }
    ]
  }
}

module.exports = (phase, defaultConfig) => {
  return withBundleAnalyzer(withNx(nextConfig))
}

// module.exports = withNx(nextConfig)
