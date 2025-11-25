import { Button } from '@/components/ui/button'

export function WasteReductionSection() {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 to-foreground/70">
        <img 
          src="/sustainable-farming-waste-management-recycling.jpg"
          alt="Giảm thiểu rác thải"
          className="w-full h-full object-cover mix-blend-overlay opacity-30"
        />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-background text-balance">
            Giảm thiểu rác thải
          </h2>
          
          <p className="text-lg md:text-xl text-background/90 leading-relaxed">
            Cam kết bảo vệ môi trường thông qua các giải pháp giảm thiểu rác thải trong sản xuất và chăn nuôi. 
            Chúng tôi không ngừng cải tiến quy trình để tạo ra một tương lai xanh hơn.
          </p>

          <div className="pt-4">
            <Button 
              size="lg" 
              className="bg-background text-foreground hover:bg-background/90 px-8"
            >
              Chi tiết
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>
    </section>
  )
}
