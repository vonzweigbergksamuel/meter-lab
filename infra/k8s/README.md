# Manual setup on GKE

## Install the `cert-manager`

1.

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/latest/download/cert-manager.yaml
```

2. Confirm that its running

```bash
kubectl get pods -n cert-manager
```

You should see something like this: 

```bash
cert-manager-xxxx       Running
cert-manager-cainjector Running
cert-manager-webhook    Running
```

## Reserve a global static IP

1. 

```bash
gcloud compute addresses create travindex-ingress-ip --global
```

2. Get the ip

```bash
gcloud compute addresses describe travindex-ingress-ip --global
```

This ip should you add as DNS to your domains that you have in the ingress.yaml file