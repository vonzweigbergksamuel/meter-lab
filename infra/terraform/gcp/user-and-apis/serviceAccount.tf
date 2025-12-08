# Roles for infra management
resource "google_project_iam_member" "container_admin" {
  project = var.project_id
  role    = "roles/container.admin"
  member  = "serviceAccount:${var.email}"
}

resource "google_project_iam_member" "network_admin" {
  project = var.project_id
  role    = "roles/compute.networkAdmin"
  member  = "serviceAccount:${var.email}"
}

resource "google_project_iam_member" "artifactregistry_admin" {
  project = var.project_id
  role    = "roles/artifactregistry.admin"
  member  = "serviceAccount:${var.email}"
}

resource "google_project_iam_member" "storage_admin" {
  project = var.project_id
  role    = "roles/storage.admin"
  member  = "serviceAccount:${var.email}"
}

resource "google_project_iam_member" "logging_logWriter" {
  project = var.project_id
  role    = "roles/logging.logWriter"
  member  = "serviceAccount:${var.email}"
}

resource "google_project_iam_member" "monitoring_metricWriter" {
  project = var.project_id
  role    = "roles/monitoring.metricWriter"
  member  = "serviceAccount:${var.email}"
}

resource "google_project_iam_member" "secretmanager_admin" {
  project = var.project_id
  role    = "roles/secretmanager.admin"
  member  = "serviceAccount:${var.email}"
}

resource "google_project_iam_member" "cloudbuild_serviceAccountUser" {
  project = var.project_id
  role    = "roles/cloudbuild.builds.builder"
  member  = "serviceAccount:${var.email}"
}

resource "google_project_iam_member" "serviceusage_serviceUsageAdmin" {
  project = var.project_id
  role    = "roles/serviceusage.serviceUsageAdmin"
  member  = "serviceAccount:${var.email}"
}

resource "google_project_iam_member" "serviceusage_ServiceAccountUser" {
  project = var.project_id
  role    = "roles/iam.serviceAccountUser"
  member  = "serviceAccount:${var.email}"
}

resource "google_project_iam_member" "serviceusage_CloudBuild" {
  project = var.project_id
  role    = "roles/cloudbuild.connectionAdmin"
  member  = "serviceAccount:${var.email}"
}
