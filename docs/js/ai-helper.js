// AI Helper using Free Hugging Face API
// No API key required - completely free and open source

const HF_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

export async function analyzeWithHuggingFace(input, type) {

    try {
        // Text or voice input - Enhanced prompt to extract all details
        const prompt = `[INST] Analyze this crime report and extract ALL available information. Respond with ONLY a JSON object.

Report: "${input}"

Extract:
1. Crime type (ONE of: Theft, Burglary, Robbery, Assault, Vandalism, Vehicle Theft, Drug Activity, Fraud, Harassment, Trespassing, Arson, Suspicious Activity, Other)
2. Brief description/summary
3. Location/address if mentioned
4. Date/time if mentioned (format: YYYY-MM-DD or relative like "yesterday", "today")
5. Number of witnesses if mentioned
6. Any other relevant details

JSON format:
{"crimeType": "type", "description": "summary", "location": "address or null", "dateTime": "when it happened or null", "witnesses": "number or null", "incidentType": "personal or other"}

Determine incidentType: "personal" if report says "I", "me", "my" (happened to reporter), otherwise "other".

JSON response: [/INST]`;

        const response = await fetch(HF_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_new_tokens: 150,
                    temperature: 0.3,
                    top_p: 0.9,
                    return_full_text: false
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));

            // Check if model is loading
            if (errorData.error && errorData.error.includes('loading')) {
                throw new Error('AI model is warming up. Please wait 20 seconds and try again.');
            }

            throw new Error('AI service unavailable');
        }

        const data = await response.json();

        // Extract generated text
        let aiResponse = '';
        if (Array.isArray(data) && data[0]?.generated_text) {
            aiResponse = data[0].generated_text;
        } else if (data.generated_text) {
            aiResponse = data.generated_text;
        } else {
            throw new Error('Invalid response');
        }

        // Parse JSON from response
        const jsonStart = aiResponse.indexOf('{');
        const jsonEnd = aiResponse.lastIndexOf('}');

        if (jsonStart === -1 || jsonEnd === -1) {
            // Fallback to manual extraction
            return extractInfoManually(input);
        }

        const jsonText = aiResponse.substring(jsonStart, jsonEnd + 1);
        const result = JSON.parse(jsonText);

        if (!result.crimeType || !result.description) {
            return extractInfoManually(input);
        }

        // Ensure all fields exist
        return {
            crimeType: result.crimeType,
            description: result.description,
            location: result.location || null,
            dateTime: result.dateTime || null,
            witnesses: result.witnesses || null,
            incidentType: result.incidentType || null
        };

    } catch (error) {
        console.error('Hugging Face AI Error:', error);
        // Always fallback to manual extraction
        return extractInfoManually(input);
    }
}

// Fallback: Keyword-based extraction (always works, no API needed)
function extractInfoManually(text) {
    const lowerText = text.toLowerCase();

    // Crime type detection based on keywords
    const crimeKeywords = {
        'Theft': ['stole', 'stolen', 'theft', 'took', 'missing', 'pickpocket', 'shoplifting'],
        'Burglary': ['broke in', 'break in', 'burglary', 'burglar', 'forced entry', 'breaking and entering'],
        'Robbery': ['robbed', 'robbery', 'mugged', 'gunpoint', 'knifepoint', 'held up'],
        'Assault': ['assault', 'attacked', 'hit', 'beat', 'fight', 'violence', 'punched', 'kicked'],
        'Vandalism': ['vandal', 'damaged', 'graffiti', 'destroyed', 'broken window', 'defaced'],
        'Vehicle Theft': ['car stolen', 'vehicle theft', 'auto theft', 'carjack', 'car theft'],
        'Drug Activity': ['drug', 'drugs', 'dealing', 'substance', 'narcotics', 'marijuana', 'cocaine'],
        'Fraud': ['fraud', 'scam', 'fake', 'phishing', 'identity theft', 'con', 'swindle'],
        'Harassment': ['harass', 'threaten', 'stalking', 'intimidat', 'bullying'],
        'Trespassing': ['trespass', 'unauthorized', 'private property', 'no entry'],
        'Arson': ['fire', 'arson', 'burning', 'flames', 'set fire'],
        'Suspicious Activity': ['suspicious', 'strange', 'unusual', 'lurking', 'loitering']
    };

    let detectedType = 'Other';
    let maxMatches = 0;

    for (const [type, keywords] of Object.entries(crimeKeywords)) {
        const matches = keywords.filter(keyword => lowerText.includes(keyword)).length;
        if (matches > maxMatches) {
            maxMatches = matches;
            detectedType = type;
        }
    }

    // Detect incident type (personal vs other)
    const personalKeywords = ['i ', 'my ', 'me ', 'mine', 'myself'];
    const isPersonal = personalKeywords.some(keyword => lowerText.includes(keyword));

    // Extract location hints
    let location = null;
    const locationPatterns = [
        /(?:at|on|in|near)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln))?)/i,
        /(?:address|location):\s*([^\n,]+)/i
    ];

    for (const pattern of locationPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
            location = match[1].trim();
            break;
        }
    }

    // Extract time hints
    let dateTime = null;
    const timeKeywords = {
        'today': 0,
        'yesterday': -1,
        'last night': -1,
        'this morning': 0,
        'this afternoon': 0,
        'this evening': 0,
        'tonight': 0
    };

    for (const [keyword, daysAgo] of Object.entries(timeKeywords)) {
        if (lowerText.includes(keyword)) {
            const date = new Date();
            date.setDate(date.getDate() + daysAgo);
            dateTime = date.toISOString().split('T')[0];
            break;
        }
    }

    // Extract witness count
    let witnesses = null;
    const witnessMatch = text.match(/(\d+)\s+witness/i);
    if (witnessMatch) {
        witnesses = witnessMatch[1];
    }

    // Create a summary (first 120 characters or full text if shorter)
    const summary = text.length > 120 ? text.substring(0, 120).trim() + '...' : text.trim();

    return {
        crimeType: detectedType,
        description: summary,
        location: location,
        dateTime: dateTime,
        witnesses: witnesses,
        incidentType: isPersonal ? 'personal' : 'other'
    };
}