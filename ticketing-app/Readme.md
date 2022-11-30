## Project details

# Google Cloud

login to google:
`gcloud auth application-default login`

init:
`gcloud init`
`gcloud components install gke-gcloud-auth-plugin`

if you don't want to run docker locally, close docker desktop and run:
`gcloud components install kubectl`

add cloud cluster context:
`gcloud container clusters get-credentials [cluster_name]`
