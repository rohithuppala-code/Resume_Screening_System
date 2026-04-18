import { useState } from 'react';

export default function ResultsDisplay({ results, jobDescription, onReset }) {
	const [expandedIndex, setExpandedIndex] = useState(null);
	const [sortBy, setSortBy] = useState('score');

	const toggleExpanded = (index) => {
		setExpandedIndex(expandedIndex === index ? null : index);
	};

	const getSortedResults = () => {
		if (sortBy === 'score') {
			return [...results].sort((a, b) => b.score - a.score);
		} else if (sortBy === 'name') {
			return [...results].sort((a, b) => a.name.localeCompare(b.name));
		}
		return results;
	};

	const getScoreColor = (score) => {
		if (score >= 0.8) return 'bg-green-500/20 text-green-300 border-green-500/50';
		if (score >= 0.6) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
		if (score >= 0.4) return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
		return 'bg-red-500/20 text-red-300 border-red-500/50';
	};

	const getScoreBadgeColor = (score) => {
		if (score >= 0.8) return 'from-green-400 to-green-600';
		if (score >= 0.6) return 'from-yellow-400 to-yellow-600';
		if (score >= 0.4) return 'from-orange-400 to-orange-600';
		return 'from-red-400 to-red-600';
	};

	const getRankBadge = (rank) => {
		if (rank === 1) return (
			<div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">
				1
			</div>
		);
		if (rank === 2) return (
			<div className="w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">
				2
			</div>
		);
		if (rank === 3) return (
			<div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">
				3
			</div>
		);
		return (
			<div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center font-bold text-white">
				{rank}
			</div>
		);
	};

	const sortedResults = getSortedResults();

	return (
		<div className="max-w-5xl mx-auto">
			{/* Summary Section */}
			<div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8 border border-purple-500/20">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
							<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
							</svg>
						</div>
						<h2 className="text-3xl md:text-4xl font-bold text-white">
							Screening Results
						</h2>
					</div>
					<div className="flex gap-3">
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
							className="px-4 py-2 border border-purple-500/30 bg-slate-700/50 text-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
						>
							<option value="score">Sort by Score</option>
							<option value="name">Sort by Name</option>
						</select>
						<button
							onClick={onReset}
							className="px-6 py-2 bg-slate-700/50 text-gray-200 border border-purple-500/30 rounded-lg font-medium hover:bg-slate-600/50 transition-colors"
						>
							← Back
						</button>
					</div>
				</div>

				{/* Summary Stats */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
					<div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl">
						<p className="text-gray-400 text-sm font-medium">Total Resumes</p>
						<p className="text-2xl font-bold text-blue-400 mt-1">{results.length}</p>
					</div>
					<div className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl">
						<p className="text-gray-400 text-sm font-medium">Strong Matches</p>
						<p className="text-2xl font-bold text-green-400 mt-1">
							{results.filter(r => r.score >= 0.7).length}
						</p>
					</div>
					<div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-xl">
						<p className="text-gray-400 text-sm font-medium">Top Score</p>
						<p className="text-2xl font-bold text-purple-400 mt-1">
							{(Math.max(...results.map(r => r.score)) * 100).toFixed(1)}%
						</p>
					</div>
					<div className="bg-pink-500/10 border border-pink-500/30 p-4 rounded-xl">
						<p className="text-gray-400 text-sm font-medium">Avg Score</p>
						<p className="text-2xl font-bold text-pink-400 mt-1">
							{(
								(results.reduce((sum, r) => sum + r.score, 0) / results.length) *
								100
							).toFixed(1)}%
						</p>
					</div>
				</div>

				{/* Job Description Summary */}
				<div className="bg-slate-700/30 p-4 rounded-xl border border-purple-500/20">
					<div className="flex items-center gap-2 mb-2">
						<svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
						</svg>
						<h3 className="font-semibold text-gray-300">Job Description Preview</h3>
					</div>
					<p className="text-gray-400 text-sm leading-relaxed">
						{jobDescription ? (
							jobDescription.substring(0, 300) + (jobDescription.length > 300 ? '...' : '')
						) : (
							'No job description available'
						)}
					</p>
				</div>
			</div>

			{/* Results List */}
			<div className="space-y-4">
				{sortedResults.map((result, index) => (
					<div
						key={result.id}
						className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl shadow-lg border border-purple-500/20 hover:border-purple-500/50 overflow-hidden transition-all duration-300"
					>
						{/* Header */}
						<button
							onClick={() => toggleExpanded(index)}
							className="w-full px-6 py-5 hover:bg-purple-500/10 transition-colors flex items-center justify-between"
						>
							<div className="flex items-center gap-4 flex-1 text-left">
								{/* Rank Badge */}
								<div className="flex-shrink-0">
									{getRankBadge(result.rank)}
								</div>

								{/* Resume Name */}
								<div className="flex-1 min-w-0">
									<h3 className="font-bold text-gray-200 text-lg truncate">
										{result.name}
									</h3>
								</div>

								{/* Score */}
								<div className="flex items-center gap-3 ml-4">
									<div className={`px-4 py-2 rounded-lg border font-bold text-center min-w-24 ${getScoreColor(result.score)}`}>
										{result.match_percentage}%
									</div>

									{/* Expand Icon */}
									<svg 
										className={`w-5 h-5 text-gray-400 transform transition-transform flex-shrink-0 ${expandedIndex === index ? 'rotate-180' : ''}`}
										fill="none" 
										stroke="currentColor" 
										viewBox="0 0 24 24"
									>
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
									</svg>
								</div>
							</div>
						</button>

						{/* Expanded Details */}
						{expandedIndex === index && (
							<div className="bg-slate-700/20 border-t border-purple-500/20 px-6 py-6">
								{/* Score Visualization */}
								<div className="mb-6">
									<div className="flex items-center justify-between mb-2">
										<span className="text-sm font-semibold text-gray-300">Match Score</span>
										<span className="text-sm text-gray-400">{result.match_percentage}%</span>
									</div>
									<div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden border border-purple-500/20">
										<div
											className={`h-full bg-gradient-to-r ${getScoreBadgeColor(result.score)} transition-all duration-500`}
											style={{ width: `${result.match_percentage}%` }}
										/>
									</div>
								</div>

								{/* Entities Section */}
								{result.entities && Object.keys(result.entities).length > 0 && (
									<div className="space-y-4">
										<div>
											<div className="flex items-center gap-2 mb-2">
												<svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
												</svg>
												<h4 className="font-semibold text-gray-300 text-sm">
													Extracted Skills
												</h4>
											</div>
											{result.entities.SKILL && result.entities.SKILL.length > 0 ? (
												<div className="flex flex-wrap gap-2">
													{result.entities.SKILL.slice(0, 10).map((skill, i) => (
														<span
															key={i}
															className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium border border-blue-500/30"
														>
															{skill}
														</span>
													))}
													{result.entities.SKILL.length > 10 && (
														<span className="px-3 py-1 bg-gray-500/20 text-gray-300 rounded-full text-xs font-medium border border-gray-500/30">
															+{result.entities.SKILL.length - 10} more
														</span>
													)}
												</div>
											) : (
												<p className="text-xs text-gray-500">No skills detected</p>
											)}
										</div>

										{result.entities.ORG && result.entities.ORG.length > 0 && (
											<div>
												<div className="flex items-center gap-2 mb-2">
													<svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
													</svg>
													<h4 className="font-semibold text-gray-300 text-sm">
														Companies
													</h4>
												</div>
												<div className="flex flex-wrap gap-2">
													{result.entities.ORG.slice(0, 8).map((org, i) => (
														<span
															key={i}
															className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium border border-purple-500/30"
														>
															{org}
														</span>
													))}
												</div>
											</div>
										)}

										{result.entities.EDUCATION && result.entities.EDUCATION.length > 0 && (
											<div>
												<div className="flex items-center gap-2 mb-2">
													<svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
													</svg>
													<h4 className="font-semibold text-gray-300 text-sm">
														Education
													</h4>
												</div>
												<div className="flex flex-wrap gap-2">
													{result.entities.EDUCATION.map((edu, i) => (
														<span
															key={i}
															className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-medium border border-green-500/30"
														>
															{edu}
														</span>
													))}
												</div>
											</div>
										)}
									</div>
								)}

								<div className="mt-6 pt-6 border-t border-purple-500/20">
									<div>
										<p className="text-xs text-gray-500 font-medium mb-2">Match Status</p>
										<div className="flex items-center gap-2">
											{result.match_percentage >= 70 ? (
												<>
													<svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
													</svg>
													<span className="text-lg font-bold text-green-400">Strong Match</span>
												</>
											) : result.match_percentage >= 50 ? (
												<>
													<svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
													</svg>
													<span className="text-lg font-bold text-yellow-400">Moderate</span>
												</>
											) : (
												<>
													<svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
													</svg>
													<span className="text-lg font-bold text-red-400">Weak Match</span>
												</>
											)}
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				))}
			</div>

			{/* Empty State */}
			{results.length === 0 && (
				<div className="bg-slate-800/50 rounded-xl shadow-lg p-12 text-center border border-purple-500/20">
					<div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
						</svg>
					</div>
					<p className="text-gray-400 text-lg font-medium">No results available</p>
				</div>
			)}
		</div>
	);
}
