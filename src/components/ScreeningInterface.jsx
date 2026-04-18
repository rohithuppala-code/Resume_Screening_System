import { useState, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ScreeningInterface({ setResults, setError, setLoading, loading, error }) {
	const [jobDescription, setJobDescription] = useState('');
	const [resumeFiles, setResumeFiles] = useState([]);
	const fileInputRef = useRef(null);

	const handleJobDescriptionChange = (e) => {
		setJobDescription(e.target.value);
	};

	const handleFileSelect = (e) => {
		const files = Array.from(e.target.files);
		const validFiles = files.filter(file =>
			file.name.endsWith('.pdf') || file.name.endsWith('.txt')
		);

		if (validFiles.length !== files.length) {
			setError('Only PDF and TXT files are allowed');
			setTimeout(() => setError(null), 5000);
		}

		setResumeFiles(prev => [...prev, ...validFiles]);
	};

	const handleRemoveFile = (index) => {
		setResumeFiles(prev => prev.filter((_, i) => i !== index));
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		e.currentTarget.classList.add('bg-purple-500/20', 'border-purple-400');
	};

	const handleDragLeave = (e) => {
		e.currentTarget.classList.remove('bg-purple-500/20', 'border-purple-400');
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.currentTarget.classList.remove('bg-purple-500/20', 'border-purple-400');
		const files = Array.from(e.dataTransfer.files);
		const validFiles = files.filter(file =>
			file.name.endsWith('.pdf') || file.name.endsWith('.txt')
		);
		setResumeFiles(prev => [...prev, ...validFiles]);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!jobDescription.trim()) {
			setError('Please enter a job description');
			return;
		}

		if (resumeFiles.length === 0) {
			setError('Please select at least one resume file');
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const formData = new FormData();
			formData.append('jobDescription', jobDescription);

			resumeFiles.forEach(file => {
				formData.append('resumes', file);
			});

			const response = await fetch(`${API_URL}/api/screen`, {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to screen resumes');
			}

			const data = await response.json();
			setResults(data.results, jobDescription);
		} catch (err) {
			setError(err.message || 'Error processing resumes. Make sure the backend is running on port 5000');
			console.error('Error:', err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-6xl mx-auto">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
				{/* Job Description Section */}
				<div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
					<div className="flex items-center gap-3 mb-6">
						<div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
							<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
						</div>
						<h2 className="text-2xl font-bold text-white">
							Job Description
						</h2>
					</div>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label htmlFor="jobDesc" className="block text-sm font-semibold text-gray-200 mb-3">
								Enter Job Requirements
							</label>
							<textarea
								id="jobDesc"
								value={jobDescription}
								onChange={handleJobDescriptionChange}
								className="w-full h-48 px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-100 placeholder-gray-500 transition-all"
								placeholder="Paste the job description here..."
							/>
							<p className="mt-2 text-xs text-gray-400">
								Characters: {jobDescription.length}
							</p>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] disabled:hover:scale-100"
						>
							{loading ? (
								<span className="flex items-center justify-center gap-3">
									<svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Screening Resumes...
								</span>
							) : (
								<span className="flex items-center justify-center gap-2">
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
									</svg>
									Screen Resumes
								</span>
							)}
						</button>
					</form>
				</div>

				{/* Resume Upload Section */}
				<div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
					<div className="flex items-center gap-3 mb-6">
						<div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
							<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
							</svg>
						</div>
						<h2 className="text-2xl font-bold text-white">
							Upload Resumes
						</h2>
					</div>

					{/* Drop Zone */}
					<div
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
						className="border-2 border-dashed border-purple-500/40 rounded-xl p-8 text-center cursor-pointer transition-all mb-6 hover:border-purple-400/60 hover:bg-purple-500/5"
						onClick={() => fileInputRef.current?.click()}
					>
						<div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
						</div>
						<p className="text-gray-200 font-semibold mb-2">
							Drag and drop resumes here
						</p>
						<p className="text-gray-400 text-sm mb-2">or click to browse files</p>
						<p className="text-xs text-gray-500">
							Supports PDF and TXT files (max 16MB each)
						</p>
						<input
							ref={fileInputRef}
							type="file"
							multiple
							onChange={handleFileSelect}
							accept=".pdf,.txt"
							className="hidden"
						/>
					</div>

					{/* File List */}
					{resumeFiles.length > 0 && (
						<div className="space-y-3">
							<h3 className="font-semibold text-gray-300">
								Selected Files ({resumeFiles.length})
							</h3>
							<div className="space-y-2 max-h-48 overflow-y-auto">
								{resumeFiles.map((file, index) => (
									<div
										key={index}
										className="flex items-center justify-between bg-purple-500/10 p-3 rounded-lg border border-purple-500/30"
									>
										<div className="flex items-center gap-2 flex-1 min-w-0">
											<svg className="w-4 h-4 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
											</svg>
											<span className="text-sm text-gray-300 truncate">
												{file.name}
											</span>
										</div>
										<button
											type="button"
											onClick={() => handleRemoveFile(index)}
											className="text-red-400 hover:text-red-300 transition-colors ml-2 flex-shrink-0"
										>
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
											</svg>
										</button>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Error Message */}
			{error && (
				<div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-xl p-4 backdrop-blur-sm flex items-start gap-3">
					<svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<div>
						<p className="text-red-400 font-semibold">Error</p>
						<p className="text-red-300 text-sm mt-1">{error}</p>
					</div>
				</div>
			)}

			{/* Info Section */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/40 hover:bg-purple-500/15 transition-all">
					<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-3">
						<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
						</svg>
					</div>
					<h3 className="font-bold text-gray-200">Advanced NLP</h3>
					<p className="text-xs text-gray-400 mt-1">spaCy Entity Recognition</p>
				</div>
				<div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/40 hover:bg-purple-500/15 transition-all">
					<div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-3">
						<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
						</svg>
					</div>
					<h3 className="font-bold text-gray-200">Smart Matching</h3>
					<p className="text-xs text-gray-400 mt-1">TF-IDF + Semantic Analysis</p>
				</div>
				<div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/40 hover:bg-purple-500/15 transition-all">
					<div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-3">
						<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
						</svg>
					</div>
					<h3 className="font-bold text-gray-200">Instant Results</h3>
					<p className="text-xs text-gray-400 mt-1">Real-time Processing</p>
				</div>
			</div>
		</div>
	);
}
