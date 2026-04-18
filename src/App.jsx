import { useState } from 'react';
import Landing from './components/Landing';
import Header from './components/Header';
import ScreeningInterface from './components/ScreeningInterface';
import ResultsDisplay from './components/ResultsDisplay';
import './App.css';

function App() {
	const [currentPage, setCurrentPage] = useState('landing'); // landing or screening
	const [results, setResults] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [jobDescription, setJobDescription] = useState('');

	const handleScreeningComplete = (screeningResults, jobDesc) => {
		setResults(screeningResults);
		setJobDescription(jobDesc);
		setError(null);
	};

	const handleError = (errorMessage) => {
		setError(errorMessage);
	};

	const handleReset = () => {
		setResults(null);
		setError(null);
		setJobDescription('');
	};

	const handleStartScreening = () => {
		setCurrentPage('screening');
	};

	const handleBackHome = () => {
		setCurrentPage('landing');
		handleReset();
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
			{currentPage === 'landing' ? (
				<Landing onStartClick={handleStartScreening} />
			) : (
				<>
					<Header onLogoClick={handleBackHome} />
					<main className="container mx-auto px-4 py-8">
						{!results ? (
							<ScreeningInterface
								setResults={handleScreeningComplete}
								setError={handleError}
								setLoading={setLoading}
								loading={loading}
								error={error}
							/>
						) : (
							<ResultsDisplay
								results={results}
								jobDescription={jobDescription}
								onReset={handleReset}
							/>
						)}
					</main>
				</>
			)}
		</div>
	);
}

export default App;
