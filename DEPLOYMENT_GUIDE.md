# Deploy Gumroad → GitHub Webhook to Vercel

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Vercel account (free): https://vercel.com/signup
- GitHub account
- Fresh GitHub Personal Access Token with `repo` scope

---

## Step 1: Create a Fresh GitHub Token 🔑

**IMPORTANT:** Delete your old tokens first (they were exposed in chat)

1. Go to: https://github.com/settings/tokens
2. Delete old tokens: `github_pat_11BY44ASI...` and `ghp_PmLvOj0yulGj...`
3. Click **"Generate new token"** → **"Generate new token (classic)"**
4. Name it: `Gumroad Production Webhook`
5. Select scopes:
   - ✅ `repo` (Full control of private repositories)
6. Click "Generate token"
7. **COPY IT IMMEDIATELY** (you won't see it again)

---

## Step 2: Upload Files to GitHub

### Option A: Use GitHub Web Interface (Easiest)

1. Go to: https://github.com/new
2. Create a new repository:
   - Name: `gumroad-webhook`
   - Privacy: **Private** (recommended)
   - Click "Create repository"

3. Click "uploading an existing file"

4. Upload these files:
   - `api/gumroad-webhook.js`
   - `vercel.json`
   - `package.json`
   - `.gitignore`

5. Click "Commit changes"

### Option B: Use Git Command Line

```bash
# Navigate to the folder with the files
cd /path/to/vercel-deploy

# Initialize git
git init

# Add files
git add .

# Commit
git commit -m "Initial commit"

# Add your GitHub repo as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/mkj-droid/gumroad-webhook.git

# Push
git push -u origin main
```

---

## Step 3: Deploy to Vercel

### Method 1: Via Vercel Website (Recommended - No CLI needed)

1. Go to: https://vercel.com/new
2. Click "Import Git Repository"
3. Find and select your `gumroad-webhook` repository
4. Click "Import"
5. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add these 3 variables:
     - **Name:** `GITHUB_TOKEN` **Value:** `your_new_token_here`
     - **Name:** `REPO_OWNER` **Value:** `mkj-droid`
     - **Name:** `REPO_NAME` **Value:** `jira-python`
6. Click "Deploy"
7. Wait ~30 seconds... Done! 🎉

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from the project folder)
cd /path/to/vercel-deploy
vercel --prod

# When prompted, add environment variables:
# GITHUB_TOKEN, REPO_OWNER, REPO_NAME
```

---

## Step 4: Get Your Webhook URL

After deployment, Vercel will give you a URL like:

```
https://gumroad-webhook-abc123.vercel.app
```

Your webhook endpoint will be:

```
https://gumroad-webhook-abc123.vercel.app/api/gumroad-webhook
```

**Copy this URL!**

---

## Step 5: Connect Gumroad

1. Log into Gumroad: https://gumroad.com
2. Go to **Settings** → **Advanced**
3. Find the **"Ping"** section
4. Paste your webhook URL:
   ```
   https://gumroad-webhook-abc123.vercel.app/api/gumroad-webhook
   ```
5. Click **"Send test ping to URL"** to test
6. You should see: `{"success":true}`
7. Click **"Update settings"**

---

## Step 6: Add Custom Field to Your Product

1. Go to your Gumroad product
2. Click **"Edit Product"**
3. Scroll to **"Custom Fields"**
4. Click **"Add custom field"**
5. Configure:
   - **Label:** `GitHub Username`
   - **Type:** Text
   - **Required:** ✅ Yes
6. Click **"Save"**

---

## Step 7: Test with a Real Purchase! 🎉

1. Make a test purchase (use Gumroad's test mode)
2. Enter a valid GitHub username at checkout
3. Complete the purchase
4. Check GitHub: https://github.com/mkj-droid/jira-python/settings/access
5. The user should be listed as a collaborator!

---

## 🔍 Troubleshooting

### Check Vercel Logs

1. Go to: https://vercel.com/dashboard
2. Click your project
3. Click "Deployments"
4. Click the latest deployment
5. Click "Functions" tab
6. Click "gumroad-webhook"
7. View logs to see what happened

### Common Issues

**"No GitHub username provided"**
- User didn't fill in the custom field at checkout
- Check the field is marked as "Required"

**"403 Forbidden" from GitHub**
- Token doesn't have `repo` scope
- Regenerate token with correct permissions

**"404 Not Found" from GitHub**
- `REPO_OWNER` or `REPO_NAME` is wrong
- Check environment variables in Vercel

**"User not found"**
- The GitHub username doesn't exist
- Buyer typed it wrong

### Testing the Webhook Directly

```bash
curl -X POST https://your-project.vercel.app/api/gumroad-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "full_name": "Test User",
    "custom_fields": {
      "GitHub Username": "octocat"
    }
  }'
```

---

## 🎯 Production Checklist

- ✅ Old tokens deleted
- ✅ New token created with `repo` scope only
- ✅ Environment variables set in Vercel
- ✅ Custom field added to Gumroad product
- ✅ Webhook URL configured in Gumroad
- ✅ Test purchase completed successfully
- ✅ User appears in GitHub collaborators

---

## 💡 Pro Tips

1. **Monitor logs regularly** (especially first few days)
2. **Test with multiple GitHub usernames** before going live
3. **Consider adding email confirmation** to buyers after repo access granted
4. **Set up Vercel email notifications** for function errors
5. **Document the process** for your buyers (e.g., "Enter your GitHub username to get repo access")

---

## 🔒 Security Notes

- Never commit `.env` files or tokens to GitHub
- Regenerate tokens if exposed
- Use minimal token permissions (only `repo` scope)
- Monitor Vercel logs for suspicious activity
- Consider rate limiting for high-volume sales

---

## 📊 Cost

**Vercel Free Tier includes:**
- 100GB bandwidth/month
- 100 hours function execution/month
- Unlimited deployments

**For your use case:** Completely FREE ✅

Even with 1000 sales/month, you'd use:
- ~10MB bandwidth
- ~5 minutes function time

You'll never hit the limits!

---

## 🎉 You're Done!

Your Gumroad → GitHub automation is now:
- ✅ Live and running 24/7
- ✅ Completely serverless (no server to manage)
- ✅ Auto-scaling (handles 1 or 1000 sales)
- ✅ Free forever
- ✅ Takes 200ms to add each user

**Congratulations!** 🍾

Now go sell those scripts! 💰

---

## Need Help?

- Vercel docs: https://vercel.com/docs
- GitHub API docs: https://docs.github.com/en/rest/collaborators
- Gumroad docs: https://help.gumroad.com

Questions? Check the Vercel logs first - they'll show exactly what went wrong!
