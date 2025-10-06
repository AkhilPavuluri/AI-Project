"use client"

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  NodeTypes,
  Handle,
  Position,
  ReactFlowProvider,
  MiniMap,
} from 'reactflow'
import 'reactflow/dist/style.css'
import {
  Database,
  Search,
  Brain,
  Zap,
  Clock,
  Globe,
  FileText,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  Network,
  Cpu,
  HardDrive,
  Filter,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  ChevronDownIcon,
  BarChart3,
  Settings,
  Workflow,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Custom Node Components
const DataFlowNode = ({ data, selected }: { data: any; selected: boolean }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className={`px-4 py-3 rounded-lg border-2 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 min-w-[200px] ${
      selected ? 'ring-2 ring-blue-500' : ''
    }`}
  >
    <Handle type="target" position={Position.Top} />
    <div className="flex items-center gap-2 mb-2">
      <data.icon className="h-5 w-5 text-blue-600" />
      <span className="font-semibold text-blue-800">{data.label}</span>
    </div>
    <p className="text-sm text-blue-700">{data.description}</p>
    <Handle type="source" position={Position.Bottom} />
  </motion.div>
)

const ProcessingNode = ({ data, selected }: { data: any; selected: boolean }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className={`px-4 py-3 rounded-lg border-2 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300 min-w-[200px] ${
      selected ? 'ring-2 ring-purple-500' : ''
    }`}
  >
    <Handle type="target" position={Position.Top} />
    <div className="flex items-center gap-2 mb-2">
      <data.icon className="h-5 w-5 text-purple-600" />
      <span className="font-semibold text-purple-800">{data.label}</span>
    </div>
    <p className="text-sm text-purple-700">{data.description}</p>
    <Handle type="source" position={Position.Bottom} />
  </motion.div>
)

const StorageNode = ({ data, selected }: { data: any; selected: boolean }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className={`px-4 py-3 rounded-lg border-2 bg-gradient-to-br from-green-50 to-green-100 border-green-300 min-w-[200px] ${
      selected ? 'ring-2 ring-green-500' : ''
    }`}
  >
    <Handle type="target" position={Position.Top} />
    <div className="flex items-center gap-2 mb-2">
      <data.icon className="h-5 w-5 text-green-600" />
      <span className="font-semibold text-green-800">{data.label}</span>
    </div>
    <p className="text-sm text-green-700">{data.description}</p>
    <Handle type="source" position={Position.Bottom} />
  </motion.div>
)

const OutputNode = ({ data, selected }: { data: any; selected: boolean }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className={`px-4 py-3 rounded-lg border-2 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300 min-w-[200px] ${
      selected ? 'ring-2 ring-orange-500' : ''
    }`}
  >
    <Handle type="target" position={Position.Top} />
    <div className="flex items-center gap-2 mb-2">
      <data.icon className="h-5 w-5 text-orange-600" />
      <span className="font-semibold text-orange-800">{data.label}</span>
    </div>
    <p className="text-sm text-orange-700">{data.description}</p>
    <Handle type="source" position={Position.Bottom} />
  </motion.div>
)

const DecisionNode = ({ data, selected }: { data: any; selected: boolean }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className={`px-4 py-3 rounded-lg border-2 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300 min-w-[200px] transform rotate-45 ${
      selected ? 'ring-2 ring-yellow-500' : ''
    }`}
  >
    <Handle type="target" position={Position.Top} />
    <div className="flex items-center gap-2 mb-2 transform -rotate-45">
      <data.icon className="h-5 w-5 text-yellow-600" />
      <span className="font-semibold text-yellow-800">{data.label}</span>
    </div>
    <p className="text-sm text-yellow-700 transform -rotate-45">{data.description}</p>
    <Handle type="source" position={Position.Bottom} />
  </motion.div>
)

const nodeTypes: NodeTypes = {
  dataFlow: DataFlowNode,
  processing: ProcessingNode,
  storage: StorageNode,
  output: OutputNode,
  decision: DecisionNode,
}

// Component Details Data
const componentDetails = {
  realTimeCrawler: {
    title: "📥 Real-time Crawler",
    description: "Automated data collection from multiple legal and educational sources",
    features: [
      "Supreme Court (SC) judgments",
      "High Court (HC) rulings", 
      "UGC notifications",
      "AICTE guidelines",
      "State Government Orders",
      "Policy reports and documents"
    ],
    technology: "Python, Scrapy, BeautifulSoup",
    animation: "crawling"
  },
  dataPreprocessingPipeline: {
    title: "Data Preprocessing Pipeline",
    description: "Multi-stage processing to prepare raw data for storage and retrieval",
    features: [
      "OCR for scanned documents",
      "Multi-language translation",
      "Legal-aware text chunking",
      "Named Entity Recognition",
      "Citation extraction and linking"
    ],
    technology: "Tesseract OCR, Transformers, spaCy",
    animation: "processing"
  },
  ocrTranslation: {
    title: "OCR and Translation to English",
    description: "Document processing and language conversion",
    features: [
      "Optical Character Recognition",
      "Multi-language support",
      "Document format conversion",
      "Text extraction and cleaning"
    ],
    technology: "Tesseract OCR, Google Translate API",
    animation: "processing"
  },
  legalAwareChunking: {
    title: "Legal-aware Chunking",
    description: "Context-aware text segmentation for legal documents",
    features: [
      "Legal context preservation",
      "Semantic boundary detection",
      "Citation-aware splitting",
      "Document structure maintenance"
    ],
    technology: "Custom chunking algorithms, spaCy",
    animation: "processing"
  },
  nerCitationExtraction: {
    title: "NER and Citation Extraction",
    description: "Entity recognition and citation linking",
    features: [
      "Named Entity Recognition",
      "Legal entity identification",
      "Citation extraction",
      "Cross-reference linking"
    ],
    technology: "spaCy NER, Custom models",
    animation: "processing"
  },
  keywordSearchBM25: {
    title: "Keyword Search BM25",
    description: "Traditional keyword-based search using BM25 algorithm",
    features: [
      "BM25 ranking algorithm",
      "Keyword matching",
      "Term frequency analysis",
      "Document scoring"
    ],
    technology: "Elasticsearch, BM25 algorithm",
    animation: "fast-search"
  },
  denseRetrieverE5: {
    title: "Dense Retriever E5 / MiniLM",
    description: "Semantic similarity search using dense embeddings",
    features: [
      "E5 embedding model",
      "MiniLM embeddings",
      "Semantic similarity",
      "Vector-based retrieval"
    ],
    technology: "Sentence Transformers, FAISS",
    animation: "vectorizing"
  },
  bridgeTableLookup: {
    title: "Bridge Table Lookup 1-hop",
    description: "Direct relationship lookup using bridge tables",
    features: [
      "1-hop relationship queries",
      "Direct citation links",
      "Fast lookup operations",
      "Cross-document connections"
    ],
    technology: "PostgreSQL, Redis",
    animation: "linking"
  },
  evidenceMergeRerank: {
    title: "Evidence Merge and Rerank",
    description: "Combine and rank evidence from multiple sources",
    features: [
      "Multi-source evidence fusion",
      "Relevance scoring",
      "Duplicate removal",
      "Quality-based ranking"
    ],
    technology: "Custom ranking algorithms",
    animation: "processing"
  },
  advancedRetrievalSPLADE: {
    title: "Advanced Retrieval SPLADE or ColBERT",
    description: "Advanced semantic retrieval using SPLADE/ColBERT",
    features: [
      "SPLADE sparse retrieval",
      "ColBERT dense retrieval",
      "Advanced semantic matching",
      "Multi-modal embeddings"
    ],
    technology: "SPLADE, ColBERT, Transformers",
    animation: "deep-thinking"
  },
  graphExpansion: {
    title: "Graph Expansion 2-3 Hops in KG",
    description: "Multi-hop graph traversal in knowledge graph",
    features: [
      "2-3 hop graph traversal",
      "Relationship discovery",
      "Context expansion",
      "Path finding algorithms"
    ],
    technology: "Neo4j, NetworkX, Graph algorithms",
    animation: "graphing"
  },
  evidencePoolAssembly: {
    title: "Evidence Pool Assembly",
    description: "Gather and organize evidence from multiple sources",
    features: [
      "Multi-source evidence collection",
      "Evidence organization",
      "Quality assessment",
      "Relevance filtering"
    ],
    technology: "Custom assembly algorithms",
    animation: "processing"
  },
  selfRAGVerification: {
    title: "Self-RAG / Hydra Verification",
    description: "Evidence verification and validation using Self-RAG",
    features: [
      "Self-RAG verification",
      "Hydra consistency checking",
      "Evidence validation",
      "Quality assurance"
    ],
    technology: "Self-RAG, Hydra verification",
    animation: "thinking"
  },
  temporalGraphRAG: {
    title: "Temporal GraphRAG",
    description: "Time-aware Edge Filtering for temporal analysis",
    features: [
      "Time-aware graph filtering",
      "Temporal relationship analysis",
      "Historical context",
      "Time-based edge weighting"
    ],
    technology: "Temporal GraphRAG, Time-aware algorithms",
    animation: "time-analysis"
  },
  multiJurisdictionAnalysis: {
    title: "Multi-jurisdiction Link Analysis",
    description: "Cross-jurisdiction relationship analysis",
    features: [
      "Cross-jurisdiction analysis",
      "Legal system comparison",
      "Conflict identification",
      "Harmonization analysis"
    ],
    technology: "Custom analysis algorithms",
    animation: "processing"
  },
  conflictRiskDetection: {
    title: "Conflict and Risk Detection Engine",
    description: "Identify conflicts and risks in legal documents",
    features: [
      "Conflict detection",
      "Risk assessment",
      "Compliance checking",
      "Anomaly detection"
    ],
    technology: "Machine Learning, Risk assessment models",
    animation: "processing"
  },
  evidencePool: {
    title: "Evidence Pool",
    description: "Centralized evidence collection from all retrieval modes",
    features: [
      "Centralized evidence storage",
      "Multi-modal evidence",
      "Evidence deduplication",
      "Quality scoring"
    ],
    technology: "Custom evidence management",
    animation: "processing"
  },
  llmSelfRAGController: {
    title: "LLM + Self-RAG Controller",
    description: "Advanced language model integration with Self-RAG",
    features: [
      "Multi-model support (Llama 3, GPT-4o, Mistral)",
      "Self-RAG integration",
      "Response generation",
      "Quality control"
    ],
    technology: "Ollama, OpenAI API, Self-RAG",
    animation: "thinking"
  },
  reflectFilterSpans: {
    title: "Reflect and Filter Unsupported Spans",
    description: "Quality control and filtering of unsupported content",
    features: [
      "Content validation",
      "Unsupported span detection",
      "Quality filtering",
      "Confidence scoring"
    ],
    technology: "Custom filtering algorithms",
    animation: "processing"
  },
  generateCanonicalAnswer: {
    title: "Generate Canonical English Answer",
    description: "Create structured, canonical answer in English",
    features: [
      "Structured answer generation",
      "Canonical format",
      "English language output",
      "Answer templating"
    ],
    technology: "LLM generation, Answer templates",
    animation: "processing"
  },
  sentenceLevelCitation: {
    title: "Sentence-level Citation Binding",
    description: "Link specific sentences to their sources",
    features: [
      "Sentence-level attribution",
      "Source linking",
      "Citation binding",
      "Verification tracking"
    ],
    technology: "Custom citation binding",
    animation: "processing"
  },
  englishAnswer: {
    title: "English Answer",
    description: "Primary generated answer in English",
    features: [
      "Primary answer output",
      "English language",
      "Structured format",
      "Comprehensive content"
    ],
    technology: "LLM generation",
    animation: "outputting"
  },
  translateHindiTelugu: {
    title: "Translate to Hindi / Telugu",
    description: "Multi-language support for regional languages",
    features: [
      "Hindi translation",
      "Telugu translation",
      "Regional language support",
      "Cultural adaptation"
    ],
    technology: "Translation APIs, Custom models",
    animation: "outputting"
  },
  inlineCitations: {
    title: "Inline Citations from Verified Sources",
    description: "Source attribution with inline citations",
    features: [
      "Inline citation placement",
      "Verified source attribution",
      "Citation formatting",
      "Source verification"
    ],
    technology: "Citation management system",
    animation: "outputting"
  },
  outputFormats: {
    title: "Output Formats",
    description: "Multiple output formats for different use cases",
    features: [
      "Briefs format",
      "Draft documents",
      "Timeline visualization",
      "Custom formatting"
    ],
    technology: "Template engines, Formatting libraries",
    animation: "outputting"
  },
  storageSystems: {
    title: "📦 Storage Systems",
    description: "Centralized data storage infrastructure",
    features: [
      "Vector database storage",
      "Knowledge graph storage",
      "Bridge table storage",
      "Metadata management"
    ],
    technology: "ChromaDB, Neo4j, PostgreSQL",
    animation: "processing"
  },
  vectorDB: {
    title: "Vector DB",
    description: "Semantic search storage using vector embeddings",
    features: [
      "Vector embedding storage",
      "Semantic search indexing",
      "Similarity search",
      "Metadata storage"
    ],
    technology: "ChromaDB, FAISS, Pinecone",
    animation: "vectorizing"
  },
  knowledgeGraphDB: {
    title: "Knowledge Graph DB",
    description: "Graph database for relationship storage",
    features: [
      "Graph relationship storage",
      "Entity linking",
      "Graph traversal",
      "Relationship queries"
    ],
    technology: "Neo4j, ArangoDB, Amazon Neptune",
    animation: "graphing"
  },
  bridgeTableDB: {
    title: "Bridge Table DB",
    description: "Quick lookup storage for direct relationships",
    features: [
      "Fast lookup operations",
      "Direct relationship storage",
      "Citation links",
      "Cross-reference storage"
    ],
    technology: "PostgreSQL, Redis, MongoDB",
    animation: "linking"
  },
}

// Animation Components
const CrawlingAnimation = () => (
  <motion.div className="flex space-x-1">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-2 h-2 bg-blue-500 rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: i * 0.2,
        }}
      />
    ))}
  </motion.div>
)

