# 🚀 Deploying FIELDZ Frontend to Vercel

This guide will walk you through deploying your FIELDZ React + Vite application to Vercel.

## 📋 Prerequisites

- [x] GitHub account
- [x] Vercel account (sign up at [vercel.com](https://vercel.com))
- [x] Your code pushed to a GitHub repository
- [x] Backend API deployed and accessible (e.g., on Koyeb)

---

## 🛠️ Step 1: Prepare Your Application

### 1.1 Verify Build Configuration

Make sure your `package.json` has the correct build script:

```json
{
  "scripts": {
    "dev": "vite --mode development",
    "build": "vite build --mode production",
    "preview": "vite preview"
  }
}
```

✅ **Already configured!**

### 1.2 Check Environment Variables

Ensure your `.env.production` file has the correct production API URL:

```env
VITE_API_URL=https://vital-nana-fieldz-11e3f995.koyeb.app/api
VITE_API_BASE_URL=https://vital-nana-fieldz-11e3f995.koyeb.app
```

✅ **Already configured!**

### 1.3 Test Production Build Locally

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

Visit `http://localhost:4173` to verify everything works.

---

## 🚢 Step 2: Push to GitHub

If you haven't already, push your code to GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Vercel deployment"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/FIELDZ-PRO.git

# Push to GitHub
git push -u origin main
```

---

## 🌐 Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended for first deployment)

#### 3.1 Sign In to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"**

#### 3.2 Import Your Repository
1. Click **"Add New..."** → **"Project"**
2. Select **"Import Git Repository"**
3. Find and select your `FIELDZ-PRO` repository
4. Click **"Import"**

#### 3.3 Configure Your Project

**Framework Preset:** Vite
- Vercel should auto-detect this ✅

**Root Directory:** `frontend`
- Click **"Edit"** next to Root Directory
- Enter: `frontend`
- This tells Vercel your app is in the `frontend` folder

**Build Settings:**
```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

#### 3.4 Set Environment Variables

Click **"Environment Variables"** and add:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://vital-nana-fieldz-11e3f995.koyeb.app/api` |
| `VITE_API_BASE_URL` | `https://vital-nana-fieldz-11e3f995.koyeb.app` |
| `VITE_ENV` | `production` |
| `VITE_DEFAULT_LANG` | `fr` |
| `VITE_APP_NAME` | `FIELDZ` |
| `VITE_GOOGLE_CLIENT_ID` | `your_google_client_id.apps.googleusercontent.com` |

**Important:** Make sure to select **"Production"** for all variables!

#### 3.5 Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. Your app will be live at: `https://your-project-name.vercel.app`

---

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to frontend directory
cd /home/nazimlameche/FIELDZ-PRO/frontend

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# ? Set up and deploy "~/FIELDZ-PRO/frontend"? [Y/n] y
# ? Which scope do you want to deploy to? [Your Account]
# ? Link to existing project? [y/N] n
# ? What's your project's name? fieldz-frontend
# ? In which directory is your code located? ./

# Deploy to production
vercel --prod
```

---

## ⚙️ Step 4: Configure Build Settings (If Needed)

Create a `vercel.json` file in your `frontend` directory:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures:
- ✅ Correct build command
- ✅ Correct output directory
- ✅ Client-side routing works (redirects all routes to index.html)

---

## 🔒 Step 5: Configure CORS on Backend

Make sure your backend (Koyeb) allows requests from your Vercel domain:

In your Spring Boot `application.yml` or `CorsConfig.java`:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins(
                        "http://localhost:5173",
                        "https://your-project-name.vercel.app"  // Add your Vercel URL
                    )
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

---

## 🎯 Step 6: Set Up Custom Domain (Optional)

### 6.1 Add Domain in Vercel
1. Go to your project dashboard
2. Click **"Settings"** → **"Domains"**
3. Click **"Add"**
4. Enter your domain: `fieldz.app`

### 6.2 Configure DNS
Vercel will provide DNS records. Add these to your domain provider:

**For root domain (fieldz.app):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 6.3 Update Environment Variables
Update `VITE_SITE_URL` to your custom domain:
```env
VITE_SITE_URL=https://fieldz.app
```

---

## 🔄 Step 7: Automatic Deployments

Vercel automatically deploys when you push to GitHub!

### Production Deployments
```bash
git add .
git commit -m "Update feature"
git push origin main
```
→ Automatically deploys to production

### Preview Deployments
```bash
git checkout -b new-feature
git add .
git commit -m "Add new feature"
git push origin new-feature
```
→ Creates a preview deployment for testing

---

## ✅ Step 8: Verify Deployment

### 8.1 Check Build Logs
1. Go to your Vercel dashboard
2. Click on your deployment
3. Check **"Build Logs"** for any errors

### 8.2 Test Your Application
Visit your Vercel URL and test:
- [ ] Landing page loads
- [ ] Registration works
- [ ] Login works
- [ ] API calls work (check Network tab)
- [ ] All routes work (try refreshing on different pages)

### 8.3 Check Environment Variables
Open browser console and check:
```javascript
// These should show your production URLs
console.log(import.meta.env.VITE_API_URL)
console.log(import.meta.env.VITE_API_BASE_URL)
```

---

## 🐛 Troubleshooting

### Build Fails
**Error:** `Command "npm run build" exited with 1`

**Solutions:**
1. Check build logs for specific errors
2. Verify `package.json` scripts are correct
3. Test build locally: `npm run build`
4. Check for TypeScript errors

### API Calls Fail (CORS Error)
**Error:** `Access to fetch has been blocked by CORS policy`

**Solutions:**
1. Add Vercel URL to backend CORS configuration
2. Verify `VITE_API_BASE_URL` is set correctly
3. Check backend is running and accessible

### Routes Return 404 on Refresh
**Error:** Refreshing `/joueur` gives 404

**Solution:**
Add `vercel.json` with rewrites configuration (see Step 4)

### Environment Variables Not Working
**Error:** API calls go to wrong URL

**Solutions:**
1. Go to Vercel dashboard → Settings → Environment Variables
2. Verify all `VITE_*` variables are set
3. Redeploy: Deployments → (latest) → ⋯ → Redeploy

---

## 📊 Step 9: Monitor Your Deployment

### Analytics
Vercel provides built-in analytics:
1. Go to your project dashboard
2. Click **"Analytics"**
3. View traffic, performance, and errors

### Logs
View runtime logs:
1. Click **"Deployments"**
2. Select a deployment
3. Click **"Function Logs"** or **"Edge Logs"**

---

## 🔄 Step 10: Update Deployment

### Method 1: Git Push (Recommended)
```bash
# Make changes
git add .
git commit -m "Update app"
git push origin main
```
→ Automatic deployment!

### Method 2: Vercel CLI
```bash
vercel --prod
```

### Method 3: Vercel Dashboard
1. Go to Deployments
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**

---

## 🎉 Success Checklist

- [ ] Application builds successfully
- [ ] Environment variables are set
- [ ] Application is accessible via Vercel URL
- [ ] API calls work correctly
- [ ] All routes work (test navigation and refresh)
- [ ] Authentication works (login/register)
- [ ] CORS is configured on backend
- [ ] Custom domain configured (optional)
- [ ] SSL certificate is active (automatic)
- [ ] Automatic deployments enabled

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Custom Domains](https://vercel.com/docs/custom-domains)

---

## 🆘 Need Help?

- Vercel Support: support@vercel.com
- Vercel Community: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- FIELDZ Issues: Create an issue in your GitHub repo

---

**🎊 Your FIELDZ application is now live on Vercel!**

Share your deployment URL: `https://your-project-name.vercel.app`
