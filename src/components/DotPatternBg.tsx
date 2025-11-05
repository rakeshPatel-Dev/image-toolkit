import { DotPattern as UIDotPattern } from "./ui/dot-pattern"
import { cn } from "../lib/utils"

const DotPatternBackground = () => {
  return (

    <UIDotPattern className={cn(
      " mask-[radial-gradient(600px_circle_at_center,white,transparent)] h-screen text-orange-500 dark:text-orange-900"
    )}>
    </UIDotPattern>
  )
}

export default DotPatternBackground
