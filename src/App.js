import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Form, Spinner, Table } from 'react-bootstrap';
import CopyButton from './components/CopyButton/CopyButton';

// Функция для поиска дубликатов среди <Code>
const findDuplicates = (codes) => {
	const counts = {};
	const duplicates = [];

	codes.forEach((code) => {
		counts[code] = (counts[code] || 0) + 1;
	});

	// Собираем коды, которые встречаются более одного раза
	for (const code in counts) {
		if (counts[code] > 1) {
			duplicates.push(code);
		}
	}

	return duplicates;
};

const App = () => {
	const [file, setFile] = useState(null);
	const [loading, setLoading] = useState(false);
	const [duplicates, setDuplicates] = useState([]);
	const [error, setError] = useState('');

	const handleFileChange = (event) => {
		setFile(event.target.files[0]);
	};

	const handleUpload = () => {
		if (!file) {
			setError('Please select a file to upload.');
			return;
		}

		setLoading(true);
		setError('');

		const reader = new FileReader();

		reader.onload = (e) => {
			const text = e.target.result;

			// Парсим XML
			const parser = new DOMParser();
			const xmlDoc = parser.parseFromString(text, 'text/xml');

			// Извлекаем все <Code> элементы
			const codes = Array.from(xmlDoc.getElementsByTagName('Code')).map(
				(codeElement) => codeElement.textContent
			);

			// Ищем дубликаты
			const duplicateCodes = findDuplicates(codes);

			setDuplicates(duplicateCodes);
			setLoading(false);
		};

		reader.onerror = () => {
			setError('Error reading file.');
			setLoading(false);
		};

		reader.readAsText(file);
	};

	return (
		<Container fluid>
			<h1 className='my-4 fs-3'>XML Duplicate finder</h1>
			<div className='form-group'>
				<div className='d-flex'>
					<Form.Control type='file' onChange={handleFileChange} />
					<Button
						onClick={handleUpload}
						disabled={loading}
						variant='primary'
						className='ms-3'
					>
						{loading ? 'Processing...' : 'Upload'}
					</Button>
				</div>
			</div>

			{error && <div className='alert alert-danger mt-3'>{error}</div>}

			{loading && (
				<div className='position-fixed top-0 left-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white'>
					<Spinner animation='border' role='status'>
						<span className='visually-hidden'>Loading...</span>
					</Spinner>
				</div>
			)}

			{!loading && duplicates.length > 0 && (
				<>
					<h3 className='my-4'>Duplicate Codes</h3>
					<Table responsive bordered>
						<thead>
							<tr>
								<th>#</th>
								<th>Code</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{duplicates.map((code, index) => (
								<tr key={index} className='fs-6'>
									<td>{index + 1}</td>
									<td>{code}</td>
									<td>
										<CopyButton cod={code} />
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				</>
			)}
		</Container>
	);
};

export default App;
