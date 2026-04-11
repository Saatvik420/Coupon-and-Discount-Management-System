# Render Build Failure Troubleshooting

## 🔍 Common Build Failures & Solutions

### 1. Check Render Build Logs
First, check the exact error message in Render dashboard:
1. Go to your Render service
2. Click **"Logs"** tab
3. Look for the specific error message
4. Copy the error message for debugging

### 2. Most Common Issues & Fixes

#### Issue: "Maven wrapper not found"
**Error**: `./mvnw: No such file or directory`
**Solution**: The Maven wrapper files are missing from your repository
**Fix**:
```bash
# In your backend directory, run:
mvn wrapper:wrapper
git add . mvnw mvnw.cmd .mvn
git commit -m "Add Maven wrapper"
git push origin main
```

#### Issue: "Java version mismatch"
**Error**: `Unsupported Java version` or `Java 17 required`
**Solution**: Update render.yaml to specify Java version
**Fix**: Make sure your render.yaml has:
```yaml
envVars:
  - key: JAVA_VERSION
    value: 17
```

#### Issue: "Build command failed"
**Error**: `Build command exited with code 1`
**Solution**: Check if Maven build works locally
**Fix**: Test locally first:
```bash
cd backend
./mvnw clean package -DskipTests
```

#### Issue: "Port binding error"
**Error**: `Port 8080 already in use`
**Solution**: Spring Boot should use dynamic port
**Fix**: Add to `application.properties`:
```properties
server.port=${PORT:8080}
```

#### Issue: "Dependencies not found"
**Error**: `Could not find dependencies`
**Solution**: Maven can't download dependencies
**Fix**: Check your `pom.xml` and internet connection

#### Issue: "Compilation failed"
**Error**: `Compilation failure`
**Solution**: Java code has syntax errors
**Fix**: Check your Java files for syntax errors

### 3. Quick Fixes to Try

#### Fix 1: Update render.yaml
Make sure your render.yaml in root directory is correct:
```yaml
services:
  - type: web
    name: coupon-backend
    env: java
    plan: free
    buildCommand: ./mvnw clean package -DskipTests
    startCommand: java -jar target/coupon-management-0.0.1-SNAPSHOT.jar
    rootDir: backend
    envVars:
      - key: JAVA_VERSION
        value: 17
      - key: SPRING_PROFILES_ACTIVE
        value: production
```

#### Fix 2: Add Maven Wrapper
If Maven wrapper is missing:
```bash
cd backend
mvn wrapper:wrapper
git add mvnw mvnw.cmd .mvn
git commit -m "Add Maven wrapper"
git push origin main
```

#### Fix 3: Update application.properties
Add port configuration to backend/src/main/resources/application.properties:
```properties
server.port=${PORT:8080}
```

#### Fix 4: Check pom.xml
Make sure your pom.xml has:
```xml
<properties>
    <java.version>17</java.version>
</properties>
```

### 4. Debug Step-by-Step

#### Step 1: Local Test
```bash
cd backend
./mvnw clean package -DskipTests
ls -la target/
```
You should see `coupon-management-0.0.1-SNAPSHOT.jar`

#### Step 2: Check Files in Git
```bash
git ls-files | grep mvnw
git ls-files | grep render.yaml
```
Both should show up in the list

#### Step 3: Verify render.yaml
```bash
cat render.yaml
```
Check for syntax errors

#### Step 4: Push Updated Code
```bash
git add .
git commit -m "Fix build issues"
git push origin main
```

### 5. Alternative: Manual Configuration

If render.yaml doesn't work, use manual setup in Render:

1. **Environment**: Java
2. **Root Directory**: `backend`
3. **Build Command**: `./mvnw clean package -DskipTests`
4. **Start Command**: `java -jar target/coupon-management-0.0.1-SNAPSHOT.jar`
5. **Instance Type**: Free

### 6. Get Help

If still failing:
1. **Copy the exact error** from Render logs
2. **Check your local build** works
3. **Verify all files** are in Git
4. **Try manual setup** instead of render.yaml

### 7. Common Error Messages & Meanings

| Error Message | What It Means | How to Fix |
|---------------|----------------|------------|
| `./mvnw: Permission denied` | Maven wrapper not executable | `chmod +x mvnw` |
| `package org.springframework.boot does not exist` | Spring Boot dependency missing | Check pom.xml |
| `cannot find symbol` | Java compilation error | Fix syntax errors |
| `Connection refused` | Database connection issue | Check MongoDB URI |
| `Port already in use` | Port conflict | Use dynamic port |

### 8. Quick Recovery Commands

```bash
# Reset and try again
git add .
git commit -m "Fix deployment issues"
git push origin main

# Or start fresh
git checkout -b deploy-fix
# Make changes
git checkout main
git merge deploy-fix
git push origin main
```

## 🚀 Most Likely Fix

The most common issue is **missing Maven wrapper files**. Try this first:

```bash
cd backend
mvn wrapper:wrapper
git add mvnw mvnw.cmd .mvn
git commit -m "Add Maven wrapper files"
git push origin main
```

Then trigger a new deploy in Render!
