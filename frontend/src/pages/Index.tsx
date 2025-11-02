import HeartPredictionForm from "@/components/HeartPredictionForm";
import heroImage from "@/assets/medical-hero.jpg";
import { Stethoscope, Shield, TrendingUp } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="relative bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Medical heart health visualization"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-hero/80"></div>
        </div>

        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center text-primary-foreground max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Heart Disease Risk
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-accent-foreground">
                Assessment Tool
              </span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
              Advanced machine learning powered cardiac risk analysis using comprehensive medical parameters
            </p>

            {/* Feature Points */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <Stethoscope className="h-8 w-8 mb-3" />
                <h3 className="font-semibold mb-2">Clinical Grade</h3>
                <p className="text-sm text-primary-foreground/80">Professional medical parameter analysis</p>
              </div>

              <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <Shield className="h-8 w-8 mb-3" />
                <h3 className="font-semibold mb-2">Secure & Private</h3>
                <p className="text-sm text-primary-foreground/80">Your health data is protected</p>
              </div>

              <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <TrendingUp className="h-8 w-8 mb-3" />
                <h3 className="font-semibold mb-2">ML Powered</h3>
                <p className="text-sm text-primary-foreground/80">AI-driven risk predictions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Complete Your Heart Health Assessment
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Fill the details below for accurate health risk analysis.
            </p>
          </div>

          {/* Form Component */}
          <HeartPredictionForm />

          {/* Disclaimer */}
          <div className="mt-12 p-6 bg-muted/50 rounded-lg border border-border/50">
            <div className="text-center">
              <h3 className="font-semibold text-foreground mb-2">Medical Disclaimer</h3>
              <p className="text-sm text-muted-foreground">
                This tool is for educational purposes only and is not a substitute
                for professional medical advice.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Index;
