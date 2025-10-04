'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, Brain, Shield, Zap, BookOpen, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Brain className="h-4 w-4" />
              AI-Powered Education Policy Assistant
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              GITAM Policy AI
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Get instant, accurate answers about GITAM education policies with comprehensive citations and real-time processing insights.
            </p>
            <div className="flex gap-4 justify-center">
                <Link href="/chat">
                  <Button size="lg" className="px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Start Chatting
                  </Button>
                </Link>
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-border hover:bg-accent">
                <BookOpen className="h-5 w-5 mr-2" />
                View Documentation
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/80 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Brain className="h-5 w-5 text-blue-400" />
                  </div>
                  Intelligent Processing
                </CardTitle>
                <CardDescription>
                  Advanced AI with multi-modal retrieval and language understanding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Combines dense embeddings, sparse search, and knowledge graph traversal for comprehensive answers.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/80 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-green-400" />
                  </div>
                  Verified Citations
                </CardTitle>
                <CardDescription>
                  Every answer backed by verifiable sources and exact document locations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Complete audit trail with document references, page numbers, and text spans for transparency.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/80 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Zap className="h-5 w-5 text-purple-400" />
                  </div>
                  Real-time Insights
                </CardTitle>
                <CardDescription>
                  Live processing traces and system monitoring for developers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Step-by-step visibility into query processing, retrieval, and LLM controller iterations.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Status Banner */}
          <Card className="border-amber-500/20 bg-amber-500/5 mb-16">
            <CardHeader>
              <CardTitle className="text-amber-400 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Prototype Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-300/80 leading-relaxed">
                This is a high-accuracy prototype demonstrating the complete architecture and UI flow. 
                All endpoints return placeholder data ("N/A" or "Coming soon") until integration with 
                vector databases, knowledge graphs, and LLM services is complete.
              </p>
            </CardContent>
          </Card>

          {/* Call to Action */}
            <div className="text-center bg-gradient-to-r from-blue-600/10 to-blue-600/5 rounded-2xl p-12 border border-blue-600/20">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Experience the Future?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Try the modern ChatGPT-style interface and see how AI can transform education policy research.
            </p>
            <Link href="/chat">
                <Button size="lg" className="px-12 py-4 text-lg bg-blue-600 hover:bg-blue-700 group">
                <MessageSquare className="h-5 w-5 mr-2" />
                Start Your First Chat
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
