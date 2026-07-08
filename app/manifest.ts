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
      { src: '/icon.png', sizes: '192x192', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  }
}
