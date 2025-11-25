import { Button } from "@/components/ui/button"

interface HeroContent {
  backgroundImage: string
  title: string
  subtitle: string
  buttonText: string
}

export function HeroSection({ content }: Readonly<{ content: HeroContent }>) {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${content.backgroundImage})`
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 h-full">
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-8 max-w-3xl">
            <h1 className="text-6xl md:text-8xl font-black text-white text-balance tracking-tight">
              {content.title}
            </h1>
            <p className="text-3xl md:text-4xl text-white font-bold text-balance leading-tight" dangerouslySetInnerHTML={{ __html: content.subtitle }} />
            
            <div className="pt-8">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 text-lg font-semibold px-10 py-7 rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                {content.buttonText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
