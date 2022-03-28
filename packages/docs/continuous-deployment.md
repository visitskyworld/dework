
# Continuous Deployment

## Github Actions

### Deploying to API/app
```bash
npm version patch
git push --tags
```

Pushing tags will trigger Github Actions `Deploy API` and `Deploy App`, which will deploy to prod

### Setup of API/app deployment

1. Create service account
2. [Grant SA permissions to push to GCR](https://cloud.google.com/container-registry/docs/access-control)
3. [Grant SA permissions to deploy Cloud Run](https://stackoverflow.com/a/55788899/12338002)
  - Cloud Run Admin
  - Service Account User
4. Create SA JSON key and store as `GCR_JSON_KEY` in the [Github repo secrets](https://github.com/deworkxyz/dework/settings/secrets/actions)