export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('=== Webhook received! ===');
    console.log('Body:', JSON.stringify(req.body, null, 2));
    
    const { email, full_name } = req.body;
    
    // Gumroad sends custom fields in FLAT format, not nested!
    // Look for: "custom_fields[GitHub Username]" or just "GitHub Username"
    const githubUsername = 
      req.body['custom_fields[GitHub Username]'] || 
      req.body['GitHub Username'];
    
    console.log('Email:', email);
    console.log('Name:', full_name);
    console.log('GitHub Username:', githubUsername);
    
    if (!githubUsername) {
      console.log('ERROR: No GitHub username provided');
      return res.status(200).json({ 
        success: false, 
        error: 'No GitHub username provided' 
      });
    }
    
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const REPO_OWNER = process.env.REPO_OWNER;
    const REPO_NAME = process.env.REPO_NAME;
    
    if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
      console.log('ERROR: Missing environment variables');
      return res.status(200).json({ 
        success: false, 
        error: 'Server configuration error' 
      });
    }
    
    console.log(`Adding ${githubUsername} to ${REPO_OWNER}/${REPO_NAME}...`);
    
    const githubResponse = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/collaborators/${githubUsername}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ permission: 'pull' })
      }
    );
    
    if (githubResponse.ok || githubResponse.status === 204) {
      console.log('✅ SUCCESS! User added to repo');
      return res.status(200).json({ 
        success: true, 
        message: `Added ${githubUsername} to repository` 
      });
    } else {
      const errorText = await githubResponse.text();
      console.log('❌ FAILED:', githubResponse.status);
      console.log('Error:', errorText);
      return res.status(200).json({ 
        success: false, 
        error: 'Failed to add user to GitHub',
        details: errorText
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return res.status(200).json({ 
      success: false, 
      error: error.message 
    });
  }
}
