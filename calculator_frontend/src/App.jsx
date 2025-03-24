import React, { useState } from 'react';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function App() {
    const [umlDescription, setUmlDescription] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [error, setError] = useState('');

    // Use the environment variable for the API base URL
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous errors
        setGeneratedCode(''); // Clear any previous generated code
    
        try {
            // Send UML description to Django backend
            const response = await axios.post(`${API_BASE_URL}/api/generate-code/`, {
                description: umlDescription,
            });
    
            // Log the response for debugging
            console.log("Response from backend:", response.data);
    
            // Set the generated code in state
            if (response.data && response.data.code) {
                setGeneratedCode(response.data.code);
            } else {
                setError('No code generated. Please check the input and try again.');
            }
        } catch (error) {
            console.error('Error generating code:', error);
            setError('Failed to generate code. Please try again.');
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', color: '#333' }}>UML to Code Generator</h1>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <textarea
                    value={umlDescription}
                    onChange={(e) => setUmlDescription(e.target.value)}
                    placeholder="Enter UML class diagram description"
                    style={{
                        width: '100%',
                        height: '150px',
                        padding: '10px',
                        fontSize: '16px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        marginBottom: '10px',
                    }}
                />
                <button
                    type="submit"
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        backgroundColor: '#007BFF',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Generate Code
                </button>
            </form>

            {/* Display error message if any */}
            {error && (
                <div style={{ color: 'red', marginBottom: '20px', textAlign: 'center' }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* Display generated code with syntax highlighting */}
            {generatedCode && (
                <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '5px', border: '1px solid #ddd' }}>
                    <h2 style={{ color: '#333', marginBottom: '10px' }}>Generated Code:</h2>
                    <SyntaxHighlighter
                        language="python" // Set the language for syntax highlighting
                        style={dark} // Use the dark theme
                        customStyle={{
                            background: '#000',
                            padding: '15px',
                            borderRadius: '5px',
                            border: '1px solid #ddd',
                            fontSize: '14px',
                            overflowX: 'auto',
                        }}
                    >
                        {generatedCode}
                    </SyntaxHighlighter>
                </div>
            )}
        </div>
    );
}

export default App;