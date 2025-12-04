# MongoDB Integration Guide

## Setup Complete! ✅

### What's Been Created:

1. **Database Connection** (`lib/db.ts`)
   - MongoDB connection with caching for optimal performance

2. **Models**
   - **User Model** (`models/User.ts`) - Stores Clerk user data
   - **Club Model** (`models/Club.ts`) - Stores club information

3. **API Routes**
   - **POST/GET `/api/users`** - Manage user data
   - **POST/GET `/api/clubs`** - Create and fetch clubs
   - **POST `/api/webhook`** - Auto-sync users from Clerk

---

## 🚀 How to Use

### 1. Setup Clerk Webhook (IMPORTANT)

To automatically sync users when they sign up:

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to **Webhooks** in your application
3. Click **Add Endpoint**
4. Enter URL: `https://your-domain.com/api/webhook`
5. Select events: `user.created`, `user.updated`, `user.deleted`
6. Copy the **Signing Secret**
7. Add it to `.env.local`: `CLERK_WEBHOOK_SECRET=whsec_xxxxx`

### 2. Manual User Creation (Alternative)

If you want to manually create a user in MongoDB after login:

```typescript
// Call this after user signs in
const response = await fetch('/api/users', {
  method: 'POST',
});
const data = await response.json();
```

### 3. Create a Club

```typescript
const createClub = async () => {
  const response = await fetch('/api/clubs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Tech Club',
      description: 'A club for tech enthusiasts',
      category: 'Technical',
      logo: 'https://example.com/logo.png', // optional
    }),
  });
  const data = await response.json();
  console.log(data.club);
};
```

### 4. Get User's Clubs

```typescript
const fetchClubs = async () => {
  const response = await fetch('/api/clubs');
  const data = await response.json();
  console.log(data.clubs);
};
```

---

## 📊 Schema Details

### User Schema
```typescript
{
  clerkId: string (unique)
  email: string (unique)
  firstName: string
  lastName: string
  imageUrl: string
  createdAt: Date
  updatedAt: Date
}
```

### Club Schema
```typescript
{
  name: string
  description: string
  category: 'Cultural' | 'Technical' | 'Sports' | 'Academic' | 'Social' | 'Other'
  createdBy: ObjectId (User reference)
  members: ObjectId[] (User references)
  logo: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

---

## 🔧 Testing

### Test MongoDB Connection
```bash
npm run dev
```

Then visit: `http://localhost:3000/api/users` (should return user data if logged in)

### Check MongoDB Atlas
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Browse your cluster
3. Check `Users` and `Clubs` collections

---

## 🛠️ Troubleshooting

**Issue**: User not created automatically
- **Solution**: Set up Clerk webhook (see step 1 above)

**Issue**: MongoDB connection error
- **Solution**: Check `MONGO_DB_URI` in `.env.local`

**Issue**: Unauthorized error
- **Solution**: Ensure user is logged in via Clerk

---

## Next Steps

1. ✅ Set up Clerk webhook for automatic user sync
2. ✅ Test creating a club
3. ✅ Build UI components for club management
4. ✅ Add event management features
