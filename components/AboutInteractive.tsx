'use client'

import dynamic from 'next/dynamic'
import Story from './Story'

const Team = dynamic(() => import('./Team'), { ssr: false })
const Timeline = dynamic(() => import('./Timeline'), { ssr: false })

export default function AboutInteractive() {
  return (
    <>
      <Story />
      <Team />
      <Timeline />
    </>
  )
}
