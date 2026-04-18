import re
import string
from typing import List, Dict, Tuple
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import spacy
from PyPDF2 import PdfReader
import io

class ResumesScreener:
    def __init__(self):
        """Initialize the Resume Screener with spaCy model"""
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            print("Downloading spacy model...")
            import subprocess
            subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
            self.nlp = spacy.load("en_core_web_sm")

        self.vectorizer = TfidfVectorizer(
            max_features=500,
            stop_words='english',
            lowercase=True,
            ngram_range=(1, 2)
        )

    def extract_text_from_pdf(self, pdf_bytes: bytes) -> str:
        """Extract text from PDF file"""
        try:
            pdf_reader = PdfReader(io.BytesIO(pdf_bytes))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            return text
        except Exception as e:
            raise Exception(f"Error extracting PDF: {str(e)}")

    def preprocess_text(self, text: str) -> str:
        """Clean and preprocess text"""
        # Remove URLs
        text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
        # Remove special characters but keep spaces and basic punctuation
        text = re.sub(r'[^\w\s]', ' ', text)
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        return text.lower().strip()

    def extract_entities(self, text: str) -> Dict:
        """Extract named entities from text using spaCy"""
        doc = self.nlp(text[:1000000])  # Limit to 1M chars for performance

        entities = {
            'PERSON': [],
            'ORG': [],
            'GPE': [],
            'SKILL': [],  # Custom - look for common tech skills
            'EDUCATION': []
        }

        for ent in doc.ents:
            if ent.label_ == 'PERSON':
                entities['PERSON'].append(ent.text)
            elif ent.label_ in ['ORG', 'PRODUCT']:
                entities['ORG'].append(ent.text)
            elif ent.label_ == 'GPE':
                entities['GPE'].append(ent.text)

        # Extract skills (common technical keywords) - expanded list
        skills_keywords = [
            'python', 'java', 'javascript', 'typescript', 'react', 'angular', 'vue',
            'node.js', 'nodejs', 'node', 'django', 'flask', 'fastapi', 'spring', 'springboot',
            'aws', 'azure', 'gcp', 'cloud', 'docker', 'kubernetes', 'k8s',
            'sql', 'nosql', 'mongodb', 'postgresql', 'postgres', 'mysql', 'redis',
            'git', 'github', 'gitlab', 'bitbucket', 'linux', 'unix', 'windows',
            'machine learning', 'ml', 'deep learning', 'ai', 'nlp', 'computer vision',
            'data science', 'data analysis', 'big data', 'spark', 'hadoop', 'kafka',
            'ci/cd', 'devops', 'jenkins', 'terraform', 'ansible',
            'html', 'html5', 'css', 'css3', 'sass', 'scss', 'tailwind', 'bootstrap',
            'rest api', 'restful', 'api', 'graphql', 'microservices', 'agile', 'scrum',
            'c++', 'c#', 'go', 'golang', 'rust', 'php', 'ruby', 'scala', 'kotlin', 'swift',
            'express', 'expressjs', 'laravel', 'rails', 'asp.net', '.net',
            'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy',
            'elasticsearch', 'dynamodb', 'firebase', 'supabase',
            'webpack', 'vite', 'babel', 'npm', 'yarn', 'pnpm',
            'testing', 'jest', 'pytest', 'junit', 'selenium', 'cypress',
            'communication', 'leadership', 'teamwork', 'problem solving', 'analytical'
        ]

        text_lower = text.lower()
        for skill in skills_keywords:
            if skill in text_lower:
                entities['SKILL'].append(skill)

        # Extract education keywords
        education_keywords = ['bachelor', 'master', 'phd', 'diploma', 'certification', 'degree']
        for edu in education_keywords:
            if edu in text_lower:
                entities['EDUCATION'].append(edu)

        return entities

    def extract_resume_features(self, resume_text: str) -> Dict:
        """Extract key features from resume"""
        text = self.preprocess_text(resume_text)

        features = {
            'text': text,
            'entities': self.extract_entities(resume_text),
            'length': len(resume_text),
            'word_count': len(text.split()),
        }

        return features

    def extract_experience_years(self, text: str) -> int:
        """Extract years of experience from text"""
        import re
        # Look for patterns like "5 years", "5+ years", "5-10 years"
        patterns = [
            r'(\d+)\s*\+?\s*years',
            r'(\d+)\s*-\s*(\d+)\s*years'
        ]

        years_found = []
        text_lower = text.lower()
        for pattern in patterns:
            matches = re.findall(pattern, text_lower)
            for match in matches:
                if isinstance(match, tuple):
                    years_found.append(int(match[0]))
                else:
                    years_found.append(int(match))

        return max(years_found) if years_found else 0

    def extract_job_level(self, text: str) -> str:
        """Extract job level (Junior, Mid, Senior)"""
        text_lower = text.lower()
        if 'senior' in text_lower or 'lead' in text_lower or 'principal' in text_lower:
            return 'senior'
        elif 'mid' in text_lower or 'intermediate' in text_lower:
            return 'mid'
        elif 'junior' in text_lower or 'entry' in text_lower or 'graduate' in text_lower:
            return 'junior'
        else:
            return 'mid'  # Default

    def extract_education_level(self, text: str) -> str:
        """Extract education level"""
        text_lower = text.lower()
        if 'phd' in text_lower or 'doctorate' in text_lower:
            return 'phd'
        elif 'master' in text_lower or 'mba' in text_lower or 'ms ' in text_lower:
            return 'master'
        elif 'bachelor' in text_lower or 'bs ' in text_lower or 'ba ' in text_lower:
            return 'bachelor'
        elif 'diploma' in text_lower or 'certification' in text_lower:
            return 'diploma'
        else:
            return 'none'

    def categorize_skills(self, text: str) -> Dict:
        """Categorize skills into different types"""
        text_lower = text.lower()

        categories = {
            'programming': ['python', 'java', 'javascript', 'typescript', 'go', 'rust', 'cpp', 'c++', 'c#', 'php', 'ruby', 'scala'],
            'frontend': ['react', 'angular', 'vue', 'html', 'css', 'tailwind', 'bootstrap', 'webpack'],
            'backend': ['django', 'flask', 'fastapi', 'node.js', 'node', 'spring', 'express', 'laravel'],
            'databases': ['sql', 'mongodb', 'postgresql', 'mysql', 'redis', 'dynamodb', 'elasticsearch'],
            'devops': ['docker', 'kubernetes', 'aws', 'azure', 'gcp', 'terraform', 'jenkins', 'ci/cd', 'gitlab'],
            'ml': ['machine learning', 'deep learning', 'nlp', 'tensorflow', 'pytorch', 'scikit-learn', 'keras'],
        }

        found = {}
        for category, skills in categories.items():
            found[category] = [s for s in skills if s in text_lower]

        return found

    def extract_job_skills(self, job_description: str) -> Dict:
        """Extract required skills and categorize as critical/nice-to-have"""
        text_lower = job_description.lower()

        # All possible skills - expanded list
        all_skills = {
            'python', 'java', 'javascript', 'typescript', 'react', 'angular', 'vue',
            'node.js', 'nodejs', 'node', 'django', 'flask', 'fastapi', 'spring', 'springboot',
            'aws', 'azure', 'gcp', 'cloud', 'docker', 'kubernetes', 'k8s',
            'sql', 'nosql', 'mongodb', 'postgresql', 'postgres', 'mysql', 'redis',
            'git', 'github', 'gitlab', 'bitbucket', 'linux', 'unix', 'windows',
            'machine learning', 'ml', 'deep learning', 'ai', 'nlp', 'computer vision',
            'data science', 'data analysis', 'big data', 'spark', 'hadoop', 'kafka',
            'ci/cd', 'devops', 'jenkins', 'terraform', 'ansible',
            'html', 'html5', 'css', 'css3', 'sass', 'scss', 'tailwind', 'bootstrap',
            'rest api', 'restful', 'api', 'graphql', 'microservices', 'agile', 'scrum',
            'c++', 'c#', 'go', 'golang', 'rust', 'php', 'ruby', 'scala', 'kotlin', 'swift',
            'express', 'expressjs', 'laravel', 'rails', 'asp.net', '.net',
            'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy',
            'elasticsearch', 'dynamodb', 'firebase', 'supabase',
            'webpack', 'vite', 'babel', 'npm', 'yarn', 'pnpm',
            'testing', 'jest', 'pytest', 'junit', 'selenium', 'cypress',
            'communication', 'leadership', 'teamwork', 'problem solving', 'analytical'
        }

        # Find all mentioned skills
        mentioned_skills = {skill for skill in all_skills if skill in text_lower}

        # Determine critical skills (mentioned early or with "required")
        critical_keywords = ['required', 'must', 'essential', 'critical', 'mandatory', 'need']
        critical_skills = set()

        for skill in mentioned_skills:
            # Check if skill is mentioned with "required" or "must"
            for keyword in critical_keywords:
                if f'{keyword}' in text_lower and skill in text_lower:
                    critical_skills.add(skill)
                    break

        # If no skills marked as critical, top 40% are critical (more balanced)
        if not critical_skills and mentioned_skills:
            num_critical = max(3, int(len(mentioned_skills) * 0.4))
            critical_skills = set(list(mentioned_skills)[:num_critical])

        return {
            'all': mentioned_skills,
            'critical': critical_skills,
            'nice_to_have': mentioned_skills - critical_skills
        }

    def score_resume(self, resume_features: Dict, job_description: str) -> float:
        """Advanced realistic scoring algorithm with balanced scoring"""
        resume_text = resume_features['text']
        job_text = self.preprocess_text(job_description)

        try:
            # ========== EXPERIENCE LEVEL (20%) ==========
            resume_years = self.extract_experience_years(resume_text)
            job_years = self.extract_experience_years(job_description)

            if job_years > 0:
                # Balanced scoring for experience
                if resume_years >= job_years:
                    years_score = 1.0
                elif resume_years >= job_years * 0.7:
                    years_score = 0.85
                elif resume_years >= job_years * 0.5:
                    years_score = 0.75
                elif resume_years > 0:
                    years_score = 0.65
                else:
                    years_score = 0.55
            else:
                years_score = 0.75  # Default if no years extracted

            resume_level = self.extract_job_level(resume_text)
            job_level = self.extract_job_level(job_description)
            level_hierarchy = {'junior': 1, 'mid': 2, 'senior': 3}

            level_score = 1.0 if level_hierarchy.get(resume_level, 0) >= level_hierarchy.get(job_level, 0) else 0.75

            experience_score = (years_score * 0.5 + level_score * 0.5)

            # ========== SKILL MATCHING (30%) ==========
            resume_skills = resume_features['entities']['SKILL']
            job_skills_dict = self.extract_job_skills(job_description)

            resume_skills_set = set(resume_skills)

            # Critical skills matching
            critical_found = len(resume_skills_set & job_skills_dict['critical'])
            critical_total = len(job_skills_dict['critical'])

            if critical_total > 0:
                critical_ratio = critical_found / critical_total
                # Balanced critical skill scoring
                if critical_ratio >= 0.9:
                    critical_score = 1.0
                elif critical_ratio >= 0.7:
                    critical_score = 0.9
                elif critical_ratio >= 0.5:
                    critical_score = 0.8
                elif critical_ratio >= 0.3:
                    critical_score = 0.7
                else:
                    critical_score = 0.6
            else:
                critical_score = 0.75

            # Nice-to-have skills matching
            if job_skills_dict['nice_to_have']:
                nice_found = len(resume_skills_set & job_skills_dict['nice_to_have'])
                nice_total = len(job_skills_dict['nice_to_have'])
                nice_ratio = nice_found / nice_total
                
                if nice_ratio >= 0.6:
                    nice_score = 1.0
                elif nice_ratio >= 0.4:
                    nice_score = 0.85
                elif nice_ratio >= 0.2:
                    nice_score = 0.75
                else:
                    nice_score = 0.65
            else:
                nice_score = 0.75

            # Total skill score
            skill_score = (critical_score * 0.7 + nice_score * 0.3)

            # Small bonus for having many skills
            if len(resume_skills) >= 15:
                skill_score = min(skill_score * 1.05, 1.0)

            # ========== SEMANTIC RELEVANCE (30%) ==========
            combined_texts = [resume_text, job_text]
            tfidf_matrix = self.vectorizer.fit_transform(combined_texts)
            raw_semantic_score = cosine_similarity(
                tfidf_matrix[0:1], tfidf_matrix[1:2]
            )[0][0]
            
            # Moderate boost to semantic score (0.1-0.3 becomes 0.55-0.85)
            semantic_score = min(raw_semantic_score * 3.0 + 0.25, 1.0)
            semantic_score = max(semantic_score, 0.50)  # Moderate minimum baseline

            # ========== EDUCATION BONUS (12%) ==========
            resume_edu = self.extract_education_level(resume_text)
            job_edu = self.extract_education_level(job_description)

            edu_hierarchy = {'none': 0, 'diploma': 1, 'bachelor': 2, 'master': 3, 'phd': 4}
            resume_edu_score = edu_hierarchy.get(resume_edu, 0)
            job_edu_score = edu_hierarchy.get(job_edu, 0)

            if job_edu_score > 0:
                if resume_edu_score >= job_edu_score:
                    education_score = 1.0
                elif resume_edu_score >= job_edu_score - 1:
                    education_score = 0.85
                else:
                    education_score = 0.7
            else:
                education_score = 0.8

            # ========== RESUME QUALITY (8%) ==========
            word_count = resume_features['word_count']
            if word_count >= 300:
                quality_score = 1.0
            elif word_count >= 200:
                quality_score = 0.9
            elif word_count >= 150:
                quality_score = 0.8
            else:
                quality_score = 0.7

            # ========== FINAL WEIGHTED SCORE ==========
            final_score = (
                experience_score * 0.20 +
                skill_score * 0.30 +
                semantic_score * 0.30 +
                education_score * 0.12 +
                quality_score * 0.08
            )

            # Ensure minimum score of 0.45 for any valid resume
            final_score = max(final_score, 0.45)

            return min(max(final_score, 0.0), 1.0)

        except Exception as e:
            print(f"Error in scoring: {e}")
            return 0.50

    def rank_resumes(self, resumes: List[Dict], job_description: str) -> List[Dict]:
        """Rank multiple resumes against job description"""

        scored_resumes = []

        for i, resume_data in enumerate(resumes):
            # Extract resume text (can be raw text or PDF)
            if isinstance(resume_data.get('content'), bytes):
                resume_text = self.extract_text_from_pdf(resume_data['content'])
            else:
                resume_text = str(resume_data.get('content', ''))

            # Extract features
            features = self.extract_resume_features(resume_text)

            # Score resume
            score = self.score_resume(features, job_description)

            scored_resumes.append({
                'id': i,
                'name': resume_data.get('name', f'Resume {i+1}'),
                'score': float(score),
                'match_percentage': round(score * 100, 2),
                'entities': features['entities'],
                'word_count': features['word_count']
            })

        # Sort by score descending
        scored_resumes.sort(key=lambda x: x['score'], reverse=True)

        # Add ranking
        for idx, resume in enumerate(scored_resumes, 1):
            resume['rank'] = idx

        return scored_resumes


# Initialize the screener
screener = ResumesScreener()
