
# Setup

Originally followed these steps: https://hackernoon.com/how-to-deploy-metabase-on-google-cloud-platform-gcp-ixv3xpo

```bash
docker pull metabase/metabase:latest
docker tag metabase/metabase:latest gcr.io/dework-prod/metabase
docker push gcr.io/dework-prod/metabase

gcloud compute instances create-with-container metabase \
  --project=dework-prod \
  --zone=us-central1-a \
  --machine-type=g1-small \
  --network-interface=network-tier=PREMIUM,subnet=default \
  --maintenance-policy=MIGRATE \
  --service-account=634517927184-compute@developer.gserviceaccount.com \
  --scopes=https://www.googleapis.com/auth/devstorage.read_only,https://www.googleapis.com/auth/logging.write,https://www.googleapis.com/auth/monitoring.write,https://www.googleapis.com/auth/servicecontrol,https://www.googleapis.com/auth/service.management.readonly,https://www.googleapis.com/auth/trace.append \
  --tags=http-server,https-server \
  --image=projects/cos-cloud/global/images/cos-stable-97-16919-29-5 \
  --boot-disk-size=10GB \
  --boot-disk-type=pd-balanced \
  --boot-disk-device-name=metabase \
  --container-image=gcr.io/dework-prod/metabase \
  --container-restart-policy=always \
  --no-shielded-secure-boot \
  --shielded-vtpm \
  --shielded-integrity-monitoring \
  --labels=container-vm=cos-stable-97-16919-29-5 \
```

Doesn't seem like running the container doesn't just work

```bash
docker run -d -p 80:3000 \
  -e "MB_DB_TYPE=postgres" \
  -e "MB_DB_DBNAME=metabase" \
  -e "MB_DB_PORT=5432" \
  -e "MB_DB_USER=postgres" \
  -e "MB_DB_PASS=<password>" \
  -e "MB_DB_HOST=<host>" \
   --name metabase metabase/metabase
docker logs -f metabase
```

Make sure DB user has read access to all tables:
```sql
GRANT SELECT ON ALL TABLES IN SCHEMA public TO "<db user>"
```
