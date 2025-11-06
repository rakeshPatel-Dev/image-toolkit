import { cn } from "@/lib/utils"
import { Marquee } from "../components/ui/marquee"
import { TextAnimate } from "../components/ui/text-animate"

const reviews = [
  {
    name: "Rahul",
    username: "@rahul",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Krishna",
    username: "@Krishna",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "Pratham",
    username: "@pratham",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "Sita",
    username: "@sita",
    body: "Absolutely fantastic experience. Highly recommended!",
    img: "https://avatar.vercel.sh/sita",
  },
  {
    name: "Anil",
    username: "@anil",
    body: "This exceeded all my expectations. Brilliant work!",
    img: "https://avatar.vercel.sh/anil",
  },
  {
    name: "Meera",
    username: "@meera",
    body: "I can't stop praising this. Truly exceptional!",
    img: "https://avatar.vercel.sh/meera",
  },
  {
    name: "Rohan",
    username: "@rohan",
    body: "Simply mind-blowing. I've shared it with all my friends!",
    img: "https://avatar.vercel.sh/rohan",
  },
  {
    name: "Pooja",
    username: "@pooja",
    body: "Incredible! I didn't think anything could be this good.",
    img: "https://avatar.vercel.sh/pooja",
  },
  {
    name: "Sanjay",
    username: "@sanjay",
    body: "This is top-notch quality. I’m impressed.",
    img: "https://avatar.vercel.sh/sanjay",
  },
  {
    name: "Asha",
    username: "@asha",
    body: "Phenomenal! I would give it ten stars if I could.",
    img: "https://avatar.vercel.sh/asha",
  },
  {
    name: "Vikram",
    username: "@vikram",
    body: "Outstanding work. I’m truly amazed!",
    img: "https://avatar.vercel.sh/vikram",
  },
  {
    name: "Neha",
    username: "@neha",
    body: "This has set a new standard. Incredible!",
    img: "https://avatar.vercel.sh/neha",
  },
  {
    name: "Kabir",
    username: "@kabir",
    body: "Unbelievable quality. I can’t recommend it enough!",
    img: "https://avatar.vercel.sh/kabir",
  }
];


const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)
const thirdRow = reviews.slice(0, reviews.length / 2)
const fourthRow = reviews.slice(reviews.length / 2)

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string
  name: string
  username: string
  body: string
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-fit cursor-pointer overflow-hidden rounded-xl border p-4 sm:w-36",
        // light styles
        "border-gray-950/10 bg-gray-950/10 hover:bg-gray-950/5",
        // dark styles
        "dark:border-gray-50/10 dark:bg-gray-50/10 dark:hover:bg-gray-50/15"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  )
}

export function ReviewMarquee() {
  return (<div className="flex flex-col items-center">
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-0 flex flex-col items-start justify-center gap-3 text-left max-w-4xl mx-auto">

      <TextAnimate
        animation="fadeIn"
        by="word"
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-10 sm:mt-16 md:mt-20 text-gray-900 dark:text-gray-100"
      >
        User Reviews
      </TextAnimate>

      <TextAnimate
        animation="fadeIn"
        by="word"
        className="text-sm sm:text-base md:text-lg text-gray-800 dark:text-gray-300 leading-relaxed max-w-2xl"
      >
        Don’t just take our word for it—discover the experiences and feedback from real users who’ve tried and loved our product. See why they trust us and keep coming back.
      </TextAnimate>

    </div>

    <div className="mt-10 dark:bg-black relative flex h-150 w-full flex-row items-center justify-center gap-4 overflow-hidden perspective:near">
      <div
        className="transformProperty ml-40 flex flex-row items-center gap-4"

      >
        <Marquee pauseOnHover vertical className="[--duration:20s]">
          {firstRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:20s]" vertical>
          {secondRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:20s]" vertical>
          {thirdRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <Marquee pauseOnHover className="[--duration:20s]" vertical>
          {fourthRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
      </div>

      <div className="from-background pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b"></div>
      <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t"></div>
      <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
    </div>
  </div>
  )
}
