'use client'

import { useSurveys } from '@/hooks/use-surveys'
import { useAnalytics } from '@/hooks/use-analytics'
import { useUser } from '@/hooks/use-auth'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { 
  MessageSquare,
  Star,
  ThumbsUp,
  ThumbsDown,
  Send,
  Target,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Lightbulb,
  Heart,
  Zap,
  BarChart3
} from 'lucide-react'

interface Survey {
  id: string
  name: string
  type: 'nps' | 'satisfaction' | 'feedback' | 'feature_request' | 'churn' | 'onboarding'
  status: 'active' | 'paused' | 'completed' | 'draft'
  question: string
  description?: string
  targeting: {
    userSegment: string
    triggerEvent?: string
    showAfter?: number // days
    maxShows?: number
  }
  responses: SurveyResponse[]
  metrics: {
    shown: number
    responded: number
    responseRate: number
    avgScore?: number
    npsScore?: number
  }
  createdAt: Date
  settings: {
    position: 'bottom-right' | 'center' | 'top-banner'
    delay: number
    dismissible: boolean
    followUpEnabled: boolean
  }
}

interface SurveyResponse {
  id: string
  userId: string
  userEmail: string
  score?: number
  text?: string
  category?: string
  timestamp: Date
  followUpCompleted?: boolean
}

interface SurveyQuestion {
  id: string
  type: 'rating' | 'text' | 'multiple_choice' | 'yes_no'
  question: string
  required: boolean
  options?: string[]
  maxRating?: number
}

