## Steps to use Docker/Kubernetes

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

# Misc
powershell command to give a command an alias:
`Set-Alias k kubectl`

install Ingress NGINX:
`kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.5.1/deploy/static/provider/cloud/deploy.yaml`

add following line to hosts file:
127.0.0.1 host_domain_from_ingress