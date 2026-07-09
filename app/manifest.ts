import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'انجاز نوت | مكتبة ومركز خدمات عامة',
    short_name: 'انجاز نوت',
    description: 'مكتبة ومركز خدمات عامة — طباعة، خدمات حكومية، خدمات طلابية، حلول رقمية',
    start_url: '/',
    display: 'standalone',
    background_color: '#002248',
    theme_color: '#002248',
    orientation: 'portrait',
    icons: [
      { src: '/pp.png', sizes: '88x88', type: 'image/png' },
      { src: '/pp.png', sizes: '192x192', type: 'image/png' },
      { src: '/pp.png', sizes: '512x512', type: 'image/png' },
      { src: '/pp.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
