import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

const CopyButton = ({ code }) => {
	const [coped, setCoped] = useState(false);
	const copyToClipboard = (code) => {
		navigator.clipboard.writeText(code);
		setCoped(true);
		setTimeout(() => {
			setCoped(false);
		}, 1000);
	};
	return (
		<Button onClick={() => copyToClipboard(code)}>{`${
			coped ? 'Coped!' : 'Copy'
		}`}</Button>
	);
};

export default CopyButton;
