import HomeHero from '@/components/server/HomeHero'
import Stats from '@/components/Stats'
import TestimonialsWrapper from '@/components/TestimonialsWrapper'
import CustomServiceRequest from '@/components/CustomServiceRequest'

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <Stats />
      <TestimonialsWrapper />
      <CustomServiceRequest />
    </>
  )
}
