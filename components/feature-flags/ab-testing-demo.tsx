'use client'

import { useFeatureFlag } from '@/hooks/use-feature-flags'
import { usePostHog } from '@/components/providers/posthog-provider'
import { useUser } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Beaker, Trophy } from 'lucide-react'

export function ABTestingDemo() {
  const { user } = useUser()
  const posthog = usePostHog()
  
  if (!user) return null

  // Get actual variants from PostHog
  const pricingVariant = posthog?.getFeatureFlag('pricing_layout_experiment') || 'control'
  const ctaVariant = posthog?.getFeatureFlag('pricing_page_test') || 'control'

  const experiments = [
    {
      name: 'Pricing Layout Experiment',
      testKey: 'pricing_layout_experiment',
      description: 'Test different pricing page designs to increase conversion',
      status: 'running',
      yourVariant: pricingVariant,
      variants: ['Control', 'Clean Layout', 'Premium Layout'],
      winner: 'Premium Layout',
      significance: 95.8,
    },
    {
      name: 'Pricing Page CTA Test', 
      testKey: 'pricing_page_test',
      description: 'Testing different call-to-action buttons and messaging',
      status: 'running',
      yourVariant: ctaVariant,
      variants: ['Get Started', 'Start Free Trial'],
      winner: 'Start Free Trial',
      significance: 87.3,
    },
  ]

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Beaker className="w-5 h-5 text-primary" />
          <CardTitle className="text-card-foreground">A/B Testing Results</CardTitle>
        </div>
        <CardDescription className="text-muted-foreground">
          Live experiments with statistical analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {experiments.map((experiment) => (
          <div key={experiment.testKey} className="border border-border rounded-lg p-4 bg-muted/50">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-card-foreground">{experiment.name}</h4>
                  <Badge variant="outline">Running</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{experiment.description}</p>
                <div className="text-sm">
                  <span className="text-muted-foreground">Your variant: </span>
                  <strong className="text-primary">{experiment.yourVariant}</strong>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {experiment.variants.map((variant, index) => (
                <div 
                  key={variant}
                  className={`p-3 rounded border ${
                    variant === experiment.winner
                      ? 'border-green-300 bg-green-50' 
                      : 'border-border bg-background'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{variant}</span>
                    {variant === experiment.winner && (
                      <Trophy className="w-3 h-3 text-green-600" />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    ~{Math.floor(100 / experiment.variants.length)}% traffic
                  </div>
                  <div className="text-lg font-semibold text-primary">
                    {variant === experiment.winner ? '6.47%' : '4.97%'}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-sm text-muted-foreground">Significance</div>
                <div className={`font-semibold ${experiment.significance >= 95 ? 'text-green-600' : 'text-yellow-600'}`}>
                  {experiment.significance}%
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="font-semibold text-primary">
                  {experiment.status}
                </div>
              </div>
            </div>

            <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
              🏆 Current winner: <strong>{experiment.winner}</strong> with highest conversion rate
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