const ProcessingAnimation = () => (
  <motion.div className="relative w-8 h-8">
    <motion.div
      className="absolute inset-0 border-2 border-purple-500 border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  </motion.div>
)

const VectorizingAnimation = () => (
  <motion.div className="flex space-x-1">
    {[0, 1, 2, 3].map((i) => (
      <motion.div
        key={i}
        className="w-1 h-4 bg-green-500"
        animate={{
          scaleY: [1, 2, 1],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          delay: i * 0.1,
        }}
      />
    ))}
  </motion.div>
)

const GraphingAnimation = () => (
  <motion.div className="relative w-8 h-8">
    <motion.circle
      cx="4"
      cy="4"
      r="2"
      fill="green"
      animate={{
        scale: [1, 1.5, 1],
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
      }}
    />
    <motion.line
      x1="2"
      y1="6"
      x2="6"
      y2="2"
      stroke="green"
      strokeWidth="1"
      animate={{
        pathLength: [0, 1, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
      }}
    />
  </motion.div>
)

const LinkingAnimation = () => (
  <motion.div className="flex items-center space-x-1">
    <motion.div
      className="w-2 h-2 bg-orange-500 rounded-full"
      animate={{ x: [0, 20, 0] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
    <motion.div
      className="w-2 h-2 bg-orange-500 rounded-full"
      animate={{ x: [0, -20, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }}
    />
  </motion.div>
)

const PlanningAnimation = () => (
  <motion.div className="flex space-x-1">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-1 h-6 bg-purple-500"
        animate={{
          scaleY: [1, 0.3, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: i * 0.2,
        }}
      />
    ))}
  </motion.div>
)

const FastSearchAnimation = () => (
  <motion.div className="relative w-8 h-8">
    <motion.div
      className="absolute inset-0"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
    >
      <Search className="w-6 h-6 text-purple-500" />
    </motion.div>
  </motion.div>
)

const DeepThinkingAnimation = () => (
  <motion.div className="flex space-x-1">
    {[0, 1, 2, 3, 4].map((i) => (
      <motion.div
        key={i}
        className="w-1 h-8 bg-purple-500"
        animate={{
          scaleY: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          delay: i * 0.1,
        }}
      />
    ))}
  </motion.div>
)

const TimeAnalysisAnimation = () => (
  <motion.div className="relative w-8 h-8">
    <motion.div
      className="absolute inset-0 border-2 border-yellow-500 rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
    />
    <Clock className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500" />
  </motion.div>
)

const ThinkingAnimation = () => (
  <motion.div className="flex space-x-1">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-2 h-2 bg-orange-500 rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: i * 0.3,
        }}
      />
    ))}
  </motion.div>
)

