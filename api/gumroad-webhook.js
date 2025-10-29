// api/gumroad-webhook.js
// Serverless function for Vercel

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('=== Webhook received! ===');
    console.log('Body:', JSON.stringify(req.body, null, 2));
    
    const { email, full_name, custom_fields } = req.body;
    const githubUsername = custom_fields?.['GitHub Username'];
    
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
    
    // Get environment variables
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
    
    // Add user to GitHub repo
    const githubResponse = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/collaborators/${githubUsername}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          permission: 'pull'  // Read-only access
        })
      }
    );
    
    if (githubResponse.ok || githubResponse.status === 204) {
      console.log('✅ SUCCESS! User added to repo');
      
      // Optional: Log this to a database or send confirmation email here
      
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
    
    // Always return 200 to Gumroad so they don't retry
    return res.status(200).json({ 
      success: false, 
      error: error.message 
    });
  }
}
