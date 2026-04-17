import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ASSETS } from '@/lib/assets'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'About Amalia — Come Color With Me',
  description: "Meet Amalia, the 8-year-old artist behind Come Color With Me.",
}

export default function AboutPage() {
  return (
    <div className="min-h-[60vh] py-16 px-4">
      <div className="mx-auto max-w-[800px]">
        <div className="text-center mb-12">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden bg-[#FFF0FA] border-4 border-[#C4B5FD] flex items-center justify-center">
            <Image
              src={ASSETS.artistAvatar}
              alt="Amalia, the artist"
              width={128}
              height={128}
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="font-fredoka font-bold text-[clamp(2rem,4vw,2.75rem)] text-[#9B6FD4] mb-2">
            Hi, I&apos;m Amalia!
          </h1>
          <p className="font-nunito text-[#8B7BA8] text-lg">Artist · Age 8 · Dream Builder</p>
        </div>

        <div className="bg-white rounded-[20px] p-8 shadow-sm border border-[#C4B5FD]/20 mb-8">
          <p className="font-nunito text-[#3D1F5C] text-lg leading-relaxed mb-4">
            I love drawing animals, magical creatures, and places I imagine in
            my head. I draw something new almost every day — and I made these
            coloring pages especially for you!
          </p>
          <p className="font-nunito text-[#3D1F5C] text-lg leading-relaxed">
            My favourite things to draw are cats, unicorns, and anything with
            lots of colour. I hope my drawings make you smile as much as making
            them makes me smile. 💜
          </p>
        </div>

        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/coloring-pages">
            <Button variant="primary">Browse Coloring Pages</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
