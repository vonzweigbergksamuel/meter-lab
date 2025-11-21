terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
  }
  backend "gcs" {
    prefix = "cluster/terraform-state"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}
