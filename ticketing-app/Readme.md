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

# Skaffold

start all containers locally via skaffold:
`skaffold dev`

# Docker

generate image with a given tag:
`docker build -t [domain/service-name:0.0.1] .`

run image:
`docker run [domain/service-name:0.0.1]`

login to docker hub:
`docker login`

# Kubernetes

run kubernetes to create objects from a yaml file:
`kubectl apply -f [file.yaml]`

run kubernetes to create objects from all yaml files:
`kubectl apply -f .`

get list of running pods:
`kubectl get pods`

start shell inside container:
`kubectl exec -it [pod_name] sh`

get log from a pod:
`kubectl logs [pod_name]`

delete a pod:
`kubectl delete pod [pod_name]`

print information about a running pod:
`kubectl describe pod [pod_name]`

restart deployment after pushing image to docker hub:
`kubectl rollout restart deployment [depl_name]`

add a secret:
`kubectl create secret generic [secret_name] --from-literal=[secret_key]=[secret_value]`

install rabbitmq:
```
kubectl apply -f "https://github.com/rabbitmq/cluster-operator/releases/latest/download/cluster-operator.yml"
kubectl krew install rabbitmq
```

# Misc

powershell command to give a command an alias:
`Set-Alias k kubectl`

install Ingress NGINX:
`kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.5.1/deploy/static/provider/cloud/deploy.yaml`

add following line to hosts file:
127.0.0.1 host_domain_from_ingress

# Microservices architecture explained
- each microservice has its own database and it is not allowed for a microservice to look directly into a database belonging to some other microservice
- the way those microservices communicate is via async messages/events
- the event bus/message queue takes care of listening to or publishing messages to all listeners
- multiple instances of the same microservice need to bind to the same queue so that events don't get duplicated
- each microservice will internally store whatever data they need coming events (microservice 1 fires an event when a record is inserted and microservice 2 listens to the event and saved the id of the record to use it internally)
- each event will have a version flag which will be unique per record(microservice 1 fires 3 events: record created, record updated1, record updated2. microservice 2 listens to those events and can possibly process them in any order if there are multiple instances available. When processing the event, the version flag related to the record is the deciding factor of the order that events should be processed. record created has version 1, record updated1 has version 2, record updated2 has version 3. if record updated1 is processed before record created, then the event will be not acknowledged and will go back into queue)
- the version flag is handled with optimistic concurrency control