const OutputtingAnimation = () => (
  <motion.div className="flex space-x-1">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-2 h-2 bg-orange-500 rounded-full"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          delay: i * 0.2,
        }}
      />
    ))}
  </motion.div>
)

const getAnimationComponent = (animationType: string) => {
  switch (animationType) {
    case 'crawling': return <CrawlingAnimation />
    case 'processing': return <ProcessingAnimation />
    case 'vectorizing': return <VectorizingAnimation />
    case 'graphing': return <GraphingAnimation />
    case 'linking': return <LinkingAnimation />
    case 'planning': return <PlanningAnimation />
    case 'fast-search': return <FastSearchAnimation />
    case 'deep-thinking': return <DeepThinkingAnimation />
    case 'time-analysis': return <TimeAnalysisAnimation />
    case 'thinking': return <ThinkingAnimation />
    case 'outputting': return <OutputtingAnimation />
    default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />
  }
}

function InteractiveArchitectureFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedView, setSelectedView] = useState('all-in-one')

  // All-in-One View (Complete Architecture) - Optimized Grid Layout
  const allInOneNodes: Node[] = [
    // === DATA INGESTION PHASE (Column 1) ===
    {
      id: 'realTimeCrawler',
      type: 'dataFlow',
      position: { x: 100, y: 100 },
      data: {
        label: '📥 Real-time Crawler',
        description: 'Sources: SC/HC, UGC, AICTE, State GOs, Reports',
        icon: Globe,
      },
    },
    {
      id: 'dataPreprocessingPipeline',
      type: 'dataFlow',
      position: { x: 100, y: 300 },
      data: {
        label: 'Data Preprocessing Pipeline',
        description: 'OCR, Translation, Chunking, NER',
        icon: FileText,
      },
    },
    {
      id: 'ocrTranslation',
      type: 'dataFlow',
      position: { x: 50, y: 500 },
      data: {
        label: 'OCR and Translation to English',
        description: 'Document processing and language conversion',
        icon: FileText,
      },
    },
    {
      id: 'legalAwareChunking',
      type: 'dataFlow',
      position: { x: 100, y: 500 },
      data: {
        label: 'Legal-aware Chunking',
        description: 'Context-aware text segmentation',
        icon: Layers,
      },
    },
    {
      id: 'nerCitationExtraction',
      type: 'dataFlow',
      position: { x: 150, y: 500 },
      data: {
        label: 'NER and Citation Extraction',
        description: 'Entity recognition and citation linking',
        icon: Search,
      },
    },

    // === STORAGE SYSTEMS (Column 2) ===
    {
      id: 'vectorIndex',
      type: 'storage',
      position: { x: 400, y: 200 },
      data: {
        label: 'Vector Index',
        description: 'Dense + ColBERT embeddings',
        icon: Database,
      },
    },
    {
      id: 'knowledgeGraph',
      type: 'storage',
      position: { x: 400, y: 400 },
      data: {
        label: 'Knowledge Graph',
        description: 'Acts, Judgments, GOs, Reports',
        icon: Network,
      },
    },
    {
      id: 'bridgeTable',
      type: 'storage',
      position: { x: 400, y: 600 },
      data: {
        label: 'Bridge Table',
        description: 'Explicit 1-hop Links',
        icon: Layers,
      },
    },
    {
      id: 'storageSystems',
      type: 'storage',
      position: { x: 400, y: 800 },
      data: {
        label: '📦 Storage Systems',
        description: 'Centralized data storage',
        icon: HardDrive,
      },
    },
    {
      id: 'vectorDB',
      type: 'storage',
      position: { x: 350, y: 1000 },
      data: {
        label: 'Vector DB',
        description: 'Semantic search storage',
        icon: Database,
      },
    },
    {
      id: 'knowledgeGraphDB',
      type: 'storage',
      position: { x: 400, y: 1000 },
      data: {
        label: 'Knowledge Graph DB',
        description: 'Relationship storage',
        icon: Network,
      },
    },
    {
      id: 'bridgeTableDB',
      type: 'storage',
      position: { x: 450, y: 1000 },
      data: {
        label: 'Bridge Table DB',
        description: 'Quick lookup storage',
        icon: Layers,
      },
    },

    // === QUERY PROCESSING (Column 3) ===
    {
      id: 'userQuery',
      type: 'dataFlow',
      position: { x: 700, y: 100 },
      data: {
        label: 'User Query',
        description: 'Natural language question',
        icon: Search,
      },
    },
    {
      id: 'queryPlanner',
      type: 'processing',
      position: { x: 700, y: 300 },
      data: {
        label: 'Query Planner',
        description: 'Language Detection, Intent Analysis',
        icon: Brain,
      },
    },
    {
      id: 'languageDetection',
      type: 'processing',
      position: { x: 650, y: 500 },
      data: {
        label: 'Language Detection → Translate → English',
        description: 'Multi-language support and translation',
        icon: Globe,
      },
    },
    {
      id: 'intentDetection',
      type: 'processing',
      position: { x: 750, y: 500 },
      data: {
        label: 'Intent Detection → Select Mode',
        description: 'Query intent classification',
        icon: Brain,
      },
    },
    {
      id: 'retrievalModeSelection',
      type: 'decision',
      position: { x: 700, y: 700 },
      data: {
        label: 'Retrieval Mode Selection',
        description: 'Fast Query | Complex Reasoning | Temporal Analysis',
        icon: Filter,
      },
    },

    // === NORMAL MODE - FAST RETRIEVAL (Column 4) ===
    {
      id: 'normalMode',
      type: 'processing',
      position: { x: 1000, y: 200 },
      data: {
        label: '⚡ Normal Mode - Fast Retrieval',
        description: 'BM25, Dense, Bridge Lookup',
        icon: Zap,
      },
    },
    {
      id: 'keywordSearchBM25',
      type: 'processing',
      position: { x: 950, y: 400 },
      data: {
        label: 'Keyword Search BM25',
        description: 'Traditional keyword-based search',
        icon: Search,
      },
    },
    {
      id: 'denseRetrieverE5',
      type: 'processing',
      position: { x: 1000, y: 400 },
      data: {
        label: 'Dense Retriever E5 / MiniLM',
        description: 'Semantic similarity search',
        icon: Brain,
      },
    },
    {
      id: 'bridgeTableLookup',
      type: 'processing',
      position: { x: 1050, y: 400 },
      data: {
        label: 'Bridge Table Lookup 1-hop',
        description: 'Direct relationship lookup',
        icon: Layers,
      },
    },
    {
      id: 'evidenceMergeRerank',
      type: 'processing',
      position: { x: 1000, y: 600 },
      data: {
        label: 'Evidence Merge and Rerank',
        description: 'Combine and rank evidence',
        icon: TrendingUp,
      },
    },

    // === DEEP MODE - GRAPHRAG REASONING (Column 5) ===
    {
      id: 'deepMode',
      type: 'processing',
      position: { x: 1300, y: 200 },
      data: {
        label: '🧭 Deep Mode - GraphRAG Reasoning',
        description: 'Multi-hop graph traversal',
        icon: Brain,
      },
    },
    {
      id: 'advancedRetrievalSPLADE',
      type: 'processing',
      position: { x: 1250, y: 400 },
      data: {
        label: 'Advanced Retrieval SPLADE or ColBERT',
        description: 'Advanced semantic retrieval',
        icon: Search,
      },
    },
    {
      id: 'graphExpansion',
      type: 'processing',
      position: { x: 1300, y: 400 },
      data: {
        label: 'Graph Expansion 2-3 Hops in KG',
        description: 'Multi-hop graph traversal',
        icon: Network,
      },
    },
    {
      id: 'evidencePoolAssembly',
      type: 'processing',
      position: { x: 1350, y: 400 },
      data: {
        label: 'Evidence Pool Assembly',
        description: 'Gather and organize evidence',
        icon: Layers,
      },
    },
    {
      id: 'selfRAGVerification',
      type: 'processing',
      position: { x: 1300, y: 600 },
      data: {
        label: 'Self-RAG / Hydra Verification',
        description: 'Evidence verification and validation',
        icon: CheckCircle,
      },
    },

    // === TEMPORAL MODE - FULL CROSS-SOURCE REASONING (Column 6) ===
    {
      id: 'temporalMode',
      type: 'processing',
      position: { x: 1600, y: 200 },
      data: {
        label: '🕰 Temporal Mode - Full Cross-Source Reasoning',
        description: 'Time-aware analysis',
        icon: Clock,
      },
    },
    {
      id: 'temporalGraphRAG',
      type: 'processing',
      position: { x: 1550, y: 400 },
      data: {
        label: 'Temporal GraphRAG',
        description: 'Time-aware Edge Filtering',
        icon: Clock,
      },
    },
    {
      id: 'multiJurisdictionAnalysis',
      type: 'processing',
      position: { x: 1600, y: 400 },
      data: {
        label: 'Multi-jurisdiction Link Analysis',
        description: 'Cross-jurisdiction relationship analysis',
        icon: Network,
      },
    },
    {
      id: 'conflictRiskDetection',
      type: 'processing',
      position: { x: 1600, y: 600 },
      data: {
        label: 'Conflict and Risk Detection Engine',
        description: 'Identify conflicts and risks',
        icon: AlertCircle,
      },
    },

    // === EVIDENCE PROCESSING (Column 7) ===
    {
      id: 'evidencePool',
      type: 'processing',
      position: { x: 1900, y: 200 },
      data: {
        label: 'Evidence Pool',
        description: 'Centralized evidence collection',
        icon: Layers,
      },
    },
    {
      id: 'llmSelfRAGController',
      type: 'processing',
      position: { x: 1900, y: 400 },
      data: {
        label: 'LLM + Self-RAG Controller',
        description: 'Llama 3 / GPT-4o / Mistral',
        icon: Cpu,
      },
    },
    {
      id: 'reflectFilterSpans',
      type: 'processing',
      position: { x: 1850, y: 600 },
      data: {
        label: 'Reflect and Filter Unsupported Spans',
        description: 'Quality control and filtering',
        icon: Filter,
      },
    },
    {
      id: 'generateCanonicalAnswer',
      type: 'processing',
      position: { x: 1900, y: 600 },
      data: {
        label: 'Generate Canonical English Answer',
        description: 'Create structured answer',
        icon: FileText,
      },
    },
    {
      id: 'sentenceLevelCitation',
      type: 'processing',
      position: { x: 1950, y: 600 },
      data: {
        label: 'Sentence-level Citation Binding',
        description: 'Link answers to sources',
        icon: CheckCircle,
      },
    },

    // === OUTPUT LAYER (Column 8) ===
    {
      id: 'outputLayer',
      type: 'output',
      position: { x: 2200, y: 200 },
      data: {
        label: 'Output Layer',
        description: 'Multi-format, Multi-language',
        icon: FileText,
      },
    },
    {
      id: 'englishAnswer',
      type: 'output',
      position: { x: 2150, y: 400 },
      data: {
        label: 'English Answer',
        description: 'Primary generated answer',
        icon: FileText,
      },
    },
    {
      id: 'translateHindiTelugu',
      type: 'output',
      position: { x: 2200, y: 400 },
      data: {
        label: 'Translate to Hindi / Telugu',
        description: 'Multi-language support',
        icon: Globe,
      },
    },
    {
      id: 'inlineCitations',
      type: 'output',
      position: { x: 2250, y: 400 },
      data: {
        label: 'Inline Citations from Verified Sources',
        description: 'Source attribution',
        icon: CheckCircle,
      },
    },
    {
      id: 'outputFormats',
      type: 'output',
      position: { x: 2200, y: 600 },
      data: {
        label: 'Output Formats',
        description: 'Briefs, Drafts, Timelines',
        icon: FileText,
      },
    },
  ]

  // Define edges with animations for All-in-One view
  const allInOneEdges: Edge[] = [
    // Data Ingestion Flow
    { id: 'e1', source: 'realTimeCrawler', target: 'dataPreprocessingPipeline', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
    { id: 'e2', source: 'dataPreprocessingPipeline', target: 'ocrTranslation', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
    { id: 'e3', source: 'dataPreprocessingPipeline', target: 'legalAwareChunking', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
    { id: 'e4', source: 'dataPreprocessingPipeline', target: 'nerCitationExtraction', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
    
    // Data Outputs
    { id: 'e5', source: 'ocrTranslation', target: 'vectorIndex', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
    { id: 'e6', source: 'legalAwareChunking', target: 'vectorIndex', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
    { id: 'e7', source: 'nerCitationExtraction', target: 'vectorIndex', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
    { id: 'e8', source: 'ocrTranslation', target: 'knowledgeGraph', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
    { id: 'e9', source: 'legalAwareChunking', target: 'knowledgeGraph', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
    { id: 'e10', source: 'nerCitationExtraction', target: 'knowledgeGraph', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
    { id: 'e11', source: 'nerCitationExtraction', target: 'bridgeTable', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
    
    // Query Processing Flow
    { id: 'e12', source: 'userQuery', target: 'queryPlanner', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
    { id: 'e13', source: 'queryPlanner', target: 'languageDetection', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
    { id: 'e14', source: 'queryPlanner', target: 'intentDetection', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
    { id: 'e15', source: 'languageDetection', target: 'retrievalModeSelection', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
    { id: 'e16', source: 'intentDetection', target: 'retrievalModeSelection', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
    
    // Retrieval Mode Selection
    { id: 'e17', source: 'retrievalModeSelection', target: 'normalMode', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
    { id: 'e18', source: 'retrievalModeSelection', target: 'deepMode', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
    { id: 'e19', source: 'retrievalModeSelection', target: 'temporalMode', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
    
    // Normal Mode Flow
    { id: 'e20', source: 'normalMode', target: 'keywordSearchBM25', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
    { id: 'e21', source: 'normalMode', target: 'denseRetrieverE5', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
    { id: 'e22', source: 'normalMode', target: 'bridgeTableLookup', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
    { id: 'e23', source: 'keywordSearchBM25', target: 'evidenceMergeRerank', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
    { id: 'e24', source: 'denseRetrieverE5', target: 'evidenceMergeRerank', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
    { id: 'e25', source: 'bridgeTableLookup', target: 'evidenceMergeRerank', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
    
    // Deep Mode Flow
    { id: 'e26', source: 'deepMode', target: 'advancedRetrievalSPLADE', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
    { id: 'e27', source: 'deepMode', target: 'graphExpansion', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
    { id: 'e28', source: 'deepMode', target: 'evidencePoolAssembly', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
    { id: 'e29', source: 'advancedRetrievalSPLADE', target: 'selfRAGVerification', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
    { id: 'e30', source: 'graphExpansion', target: 'selfRAGVerification', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
    { id: 'e31', source: 'evidencePoolAssembly', target: 'selfRAGVerification', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
    
    // Temporal Mode Flow
    { id: 'e32', source: 'temporalMode', target: 'temporalGraphRAG', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
    { id: 'e33', source: 'temporalMode', target: 'multiJurisdictionAnalysis', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
    { id: 'e34', source: 'temporalGraphRAG', target: 'conflictRiskDetection', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
    { id: 'e35', source: 'multiJurisdictionAnalysis', target: 'conflictRiskDetection', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
    
    // Evidence Processing Flow
    { id: 'e36', source: 'evidenceMergeRerank', target: 'evidencePool', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
    { id: 'e37', source: 'selfRAGVerification', target: 'evidencePool', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
    { id: 'e38', source: 'conflictRiskDetection', target: 'evidencePool', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
    { id: 'e39', source: 'evidencePool', target: 'llmSelfRAGController', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
    { id: 'e40', source: 'llmSelfRAGController', target: 'reflectFilterSpans', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
    { id: 'e41', source: 'llmSelfRAGController', target: 'generateCanonicalAnswer', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
    { id: 'e42', source: 'llmSelfRAGController', target: 'sentenceLevelCitation', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
    
    // Output Flow
    { id: 'e43', source: 'reflectFilterSpans', target: 'outputLayer', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
    { id: 'e44', source: 'generateCanonicalAnswer', target: 'outputLayer', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
    { id: 'e45', source: 'sentenceLevelCitation', target: 'outputLayer', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
    { id: 'e46', source: 'outputLayer', target: 'englishAnswer', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
    { id: 'e47', source: 'outputLayer', target: 'translateHindiTelugu', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
    { id: 'e48', source: 'outputLayer', target: 'inlineCitations', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
    { id: 'e49', source: 'englishAnswer', target: 'outputFormats', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
    { id: 'e50', source: 'translateHindiTelugu', target: 'outputFormats', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
    { id: 'e51', source: 'inlineCitations', target: 'outputFormats', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
    
    // Storage Connections
    { id: 'e52', source: 'vectorIndex', target: 'vectorDB', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
    { id: 'e53', source: 'knowledgeGraph', target: 'knowledgeGraphDB', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
    { id: 'e54', source: 'bridgeTable', target: 'bridgeTableDB', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
    { id: 'e55', source: 'vectorDB', target: 'denseRetrieverE5', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
    { id: 'e56', source: 'knowledgeGraphDB', target: 'graphExpansion', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
    { id: 'e57', source: 'bridgeTableDB', target: 'bridgeTableLookup', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
    { id: 'e58', source: 'knowledgeGraphDB', target: 'temporalGraphRAG', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
    { id: 'e59', source: 'vectorDB', target: 'temporalGraphRAG', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
  ]

  // Data Ingestion View (1st)
  const dataIngestionNodes: Node[] = [
    {
      id: 'dataSources',
      type: 'dataFlow',
      position: { x: 100, y: 50 },
      data: {
        label: 'Data Sources',
        description: 'Court Judgments, Education Regulations, Government Orders, Policy Documents',
        icon: Globe,
      },
    },
    {
      id: 'dataCollection',
      type: 'dataFlow',
      position: { x: 100, y: 150 },
      data: {
        label: 'Data Collection',
        description: 'Automated crawling and collection',
        icon: Search,
      },
    },
    {
      id: 'textProcessing',
      type: 'processing',
      position: { x: 100, y: 250 },
      data: {
        label: 'Text Processing',
        description: 'OCR & Cleaning, Entity Recognition, Relationship Mapping',
        icon: FileText,
      },
    },
    {
      id: 'informationExtraction',
      type: 'processing',
      position: { x: 100, y: 350 },
      data: {
        label: 'Information Extraction',
        description: 'NER, Citation extraction, Legal entity recognition',
        icon: Brain,
      },
    },
    {
      id: 'embeddingChunking',
      type: 'processing',
      position: { x: 100, y: 450 },
      data: {
        label: 'Embedding & Chunking',
        description: 'Vector embeddings, Legal-aware chunking',
        icon: Layers,
      },
    },
    {
      id: 'knowledgeGraph',
      type: 'storage',
      position: { x: 400, y: 300 },
      data: {
        label: 'Knowledge Graph',
        description: 'Graph DB with relationships',
        icon: Network,
      },
    },
    {
      id: 'vectorStorage',
      type: 'storage',
      position: { x: 400, y: 400 },
      data: {
        label: 'Vector Storage',
        description: 'Vector DB with metadata',
        icon: Database,
      },
    },
    {
      id: 'bridgeConnections',
      type: 'storage',
      position: { x: 400, y: 500 },
      data: {
        label: 'Bridge Connections',
        description: 'Bridge Tables for quick lookups',
        icon: Layers,
      },
    },
    {
      id: 'readyForQuery',
      type: 'output',
      position: { x: 700, y: 400 },
      data: {
        label: 'Ready for Query',
        description: 'All systems prepared for user queries',
        icon: CheckCircle,
      },
    },
  ]

  // Query Processing View (2nd)
  const queryProcessingNodes: Node[] = [
    {
      id: 'userQuery',
      type: 'dataFlow',
      position: { x: 100, y: 100 },
      data: {
        label: 'User Query',
        description: 'Natural language question',
        icon: Search,
      },
    },
    {
      id: 'preprocessQuery',
      type: 'processing',
      position: { x: 100, y: 200 },
      data: {
        label: 'Preprocess Query',
        description: 'Language detection, normalization',
        icon: Brain,
      },
    },
    {
      id: 'keywordSearch',
      type: 'processing',
      position: { x: 100, y: 300 },
      data: {
        label: 'Keyword Search',
        description: 'BM25, traditional search',
        icon: Search,
      },
    },
    {
      id: 'semanticSearch',
      type: 'processing',
      position: { x: 100, y: 400 },
      data: {
        label: 'Semantic Search',
        description: 'Vector similarity search',
        icon: Brain,
      },
    },
    {
      id: 'findRelatedDocs',
      type: 'processing',
      position: { x: 100, y: 500 },
      data: {
        label: 'Find Related Documents',
        description: 'Cross-reference and linking',
        icon: FileText,
      },
    },
    {
      id: 'mergeRerank',
      type: 'processing',
      position: { x: 400, y: 300 },
      data: {
        label: 'Merge and Rerank',
        description: 'Combine results, relevance scoring',
        icon: TrendingUp,
      },
    },
    {
      id: 'verifyCitations',
      type: 'processing',
      position: { x: 400, y: 400 },
      data: {
        label: 'Verify and Add Citations',
        description: 'Citation binding, source verification',
        icon: CheckCircle,
      },
    },
    {
      id: 'finalAnswer',
      type: 'output',
      position: { x: 400, y: 500 },
      data: {
        label: 'Final Answer',
        description: 'Formatted response with citations',
        icon: FileText,
      },
    },
    {
      id: 'vectorDB',
      type: 'storage',
      position: { x: 700, y: 200 },
      data: {
        label: 'Vector Database',
        description: 'Semantic search storage',
        icon: Database,
      },
    },
    {
      id: 'bridgeTable',
      type: 'storage',
      position: { x: 700, y: 300 },
      data: {
        label: 'Bridge Table',
        description: 'Quick reference storage',
        icon: Layers,
      },
    },
  ]

  // Advanced Analysis View (3rd)
  const advancedAnalysisNodes: Node[] = [
    {
      id: 'userQueryAdvanced',
      type: 'dataFlow',
      position: { x: 100, y: 100 },
      data: {
        label: 'User Query',
        description: 'Complex analytical question',
        icon: Search,
      },
    },
    {
      id: 'analyzeQuery',
      type: 'processing',
      position: { x: 100, y: 200 },
      data: {
        label: 'Analyze Query',
        description: 'Intent, Entities, Time Frame analysis',
        icon: Brain,
      },
    },
    {
      id: 'advancedRetrieval',
      type: 'processing',
      position: { x: 100, y: 300 },
      data: {
        label: 'Advanced Retrieval',
        description: 'SPLADE, ColBERT, multi-modal',
        icon: Search,
      },
    },
    {
      id: 'graphExpansion',
      type: 'processing',
      position: { x: 100, y: 400 },
      data: {
        label: 'Graph Expansion',
        description: 'Multi-hop traversal, relationship discovery',
        icon: Network,
      },
    },
    {
      id: 'evidencePool',
      type: 'processing',
      position: { x: 100, y: 500 },
      data: {
        label: 'Evidence Pool Assembly',
        description: 'Gather and organize evidence',
        icon: Layers,
      },
    },
    {
      id: 'verifyReflect',
      type: 'processing',
      position: { x: 400, y: 300 },
      data: {
        label: 'Verify and Reflect',
        description: 'Self-RAG verification, consistency check',
        icon: CheckCircle,
      },
    },
    {
      id: 'composeReport',
      type: 'processing',
      position: { x: 400, y: 400 },
      data: {
        label: 'Compose Final Report',
        description: 'Structured report generation',
        icon: FileText,
      },
    },
    {
      id: 'detailedAnswer',
      type: 'output',
      position: { x: 400, y: 500 },
      data: {
        label: 'Detailed Answer',
        description: 'Timeline, citations, comprehensive response',
        icon: FileText,
      },
    },
    {
      id: 'vectorDBAdvanced',
      type: 'storage',
      position: { x: 700, y: 200 },
      data: {
        label: 'Vector Database',
        description: 'Advanced semantic storage',
        icon: Database,
      },
    },
    {
      id: 'knowledgeGraphAdvanced',
      type: 'storage',
      position: { x: 700, y: 300 },
      data: {
        label: 'Knowledge Graph DB',
        description: 'Complex relationship storage',
        icon: Network,
      },
    },
    {
      id: 'bridgeTableAdvanced',
      type: 'storage',
      position: { x: 700, y: 400 },
      data: {
        label: 'Bridge Table DB',
        description: 'Multi-hop connection storage',
        icon: Layers,
      },
    },
  ]

  const getCurrentNodes = () => {
    switch (selectedView) {
      case 'data-ingestion': return dataIngestionNodes
      case 'query-processing': return queryProcessingNodes
      case 'advanced-analysis': return advancedAnalysisNodes
      default: return allInOneNodes
    }
  }

  const getCurrentEdges = () => {
    switch (selectedView) {
      case 'data-ingestion': return []
      case 'query-processing': return []
      case 'advanced-analysis': return []
      default: return allInOneEdges
    }
  }

  const initialNodes: Node[] = getCurrentNodes()

  useEffect(() => {
    setNodes(getCurrentNodes())
    setEdges(getCurrentEdges())
  }, [selectedView])

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id)
    setShowDetails(true)
  }

  const playAnimation = () => {
    setIsPlaying(true)
    // Simulate data flow animation
    const steps = [
      'crawler', 'preprocessing', 'vectorIndex', 'knowledgeGraph', 'bridgeTable',
      'queryPlanner', 'modeSelection', 'normalMode', 'deepMode', 'temporalMode',
      'llmProcessing', 'outputLayer'
    ]
    
    let stepIndex = 0
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setCurrentStep(stepIndex)
        setSelectedNode(steps[stepIndex])
        stepIndex++
      } else {
        clearInterval(interval)
        setIsPlaying(false)
        setSelectedNode(null)
        setCurrentStep(0)
      }
    }, 1000)
  }

  const resetAnimation = () => {
    setIsPlaying(false)
    setSelectedNode(null)
    setCurrentStep(0)
  }

  const selectedComponent = selectedNode ? componentDetails[selectedNode as keyof typeof componentDetails] : null

  return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2 items-center">
        <Select value={selectedView} onValueChange={setSelectedView}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Architecture View" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-in-one">
              <div className="flex items-center gap-2">
                <Workflow className="h-4 w-4" />
                All in One
              </div>
            </SelectItem>
            <SelectItem value="data-ingestion">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Data Ingestion
              </div>
            </SelectItem>
            <SelectItem value="query-processing">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Query Processing
              </div>
            </SelectItem>
            <SelectItem value="advanced-analysis">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Advanced Analysis
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        
        <Button
          onClick={playAnimation}
          disabled={isPlaying}
          className="gap-2"
        >
          <Play className="h-4 w-4" />
          Play Animation
        </Button>
        <Button
          onClick={resetAnimation}
          variant="outline"
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
        <Badge variant="secondary" className="gap-1">
          <Sparkles className="h-3 w-3" />
          Interactive Architecture
        </Badge>
      </div>

      {/* Progress Indicator */}
      {isPlaying && (
        <div className="absolute top-16 right-4 z-10 w-64">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium">Animation Progress</span>
            <span className="text-xs text-muted-foreground">
              {currentStep + 1} / 12
            </span>
          </div>
          <Progress value={(currentStep + 1) / 12 * 100} className="h-2" />
        </div>
      )}

      {/* Main Flow Diagram */}
      <div className="h-full w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-transparent"
          defaultViewport={{ x: -100, y: -50, zoom: 0.4 }}
          minZoom={0.1}
          maxZoom={2}
          nodesDraggable={true}
          nodesConnectable={false}
          elementsSelectable={true}
          fitViewOptions={{ 
            padding: 0.1,
            includeHiddenNodes: false,
            minZoom: 0.2,
            maxZoom: 0.6
          }}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
          <Controls position="bottom-left" />
          <MiniMap 
            position="bottom-right" 
            nodeColor={(node) => {
              switch (node.type) {
                case 'dataFlow': return '#3b82f6'
                case 'processing': return '#8b5cf6'
                case 'storage': return '#10b981'
                case 'output': return '#f59e0b'
                case 'decision': return '#eab308'
                default: return '#6b7280'
              }
            }}
            nodeStrokeWidth={3}
            zoomable
            pannable
          />
        </ReactFlow>
      </div>

      {/* Component Details Panel */}
      <AnimatePresence>
        {showDetails && selectedComponent && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute top-0 right-0 h-full w-96 bg-white shadow-xl border-l z-20 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{selectedComponent.title}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(false)}
                >
                  ×
                </Button>
              </div>
              
              <p className="text-muted-foreground mb-4">
                {selectedComponent.description}
              </p>

              {/* Animation Preview */}
              <div className="flex items-center justify-center p-4 bg-muted rounded-lg mb-4">
                {getAnimationComponent(selectedComponent.animation)}
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="features">
                  <AccordionTrigger>Key Features</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {selectedComponent.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="technology">
                  <AccordionTrigger>Technology Stack</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedComponent.technology.split(', ').map((tech, index) => (
                        <Badge key={index} variant="outline">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="w-64">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Component Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-xs">Data Flow</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span className="text-xs">Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-xs">Storage</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span className="text-xs">Output</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded transform rotate-45"></div>
              <span className="text-xs">Decision</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function InteractiveArchitecture() {
  return (
    <ReactFlowProvider>
      <InteractiveArchitectureFlow />
    </ReactFlowProvider>
  )
}
