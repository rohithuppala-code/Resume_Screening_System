export default function Header({ onLogoClick }) {
	return (
		<header className="bg-black/30 backdrop-blur-md shadow-lg border-b border-purple-500/20 sticky top-0 z-40">
			<div className="container mx-auto px-4 py-5">
				<div className="flex items-center justify-between">
					<div
						onClick={onLogoClick}
						className="flex items-center gap-3 cursor-pointer group"
					>
						<div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all duration-200">
							<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
						</div>
						<div>
							<h1 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
								ResumeScreen
							</h1>
							<p className="text-xs text-gray-400">AI Powered</p>
						</div>
					</div>
					<div className="text-sm text-gray-300">
						<span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-300">
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
							</svg>
							Smart Screening
						</span>
					</div>
				</div>
			</div>
		</header>
	);
}
