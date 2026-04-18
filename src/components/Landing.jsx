export default function Landing({ onStartClick }) {
	return (
		<div className="min-h-screen flex flex-col">
			{/* Navigation */}
			<nav className="bg-black/20 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-50">
				<div className="container mx-auto px-4 py-4 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg flex items-center justify-center">
							<span className="text-white font-bold text-lg">RS</span>
						</div>
						<h1 className="text-xl font-bold text-white">ResumeScreen</h1>
					</div>
					<button
						onClick={onStartClick}
						className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-200"
					>
						Get Started
					</button>
				</div>
			</nav>

			{/* Hero Section */}
			<div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
				{/* Animated Background Elements */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<div className="absolute top-20 left-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
					<div className="absolute top-40 right-10 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
					<div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
				</div>

				{/* Content */}
				<div className="relative z-10 text-center max-w-4xl">
					{/* Icon */}
					<div className="mb-8 flex justify-center">
						<div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/30">
							<svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
						</div>
					</div>

					{/* Main Heading */}
					<h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
						Smart Resume Screening
					</h1>

					{/* Subheading */}
					<p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
						AI-Powered NLP Technology to Instantly Rank and Match
						<br />
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold">
							Your Best Candidates
						</span>
					</p>

					{/* Features Grid */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
						<div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 hover:bg-white/10 transition-all">
							<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
								<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
								</svg>
							</div>
							<h3 className="text-lg font-semibold text-white mb-2">Advanced NLP</h3>
							<p className="text-gray-400 text-sm">
								Powered by spaCy for precise entity recognition and analysis
							</p>
						</div>

						<div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 hover:bg-white/10 transition-all">
							<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
								<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
								</svg>
							</div>
							<h3 className="text-lg font-semibold text-white mb-2">Instant Results</h3>
							<p className="text-gray-400 text-sm">
								Real-time processing with comprehensive analytics
							</p>
						</div>

						<div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 hover:bg-white/10 transition-all">
							<div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-4">
								<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
								</svg>
							</div>
							<h3 className="text-lg font-semibold text-white mb-2">Smart Ranking</h3>
							<p className="text-gray-400 text-sm">
								Intelligent scoring based on skills and experience
							</p>
						</div>
					</div>

					{/* CTA Buttons */}
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<button
							onClick={onStartClick}
							className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-200 transform hover:scale-105"
						>
							Start Screening Now
						</button>
						<button className="px-8 py-4 border-2 border-purple-500 text-purple-300 rounded-xl font-bold text-lg hover:bg-purple-500/10 transition-all duration-200">
							Learn More
						</button>
					</div>

					{/* Stats */}
					<div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
						<div>
							<div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
								1M+
							</div>
							<p className="text-gray-400 text-sm mt-1">Resumes Processed</p>
						</div>
						<div>
							<div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
								99%
							</div>
							<p className="text-gray-400 text-sm mt-1">Accuracy Rate</p>
						</div>
						<div>
							<div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
								&lt;1s
							</div>
							<p className="text-gray-400 text-sm mt-1">Processing Speed</p>
						</div>
						<div>
							<div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
								24/7
							</div>
							<p className="text-gray-400 text-sm mt-1">Available</p>
						</div>
					</div>
				</div>
			</div>

			{/* Footer */}
			<footer className="border-t border-purple-500/20 bg-black/20 backdrop-blur-sm py-6">
				<div className="container mx-auto px-4 text-center text-gray-400 text-sm">
					<p>
						Built with Python, React & Advanced NLP Technology
					</p>
				</div>
			</footer>
		</div>
	);
}
