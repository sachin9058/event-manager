# Vercel Deployment Checklist

## ⚠️ Critical: Environment Variables

Make sure ALL environment variables are added to your Vercel project:

### 1. Go to Vercel Dashboard
- Navigate to your project
- Go to **Settings** → **Environment Variables**

### 2. Add These Variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_d2FybS1ibHVlamF5LTk5LmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_DvKV8J7IZTjO9dwaCbj6txC4RA0f1s7AoEYBP3XMNN
CLERK_WEBHOOK_SECRET=(your_webhook_secret)

# MongoDB
MONGO_DB_URI=mongodb+srv://luciferdb:luciferdb@cluster0.j2gm7wb.mongodb.net/?appName=Cluster0

# Email Service
EMAIL_USER=luciferzx136@gmail.com
EMAIL_PASSWORD=otep guwn yfpo jzqm
EMAIL_FROM_NAME=Event Manager

# App URL (important for invite links)
NEXT_PUBLIC_APP_URL=https://fest-architects.vercel.app
```

**Important Notes:**
- Variables starting with `NEXT_PUBLIC_` are exposed to the browser
- All other variables are server-side only
- After adding variables, **redeploy** your app

## 🔧 MongoDB Atlas Configuration

### Allow Vercel IP Addresses:
1. Go to MongoDB Atlas Dashboard
2. Navigate to **Network Access**
3. Click **Add IP Address**
4. Select **Allow Access from Anywhere** (0.0.0.0/0)
   - OR add Vercel's specific IP ranges

### Connection String:
- Make sure your MongoDB URI includes the database name
- Current format: `mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0`
- Recommended format: `mongodb+srv://username:password@cluster.mongodb.net/eventmanager?retryWrites=true&w=majority`

## 🔐 Clerk Webhook Setup

1. Go to Clerk Dashboard → **Webhooks**
2. Add endpoint: `https://fest-architects.vercel.app/api/webhook`
3. Subscribe to events: `user.created`, `user.updated`
4. Copy the **Signing Secret**
5. Add it to Vercel as `CLERK_WEBHOOK_SECRET`

## 📋 Common Issues & Solutions

### Issue: 500 Error on /api/clubs
**Solutions:**
1. ✅ Check if `MONGO_DB_URI` is set in Vercel
2. ✅ Verify MongoDB Atlas allows Vercel IPs
3. ✅ Check Vercel Function Logs for detailed errors
4. ✅ User auto-creation added to GET endpoint (fixed)

### Issue: Users not syncing
**Solutions:**
1. ✅ Webhook endpoint configured correctly
2. ✅ `CLERK_WEBHOOK_SECRET` matches Clerk dashboard
3. ✅ Test webhook from Clerk dashboard

### Issue: Certificates not sending
**Solutions:**
1. ✅ Gmail App Password configured
2. ✅ `EMAIL_USER` and `EMAIL_PASSWORD` set in Vercel
3. ✅ Check Vercel Function timeout (default 10s, max 60s on Pro)

## 🚀 Deployment Steps

1. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Fix: Auto-create user in clubs GET endpoint"
   git push origin master
   ```

2. **Vercel will auto-deploy** (if connected to GitHub)
   - Or deploy manually: `vercel --prod`

3. **Check deployment:**
   - Go to Vercel Dashboard
   - Check **Deployments** tab
   - Click on latest deployment
   - View **Function Logs** for errors

4. **Test the app:**
   - Visit: https://fest-architects.vercel.app
   - Sign in with Clerk
   - Try creating a club
   - Check if clubs are fetched

## 🔍 Debugging on Vercel

### View Logs:
1. Vercel Dashboard → Your Project
2. Click on a **Deployment**
3. Go to **Functions** tab
4. Click on any function to see logs
5. Look for MongoDB connection logs

### Real-time Logs:
```bash
vercel logs --follow
```

## ✅ Current Fixes Applied

1. ✅ Auto-create user if not found in database (prevents 404 errors)
2. ✅ Added detailed MongoDB connection logging
3. ✅ Better error handling with specific error messages
4. ✅ All TypeScript errors fixed
5. ✅ All lint errors fixed

## 📞 Need Help?

If still getting 500 errors:
1. Check Vercel Function Logs (most important!)
2. Verify all environment variables are set
3. Test MongoDB connection from Atlas dashboard
4. Check Clerk webhook is receiving events

The logs will show the exact error message!
