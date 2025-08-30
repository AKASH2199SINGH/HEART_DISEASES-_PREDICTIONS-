import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Heart, Activity, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

interface HeartData {
  age: number;
  cp: number; // chest pain type (0-3)
  trestbps: number; // resting blood pressure
  chol: number; // serum cholesterol
  restecg: number; // resting ECG results (0, 1, 2)
  thalach: number; // maximum heart rate achieved
  oldpeak: number; // ST depression induced by exercise
  slope: number; // slope of peak exercise ST segment
  ca: number; // number of major vessels (0-3)
  thal: number; // 0 = normal; 1 = fixed defect; 2 = reversible defect
}

const HeartPredictionForm = () => {
  const [formData, setFormData] = useState<HeartData>({
    age: 0,
    cp: 0,
    trestbps: 0,
    chol: 0,
    restecg: 0,
    thalach: 0,
    oldpeak: 0,
    slope: 0,
    ca: 0,
    thal: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const { toast } = useToast();

  const handleInputChange = (field: keyof HeartData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const handleSelectChange = (field: keyof HeartData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseInt(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.age <= 0 || formData.trestbps <= 0 || formData.chol <= 0 || formData.thalach <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields with valid values.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }

      const result = await response.json();
      setPrediction(result.prediction || result.result || 'Prediction received');
      
      toast({
        title: "Prediction Complete",
        description: "Heart disease risk assessment completed successfully.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to get prediction. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const chestPainTypes = [
    { value: "0", label: "Typical Angina" },
    { value: "1", label: "Atypical Angina" },
    { value: "2", label: "Non-Anginal Pain" },
    { value: "3", label: "Asymptomatic" },
  ];

  const ecgResults = [
    { value: "0", label: "Normal" },
    { value: "1", label: "ST-T Wave Abnormality" },
    { value: "2", label: "Left Ventricular Hypertrophy" },
  ];

  const slopeTypes = [
    { value: "0", label: "Upsloping" },
    { value: "1", label: "Flat" },
    { value: "2", label: "Downsloping" },
  ];

  const thalTypes = [
    { value: "0", label: "Normal" },
    { value: "1", label: "Fixed Defect" },
    { value: "2", label: "Reversible Defect" },
  ];

  return (
    <div className="space-y-8">
      <Card className="bg-gradient-card shadow-card-custom border-border/50">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-primary rounded-full">
              <Heart className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Heart Disease Risk Assessment</CardTitle>
          <CardDescription className="text-muted-foreground max-w-md mx-auto">
            Enter your cardiac parameters below to assess heart disease risk using advanced machine learning
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Age (years)
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age || ''}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="bg-input border-border focus:ring-primary"
                  placeholder="Enter age"
                  min="1"
                  max="120"
                />
              </div>

              {/* Chest Pain Type */}
              <div className="space-y-2">
                <Label htmlFor="cp" className="text-sm font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Chest Pain Type
                </Label>
                <Select onValueChange={(value) => handleSelectChange('cp', value)}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Select chest pain type" />
                  </SelectTrigger>
                  <SelectContent>
                    {chestPainTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Resting Blood Pressure */}
              <div className="space-y-2">
                <Label htmlFor="trestbps" className="text-sm font-medium">
                  Resting Blood Pressure (mmHg)
                </Label>
                <Input
                  id="trestbps"
                  type="number"
                  value={formData.trestbps || ''}
                  onChange={(e) => handleInputChange('trestbps', e.target.value)}
                  className="bg-input border-border focus:ring-primary"
                  placeholder="e.g., 120"
                  min="50"
                  max="300"
                />
              </div>

              {/* Serum Cholesterol */}
              <div className="space-y-2">
                <Label htmlFor="chol" className="text-sm font-medium">
                  Serum Cholesterol (mg/dl)
                </Label>
                <Input
                  id="chol"
                  type="number"
                  value={formData.chol || ''}
                  onChange={(e) => handleInputChange('chol', e.target.value)}
                  className="bg-input border-border focus:ring-primary"
                  placeholder="e.g., 200"
                  min="100"
                  max="600"
                />
              </div>

              {/* Resting ECG Results */}
              <div className="space-y-2">
                <Label htmlFor="restecg" className="text-sm font-medium">
                  Resting ECG Results
                </Label>
                <Select onValueChange={(value) => handleSelectChange('restecg', value)}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Select ECG result" />
                  </SelectTrigger>
                  <SelectContent>
                    {ecgResults.map((result) => (
                      <SelectItem key={result.value} value={result.value}>
                        {result.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Maximum Heart Rate */}
              <div className="space-y-2">
                <Label htmlFor="thalach" className="text-sm font-medium">
                  Maximum Heart Rate Achieved (bpm)
                </Label>
                <Input
                  id="thalach"
                  type="number"
                  value={formData.thalach || ''}
                  onChange={(e) => handleInputChange('thalach', e.target.value)}
                  className="bg-input border-border focus:ring-primary"
                  placeholder="e.g., 150"
                  min="60"
                  max="220"
                />
              </div>

              {/* Oldpeak */}
              <div className="space-y-2">
                <Label htmlFor="oldpeak" className="text-sm font-medium">
                  ST Depression (Oldpeak)
                </Label>
                <Input
                  id="oldpeak"
                  type="number"
                  step="0.1"
                  value={formData.oldpeak || ''}
                  onChange={(e) => handleInputChange('oldpeak', e.target.value)}
                  className="bg-input border-border focus:ring-primary"
                  placeholder="e.g., 1.0"
                  min="0"
                  max="10"
                />
              </div>

              {/* Slope */}
              <div className="space-y-2">
                <Label htmlFor="slope" className="text-sm font-medium">
                  ST Segment Slope
                </Label>
                <Select onValueChange={(value) => handleSelectChange('slope', value)}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Select slope type" />
                  </SelectTrigger>
                  <SelectContent>
                    {slopeTypes.map((slope) => (
                      <SelectItem key={slope.value} value={slope.value}>
                        {slope.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Number of Major Vessels */}
              <div className="space-y-2">
                <Label htmlFor="ca" className="text-sm font-medium">
                  Major Vessels (0-3)
                </Label>
                <Select onValueChange={(value) => handleSelectChange('ca', value)}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Select vessel count" />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} vessel{num !== 1 ? 's' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Thal */}
              <div className="space-y-2">
                <Label htmlFor="thal" className="text-sm font-medium">
                  Thalassemia Status
                </Label>
                <Select onValueChange={(value) => handleSelectChange('thal', value)}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Select thal status" />
                  </SelectTrigger>
                  <SelectContent>
                    {thalTypes.map((thal) => (
                      <SelectItem key={thal.value} value={thal.value}>
                        {thal.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-primary hover:bg-primary-hover text-primary-foreground font-medium py-3 h-auto shadow-medical"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                  Analyzing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Get Heart Risk Prediction
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results Card */}
      {prediction && (
        <Card className="bg-gradient-card shadow-card-custom border-border/50">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className={`p-3 rounded-full ${
                prediction.toLowerCase().includes('low') || prediction.toLowerCase().includes('no') 
                  ? 'bg-secondary' 
                  : 'bg-destructive/10'
              }`}>
                {prediction.toLowerCase().includes('low') || prediction.toLowerCase().includes('no') ? (
                  <CheckCircle className="h-8 w-8 text-secondary-foreground" />
                ) : (
                  <AlertCircle className="h-8 w-8 text-destructive" />
                )}
              </div>
            </div>
            <CardTitle className="text-xl font-bold text-foreground">Prediction Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6 bg-muted rounded-lg">
              <p className="text-lg font-medium text-foreground">{prediction}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Please consult with a healthcare professional for proper medical advice.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HeartPredictionForm;