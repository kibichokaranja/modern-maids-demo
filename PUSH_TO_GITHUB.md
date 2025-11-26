# How to Push ModernMaids to GitHub - Command Line Method

## Step 1: Create New Repository on GitHub

1. On GitHub.com, click the **"+"** icon (top right)
2. Click **"New repository"**
3. Fill in:
   - **Repository name:** `modern-maids-demo`
   - **Description:** "Modern Maids cleaning management demo"
   - **Visibility:** Public
   - **DO NOT** check any boxes (no README, no .gitignore, no license)
4. Click **"Create repository"**
5. **Copy the repository URL** - it will look like:
   `https://github.com/kibichokaranja/modern-maids-demo.git`

## Step 2: Open PowerShell in ModernMaids Folder

1. Open PowerShell
2. Navigate to your project:
   ```powershell
   cd C:\Users\kibic\OneDrive\Desktop\ModernMaids
   ```

## Step 3: Run These Commands

Copy and paste these commands one by one:

```powershell
# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Modern Maids demo"

# Connect to GitHub (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/kibichokaranja/modern-maids-demo.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 4: Authenticate

- You'll be asked to log in to GitHub
- Follow the prompts (may open browser for authentication)
- Enter your GitHub username and password/token

## Done!

Go to your GitHub repository page - you should see all your files!

