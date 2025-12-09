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
  }
}

module.exports = (phase, defaultConfig) => {
  return withBundleAnalyzer(withNx(nextConfig))
}

// module.exports = withNx(nextConfig)
