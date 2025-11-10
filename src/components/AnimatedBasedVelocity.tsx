import { ScrollVelocityRow } from "../components/ui/scroll-based-velocity"
import { ScrollVelocityContainer } from "../components/ui/scroll-based-velocity"

const AnimatedBasedVelocity = () => {
  return (
    <div>
       <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <ScrollVelocityContainer className="text-4xl font-bold tracking-[0.02em] md:text-6xl md:leading-18">
        <ScrollVelocityRow baseVelocity={5} direction={-1}>
          Change Image type | Compress Image | Resize  Image |
        </ScrollVelocityRow>
        <ScrollVelocityRow baseVelocity={5} direction={1}>
          Change Image type | Compress Image | Resize  Image |
        </ScrollVelocityRow>
      </ScrollVelocityContainer>
      <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
    </div>
    </div>
  )
}

export default AnimatedBasedVelocity