export function SurveysDashboard() {
  const { user, profile } = useUser()
  const { track } = useAnalytics()

  // Only show to admins/owners
  if (!profile || (profile.role !== 'admin' && profile.role !== 'owner')) {
    return null
  }

  // Demo surveys data
  const surveys: Survey[] = [
    {
      id: 'survey_nps',
      name: 'Net Promoter Score',
      type: 'nps',
      status: 'active',
      question: 'How likely are you to recommend our product to a friend or colleague?',
      description: 'Measure customer loyalty and satisfaction',
      targeting: {
        userSegment: 'active_users',
        showAfter: 14,
        maxShows: 1
      },
      responses: [
        { id: 'r1', userId: 'u1', userEmail: 'user1@example.com', score: 9, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
        { id: 'r2', userId: 'u2', userEmail: 'user2@example.com', score: 8, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4) },
        { id: 'r3', userId: 'u3', userEmail: 'user3@example.com', score: 6, text: 'Good product but lacks some features', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8) },
        { id: 'r4', userId: 'u4', userEmail: 'user4@example.com', score: 10, text: 'Amazing tool! Love the interface', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12) },
        { id: 'r5', userId: 'u5', userEmail: 'user5@example.com', score: 4, text: 'Too expensive for what it offers', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) }
      ],
      metrics: {
        shown: 1247,
        responded: 189,
        responseRate: 15.2,
        avgScore: 7.4,
        npsScore: 23
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      settings: {
        position: 'bottom-right',
        delay: 3000,
        dismissible: true,
        followUpEnabled: true
      }
    },
    {
      id: 'survey_satisfaction',
      name: 'Feature Satisfaction',
      type: 'satisfaction',
      status: 'active',
      question: 'How satisfied are you with our new dashboard?',
      description: 'Evaluate user satisfaction with recent feature updates',
      targeting: {
        userSegment: 'feature_users',
        triggerEvent: 'dashboard_visited',
        maxShows: 2
      },
      responses: [
        { id: 'r6', userId: 'u6', userEmail: 'user6@example.com', score: 5, text: 'Very satisfied! Great improvements', timestamp: new Date(Date.now() - 1000 * 60 * 60) },
        { id: 'r7', userId: 'u7', userEmail: 'user7@example.com', score: 4, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3) },
        { id: 'r8', userId: 'u8', userEmail: 'user8@example.com', score: 3, text: 'It\'s okay but could be better', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6) }
      ],
      metrics: {
        shown: 567,
        responded: 89,
        responseRate: 15.7,
        avgScore: 4.2
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      settings: {
        position: 'center',
        delay: 5000,
        dismissible: true,
        followUpEnabled: false
      }
    },
    {
      id: 'survey_churn',
      name: 'Exit Intent Feedback',
      type: 'churn',
      status: 'active',
      question: 'What made you decide to cancel your subscription?',
      description: 'Understand reasons for churn and improve retention',
      targeting: {
        userSegment: 'cancelling_users',
        triggerEvent: 'cancellation_started'
      },
      responses: [
        { id: 'r9', userId: 'u9', userEmail: 'user9@example.com', text: 'Found a cheaper alternative', category: 'price', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5) },
        { id: 'r10', userId: 'u10', userEmail: 'user10@example.com', text: 'Missing features I need', category: 'features', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10) },
        { id: 'r11', userId: 'u11', userEmail: 'user11@example.com', text: 'Too complicated to use', category: 'usability', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 15) }
      ],
      metrics: {
        shown: 45,
        responded: 23,
        responseRate: 51.1
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
      settings: {
        position: 'center',
        delay: 0,
        dismissible: false,
        followUpEnabled: true
      }
    },
    {
      id: 'survey_onboarding',
      name: 'Onboarding Experience',
      type: 'onboarding',
      status: 'completed',
      question: 'How was your onboarding experience?',
      description: 'Improve the new user experience',
      targeting: {
        userSegment: 'new_users',
        showAfter: 3,
        maxShows: 1
      },
      responses: [
        { id: 'r12', userId: 'u12', userEmail: 'user12@example.com', score: 4, text: 'Very helpful and clear', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48) },
        { id: 'r13', userId: 'u13', userEmail: 'user13@example.com', score: 5, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72) }
      ],
      metrics: {
        shown: 234,
        responded: 156,
        responseRate: 66.7,
        avgScore: 4.3
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21),
      settings: {
        position: 'top-banner',
        delay: 2000,
        dismissible: true,
        followUpEnabled: false
      }
    }
  ]

  const getSurveyIcon = (type: string) => {
    switch (type) {
      case 'nps': return <TrendingUp className="w-4 h-4" />
      case 'satisfaction': return <Star className="w-4 h-4" />
      case 'feedback': return <MessageSquare className="w-4 h-4" />
      case 'feature_request': return <Lightbulb className="w-4 h-4" />
      case 'churn': return <AlertCircle className="w-4 h-4" />
      case 'onboarding': return <Zap className="w-4 h-4" />
      default: return <MessageSquare className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getNPSCategory = (score: number) => {
    if (score >= 9) return { label: 'Promoter', color: 'text-green-600' }
    if (score >= 7) return { label: 'Passive', color: 'text-yellow-600' }
    return { label: 'Detractor', color: 'text-red-600' }
  }

  const calculateNPS = (responses: SurveyResponse[]) => {
    if (responses.length === 0) return 0
    const promoters = responses.filter(r => r.score && r.score >= 9).length
    const detractors = responses.filter(r => r.score && r.score <= 6).length
    return Math.round(((promoters - detractors) / responses.length) * 100)
  }

  const toggleSurveyStatus = (survey: Survey) => {
    track('survey_status_toggled', {
      survey_id: survey.id,
      survey_name: survey.name,
      survey_type: survey.type,
      old_status: survey.status,
      new_status: survey.status === 'active' ? 'paused' : 'active',
      toggled_by: user?.email,
      timestamp: new Date().toISOString(),
    })

    alert(`Survey "${survey.name}" ${survey.status === 'active' ? 'PAUSED' : 'ACTIVATED'}`)
  }

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <CardTitle>Surveys & Feedback</CardTitle>
          </div>
          <CardDescription>
            Collect user feedback and measure satisfaction across your product
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{surveys.filter(s => s.status === 'active').length}</div>
              <div className="text-sm text-muted-foreground">Active Surveys</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {surveys.reduce((sum, s) => sum + s.responses.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Responses</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {(surveys.reduce((sum, s) => sum + s.metrics.responseRate, 0) / surveys.length).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Avg. Response Rate</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {calculateNPS(surveys.find(s => s.type === 'nps')?.responses || [])}
              </div>
              <div className="text-sm text-muted-foreground">NPS Score</div>
            </div>
          </div>

          {/* Survey Cards */}
          {surveys.map((survey) => (
            <div key={survey.id} className="border border-border rounded-lg p-6">
              {/* Survey Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getSurveyIcon(survey.type)}
                    <h3 className="text-lg font-semibold">{survey.name}</h3>
                    <Badge className={getStatusColor(survey.status)}>
                      {survey.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {survey.status === 'paused' && <Clock className="w-3 h-3 mr-1" />}
                      {survey.status.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {survey.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{survey.description}</p>
                  <p className="font-medium">{survey.question}</p>
                </div>
                
                <Button
                  size="sm"
                  variant={survey.status === 'active' ? "outline" : "default"}
                  onClick={() => toggleSurveyStatus(survey)}
                >
                  {survey.status === 'active' ? 'Pause' : 'Activate'}
                </Button>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-muted/30 rounded">
                  <div className="text-lg font-semibold">{survey.metrics.shown.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Shown</div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded">
                  <div className="text-lg font-semibold">{survey.responses.length}</div>
                  <div className="text-xs text-muted-foreground">Responses</div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded">
                  <div className="text-lg font-semibold">{survey.metrics.responseRate}%</div>
                  <div className="text-xs text-muted-foreground">Response Rate</div>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded">
                  <div className="text-lg font-semibold">
                    {survey.metrics.avgScore?.toFixed(1) || survey.metrics.npsScore || '-'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {survey.type === 'nps' ? 'NPS Score' : 'Avg. Score'}
                  </div>
                </div>
              </div>

              {/* Recent Responses */}
              <div>
                <h4 className="font-medium mb-3">Recent Responses</h4>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {survey.responses.slice(0, 5).map((response) => (
                    <div key={response.id} className="flex items-start gap-3 p-3 bg-muted/20 rounded">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{response.userEmail}</span>
                          {response.score && (
                            <div className="flex items-center gap-1">
                              {survey.type === 'nps' ? (
                                <Badge className={`${getNPSCategory(response.score).color} bg-transparent border`}>
                                  {response.score}/10 - {getNPSCategory(response.score).label}
                                </Badge>
                              ) : (
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: response.score }, (_, i) => (
                                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  ))}
                                  <span className="text-sm text-muted-foreground">({response.score}/5)</span>
                                </div>
                              )}
                            </div>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {new Intl.RelativeTimeFormat('en').format(
                              Math.floor((response.timestamp.getTime() - Date.now()) / (1000 * 60 * 60)),
                              'hours'
                            )}
                          </span>
                        </div>
                        {response.text && (
                          <p className="text-sm text-muted-foreground">{response.text}</p>
                        )}
                        {response.category && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            {response.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

// Survey popup component
interface SurveyPopupProps {
  survey: Survey
  onResponse: (response: { score?: number; text?: string }) => void
  onDismiss: () => void
}

export function SurveyPopup({ survey, onResponse, onDismiss }: SurveyPopupProps) {
  const [score, setScore] = useState<number | null>(null)
  const [text, setText] = useState('')
  const [step, setStep] = useState<'rating' | 'feedback'>('rating')
  const { track } = useAnalytics()

  const handleRatingSubmit = (selectedScore: number) => {
    setScore(selectedScore)
    
    track('survey_rating_submitted', {
      survey_id: survey.id,
      survey_type: survey.type,
      score: selectedScore,
      timestamp: new Date().toISOString(),
    })

    if (survey.settings.followUpEnabled && (selectedScore <= 6 || selectedScore >= 9)) {
      setStep('feedback')
    } else {
      onResponse({ score: selectedScore })
    }
  }

  const handleFeedbackSubmit = () => {
    track('survey_feedback_submitted', {
      survey_id: survey.id,
      survey_type: survey.type,
      score,
      has_text: !!text,
      text_length: text.length,
      timestamp: new Date().toISOString(),
    })

    onResponse({ score: score || undefined, text })
  }

  const getPositionClasses = () => {
    switch (survey.settings.position) {
      case 'center':
        return 'fixed inset-0 flex items-center justify-center bg-black/50 z-50'
      case 'top-banner':
        return 'fixed top-0 left-0 right-0 z-50'
      default:
        return 'fixed bottom-4 right-4 z-50'
    }
  }

  return (
    <div className={getPositionClasses()}>
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{survey.name}</CardTitle>
              <CardDescription>{survey.question}</CardDescription>
            </div>
            {survey.settings.dismissible && (
              <Button size="sm" variant="ghost" onClick={onDismiss}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 'rating' ? (
            <>
              {survey.type === 'nps' && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Not likely</span>
                    <span>Very likely</span>
                  </div>
                  <div className="flex gap-2">
                    {Array.from({ length: 11 }, (_, i) => (
                      <Button
                        key={i}
                        size="sm"
                        variant={score === i ? "default" : "outline"}
                        className="w-8 h-8 p-0"
                        onClick={() => handleRatingSubmit(i)}
                      >
                        {i}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {survey.type === 'satisfaction' && (
                <div className="space-y-3">
                  <div className="flex gap-2 justify-center">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Button
                        key={i}
                        size="sm"
                        variant="ghost"
                        className="p-2"
                        onClick={() => handleRatingSubmit(i + 1)}
                      >
                        <Star className={`w-6 h-6 ${score === i + 1 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {(survey.type === 'feedback' || survey.type === 'churn') && (
                <div className="space-y-3">
                  <Textarea
                    placeholder="Share your feedback..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={3}
                  />
                  <Button onClick={() => onResponse({ text })} className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Submit Feedback
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {score && score <= 6 
                  ? "We'd love to know how we can improve. What went wrong?"
                  : "That's great! What did you like most about your experience?"
                }
              </p>
              <Textarea
                placeholder="Tell us more..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button onClick={handleFeedbackSubmit} className="flex-1">
                  <Send className="w-4 h-4 mr-2" />
                  Submit
                </Button>
                <Button variant="outline" onClick={() => onResponse({ score: score || undefined })}>
                  Skip
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
