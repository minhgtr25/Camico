import Image from 'next/image'

interface AboutContent {
  icon: string
  title: string
  description: string
  image: string
  quote: string
}

export function AboutSection({ content }: Readonly<{ content: AboutContent }>) {
  return (
    <section className="py-16 md:py-24 bg-[#F5F5DC]">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Left Column - Text Content */}
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <span className="text-3xl">{content.icon}</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#2d5016] uppercase">
                {content.title}
              </h2>
            </div>
            
            <div className="space-y-4 text-[#1a1a1a] leading-relaxed text-justify" dangerouslySetInnerHTML={{ __html: content.description }} />
          </div>

          {/* Right Column - Logo Image with rounded corners */}
          <div className="flex items-start justify-center md:justify-end">
            <div className="w-full max-w-md">
              <Image
                src={content.image}
                alt="CAMICO - Green Feed for Sustainable Farming"
                width={600}
                height={600}
                className="w-full h-auto rounded-3xl"
              />
            </div>
          </div>
        </div>

        {/* Quote Section */}
        <div className="mt-12 md:mt-16 px-4">
          <p className="text-center text-2xl md:text-3xl font-bold text-[#1a1a1a] max-w-5xl mx-auto leading-relaxed font-handwriting break-words">
            "{content.quote}"
          </p>
        </div>
      </div>
    </section>
  )
}
