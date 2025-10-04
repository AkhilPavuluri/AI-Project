#!/usr/bin/env python3
"""
Sample Data Ingestion Script for GITAM Education Policy AI

This script populates ChromaDB with sample education policy documents
to demonstrate the system functionality.
"""

import asyncio
import logging
from backend_app.services.chromadb_service import ChromaDBService
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Sample education policy documents
SAMPLE_DOCUMENTS = [
    {
        "content": """
        GITAM Admission Policy 2024
        
        GITAM (Gandhi Institute of Technology and Management) follows a comprehensive admission policy 
        for undergraduate and postgraduate programs. The admission process is based on merit and 
        entrance examination scores.
        
        Eligibility Criteria:
        - For B.Tech programs: 60% aggregate in 10+2 with Physics, Chemistry, and Mathematics
        - For M.Tech programs: B.Tech degree with 60% aggregate
        - For MBA programs: Bachelor's degree with 50% aggregate
        
        Selection Process:
        1. Online application submission
        2. Entrance examination (GITAM GAT or national level exams)
        3. Personal interview
        4. Final merit list preparation
        
        Reservation Policy:
        - SC/ST: 15% and 7.5% respectively
        - OBC: 27%
        - EWS: 10%
        - Physically challenged: 3%
        
        Fee Structure:
        - B.Tech: ₹2,50,000 per annum
        - M.Tech: ₹1,50,000 per annum
        - MBA: ₹2,00,000 per annum
        
        Important Dates:
        - Application deadline: March 31, 2024
        - Entrance exam: April 15, 2024
        - Results declaration: May 15, 2024
        """,
        "metadata": {
            "title": "GITAM Admission Policy 2024",
            "source": "GITAM Official Website",
            "type": "admission_policy",
            "category": "undergraduate",
            "year": "2024",
            "last_updated": "2024-01-15"
        }
    },
    {
        "content": """
        Academic Regulations and Grading System
        
        GITAM follows a comprehensive academic regulation system to maintain high standards 
        of education and ensure fair evaluation of students.
        
        Grading System:
        - A+: 90-100 (Outstanding)
        - A: 80-89 (Excellent)
        - B+: 70-79 (Very Good)
        - B: 60-69 (Good)
        - C: 50-59 (Satisfactory)
        - F: Below 50 (Fail)
        
        Credit System:
        - Each course carries specific credits
        - Minimum credits required for graduation: 180 for B.Tech
        - Maximum credits per semester: 24
        
        Attendance Requirements:
        - Minimum 75% attendance mandatory
        - Students with less than 75% attendance will not be allowed to appear for exams
        - Medical certificates accepted for absence justification
        
        Examination Rules:
        - Continuous Internal Evaluation (CIE): 40% weightage
        - Semester End Examination (SEE): 60% weightage
        - Minimum passing grade: C (50%)
        
        Academic Probation:
        - Students with CGPA below 5.0 will be placed on academic probation
        - Maximum two consecutive semesters of probation allowed
        - Failure to improve may result in dismissal
        
        Revaluation Policy:
        - Students can apply for revaluation within 15 days of result declaration
        - Revaluation fee: ₹500 per paper
        - Maximum two papers per semester
        """,
        "metadata": {
            "title": "Academic Regulations and Grading System",
            "source": "GITAM Academic Handbook",
            "type": "academic_regulations",
            "category": "grading",
            "year": "2024",
            "last_updated": "2024-01-10"
        }
    },
    {
        "content": """
        Scholarship and Financial Aid Policy
        
        GITAM provides various scholarship opportunities to meritorious and financially 
        disadvantaged students to ensure access to quality education.
        
        Merit Scholarships:
        - GITAM Merit Scholarship: 50% tuition fee waiver for top 10% students
        - Academic Excellence Scholarship: 25% tuition fee waiver for CGPA above 8.5
        - Sports Scholarship: Up to 50% fee waiver for national/international athletes
        
        Need-Based Scholarships:
        - GITAM Financial Aid: Up to 100% tuition fee waiver based on family income
        - Single Parent Scholarship: 30% fee waiver for children of single parents
        - Orphan Scholarship: 50% fee waiver for orphaned students
        
        Government Scholarships:
        - Central Sector Scholarship Scheme (CSSS)
        - Post Matric Scholarship for SC/ST students
        - Merit-cum-Means Scholarship for OBC students
        - Prime Minister's Scholarship Scheme
        
        Application Process:
        1. Submit scholarship application form
        2. Provide income certificates and academic records
        3. Personal interview for need-based scholarships
        4. Scholarship committee review
        5. Award notification
        
        Renewal Criteria:
        - Maintain minimum CGPA of 7.0
        - Regular attendance above 80%
        - No disciplinary issues
        - Annual income verification
        
        Important Deadlines:
        - Application submission: July 31, 2024
        - Document verification: August 15, 2024
        - Award announcement: September 1, 2024
        """,
        "metadata": {
            "title": "Scholarship and Financial Aid Policy",
            "source": "GITAM Financial Aid Office",
            "type": "scholarship_policy",
            "category": "financial_aid",
            "year": "2024",
            "last_updated": "2024-01-20"
        }
    },
    {
        "content": """
        Hostel and Accommodation Policy
        
        GITAM provides comfortable and secure accommodation facilities for students 
        with comprehensive policies to ensure student welfare and safety.
        
        Hostel Facilities:
        - Separate hostels for boys and girls
        - Air-conditioned and non-AC rooms available
        - Common rooms with TV and recreational facilities
        - Laundry services and housekeeping
        - 24/7 security and CCTV surveillance
        
        Room Allocation:
        - First-year students: Compulsory hostel accommodation
        - Senior students: Based on availability and merit
        - International students: Priority allocation
        - Special needs students: Accessible rooms provided
        
        Hostel Rules and Regulations:
        - Curfew time: 10:00 PM for girls, 11:00 PM for boys
        - Visitors allowed only in common areas
        - No smoking or alcohol consumption
        - Regular room inspections
        - Noise restrictions during study hours
        
        Fee Structure:
        - AC Room: ₹1,20,000 per annum
        - Non-AC Room: ₹80,000 per annum
        - Mess charges: ₹60,000 per annum (compulsory)
        - Security deposit: ₹10,000 (refundable)
        
        Application Process:
        1. Submit hostel application form
        2. Pay hostel fees and security deposit
        3. Medical fitness certificate
        4. Room allocation based on merit
        5. Check-in procedures and orientation
        
        Disciplinary Actions:
        - Warning for minor violations
        - Fine for repeated offenses
        - Suspension for serious misconduct
        - Expulsion for severe violations
        
        Emergency Procedures:
        - 24/7 medical emergency support
        - Fire safety drills conducted monthly
        - Emergency contact numbers displayed
        - First aid facilities available
        """,
        "metadata": {
            "title": "Hostel and Accommodation Policy",
            "source": "GITAM Hostel Administration",
            "type": "hostel_policy",
            "category": "accommodation",
            "year": "2024",
            "last_updated": "2024-01-25"
        }
    },
    {
        "content": """
        Research and Development Policy
        
        GITAM encourages research and innovation through comprehensive R&D policies 
        that support faculty and student research activities.
        
        Research Areas:
        - Engineering and Technology
        - Management Studies
        - Pharmacy and Health Sciences
        - Architecture and Planning
        - Liberal Arts and Sciences
        
        Faculty Research Support:
        - Research grants up to ₹10 lakhs per project
        - Conference and publication support
        - Sabbatical leave for research
        - Collaboration with industry partners
        - Patent filing assistance
        
        Student Research Programs:
        - Undergraduate Research Program (URP)
        - Summer Research Internships
        - Final year project funding
        - Research paper publication support
        - National conference participation
        
        Research Infrastructure:
        - Advanced laboratories and equipment
        - High-performance computing facilities
        - Digital library access
        - Research collaboration platforms
        - Industry partnership programs
        
        Publication Incentives:
        - Scopus/SCI indexed journals: ₹50,000 per paper
        - International conferences: ₹25,000 per paper
        - National conferences: ₹10,000 per paper
        - Book publication: ₹1,00,000 per book
        
        Intellectual Property Rights:
        - Patent filing support and funding
        - Technology transfer assistance
        - Startup incubation support
        - Commercialization guidance
        - Legal support for IP protection
        
        Research Ethics:
        - Institutional Ethics Committee approval
        - Plagiarism detection and prevention
        - Data privacy and security
        - Responsible research practices
        - Conflict of interest disclosure
        
        Important Deadlines:
        - Research proposal submission: March 31, 2024
        - Grant application deadline: April 15, 2024
        - Progress report submission: September 30, 2024
        - Final report submission: December 31, 2024
        """,
        "metadata": {
            "title": "Research and Development Policy",
            "source": "GITAM Research and Development Office",
            "type": "research_policy",
            "category": "research",
            "year": "2024",
            "last_updated": "2024-01-30"
        }
    }
]

