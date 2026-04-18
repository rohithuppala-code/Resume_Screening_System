from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from datetime import datetime
from nlp_processor import screener

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

ALLOWED_EXTENSIONS = {'pdf', 'txt'}

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

@app.route('/api/screen', methods=['POST'])
def screen_resumes():
    """
    Screen resumes against a job description
    Expects:
    - job_description: string (form data)
    - resumes: list of files (form data)
    """
    try:
        # Get job description from form
        job_description = request.form.get('jobDescription', '')

        if not job_description or len(job_description.strip()) < 10:
            return jsonify({'error': 'Job description is required and must be at least 10 characters'}), 400

        # Check if files were provided
        if 'resumes' not in request.files or len(request.files.getlist('resumes')) == 0:
            return jsonify({'error': 'At least one resume file is required'}), 400

        files = request.files.getlist('resumes')
        resumes_data = []

        # Process each resume file
        for file in files:
            if file and file.filename:
                if not allowed_file(file.filename):
                    continue

                filename = secure_filename(file.filename)
                file_content = file.read()

                resumes_data.append({
                    'name': filename,
                    'content': file_content
                })

        if not resumes_data:
            return jsonify({'error': 'No valid resume files provided'}), 400

        # Rank resumes
        ranked_results = screener.rank_resumes(resumes_data, job_description)

        return jsonify({
            'success': True,
            'results': ranked_results,
            'job_description': job_description[:200] + '...' if len(job_description) > 200 else job_description,
            'total_resumes': len(ranked_results),
            'timestamp': datetime.now().isoformat()
        }), 200

    except Exception as e:
        print(f"Error screening resumes: {str(e)}")
        return jsonify({'error': f'Error processing resumes: {str(e)}'}), 500

@app.route('/api/analyze-resume', methods=['POST'])
def analyze_resume():
    """
    Analyze a single resume
    Expects:
    - resume: file or text
    """
    try:
        resume_text = ""

        # Check if file was uploaded
        if 'resume' in request.files:
            file = request.files['resume']
            if file and allowed_file(file.filename):
                file_content = file.read()
                if file.filename.endswith('.pdf'):
                    resume_text = screener.extract_text_from_pdf(file_content)
                else:
                    resume_text = file_content.decode('utf-8', errors='ignore')
        else:
            # Try to get text from form
            resume_text = request.form.get('text', '')

        if not resume_text:
            return jsonify({'error': 'Resume text or file is required'}), 400

        # Extract features
        features = screener.extract_resume_features(resume_text)

        return jsonify({
            'success': True,
            'entities': features['entities'],
            'word_count': features['word_count'],
            'length': features['length']
        }), 200

    except Exception as e:
        return jsonify({'error': f'Error analyzing resume: {str(e)}'}), 500

@app.route('/api/job-keywords', methods=['POST'])
def extract_job_keywords():
    """
    Extract keywords and requirements from job description
    """
    try:
        job_description = request.json.get('jobDescription', '')

        if not job_description:
            return jsonify({'error': 'Job description is required'}), 400

        # Extract entities and keywords
        entities = screener.extract_entities(job_description)

        # Extract common requirements
        requirements = []
        requirement_keywords = ['require', 'must', 'should', 'experience', 'skill', 'knowledge']

        for keyword in requirement_keywords:
            if keyword in job_description.lower():
                requirements.append(keyword)

        return jsonify({
            'success': True,
            'entities': entities,
            'requirements': requirements,
            'word_count': len(job_description.split())
        }), 200

    except Exception as e:
        return jsonify({'error': f'Error extracting keywords: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