async def ingest_sample_documents():
    """Ingest sample documents into ChromaDB"""
    try:
        logger.info("Starting sample document ingestion...")
        
        # Initialize ChromaDB service
        chromadb_service = ChromaDBService()
        
        # Check ChromaDB health
        health = await chromadb_service.health_check()
        logger.info(f"ChromaDB health: {health}")
        
        # Add sample documents
        doc_ids = await chromadb_service.batch_add_documents(SAMPLE_DOCUMENTS)
        
        logger.info(f"Successfully ingested {len(doc_ids)} documents")
        logger.info(f"Document IDs: {doc_ids}")
        
        # Get collection stats
        stats = await chromadb_service.get_collection_stats()
        logger.info(f"Collection stats: {stats}")
        
        # Test search functionality
        test_query = "What are the admission requirements for B.Tech programs?"
        logger.info(f"Testing search with query: {test_query}")
        
        search_results = await chromadb_service.search_similar(test_query, top_k=3)
        logger.info(f"Search results: {len(search_results)} documents found")
        
        for i, result in enumerate(search_results):
            logger.info(f"Result {i+1}: {result['metadata']['title']} (Score: {result['score']:.3f})")
        
        logger.info("Sample document ingestion completed successfully!")
        
    except Exception as e:
        logger.error(f"Error during document ingestion: {e}")
        raise

if __name__ == "__main__":
    asyncio.run(ingest_sample_documents())
